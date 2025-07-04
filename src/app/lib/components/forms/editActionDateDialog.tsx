import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
    Typography,
    Box,
    CircularProgress,
    Alert
} from '@mui/material';
import { Calendar, Save } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ActionService from '@/app/lib/api/services/actionService';
import { useToast } from '@/app/lib/hooks/useToast';
import { format } from 'date-fns';

interface EditActionDateDialogProps {
    open: boolean;
    onClose: () => void;
    action: {
        id: number;
        slotId?: number;
        date: string;
        name: string;
        entityName?: string;
    } | null;
    projectId: number;
}

const EditActionDateDialog: React.FC<EditActionDateDialogProps> = ({
                                                                       open,
                                                                       onClose,
                                                                       action,
                                                                       projectId
                                                                   }) => {
    const [selectedDate, setSelectedDate] = useState('');
    const [error, setError] = useState<string | null>(null);
    const queryClient = useQueryClient();
    const { showToast } = useToast();
    const actionService = ActionService.getInstance();

    useEffect(() => {
        if (action && open) {
            try {
                
                const dateObj = new Date(action.date);
                if (isNaN(dateObj.getTime())) {
                    console.error('Invalid date:', action.date);
                    setError('Invalid date format in action data');
                    setSelectedDate('');
                } else {
                    
                    const formattedDate = format(dateObj, 'yyyy-MM-dd');
                    setSelectedDate(formattedDate);
                    setError(null);
                }
            } catch (error) {
                console.error('Error formatting date:', error);
                setError('Error formatting date');
                setSelectedDate('');
            }
        }
    }, [action, open]);

    const updateActionDateMutation = useMutation({
        mutationFn: async (data: { slotId: number; newDate: string }) => {
            
            const currentSlot = await actionService.getActionPlanSlotById(data.slotId);

            
            const updatedSlot = {
                ...currentSlot,
                slotDate: data.newDate
            };

            return await actionService.updateActionPlanEntitySlot(updatedSlot);
        },
        onSuccess: () => {
            showToast('Action date updated successfully', 'success');
            queryClient.invalidateQueries({ queryKey: ['actionPlan', projectId] });
            queryClient.invalidateQueries({ queryKey: ['actionSlotDetails'] });
            onClose();
        },
        onError: (error) => {
            console.error('Error updating action date:', error);
            setError('Failed to update action date. Please try again.');
            showToast('Failed to update action date', 'error');
        }
    });

    const handleSave = () => {
        if (!action?.slotId) {
            setError('Cannot update this action - no slot ID available');
            return;
        }

        if (!selectedDate) {
            setError('Please select a date');
            return;
        }

        setError(null);
        updateActionDateMutation.mutate({
            slotId: action.slotId,
            newDate: selectedDate
        });
    };

    const handleClose = () => {
        setError(null);
        setSelectedDate('');
        onClose();
    };

    if (!action) return null;

    
    const formatSafeDate = (dateString: string) => {
        try {
            const dateObj = new Date(dateString);
            if (isNaN(dateObj.getTime())) {
                return 'Invalid Date';
            }
            return format(dateObj, 'yyyy-MM-dd');
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Invalid Date';
        }
    };

    const formatDisplayDate = (dateString: string) => {
        try {
            const dateObj = new Date(dateString);
            if (isNaN(dateObj.getTime())) {
                return 'Invalid Date';
            }
            return format(dateObj, 'MMM dd, yyyy');
        } catch (error) {
            console.error('Error formatting display date:', error);
            return 'Invalid Date';
        }
    };

    const originalDate = formatSafeDate(action.date);
    const hasChanges = selectedDate !== originalDate && selectedDate !== '';

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>
                <Box display="flex" alignItems="center" gap={1}>
                    <Calendar size={20} />
                    Edit Action Date
                </Box>
            </DialogTitle>

            <DialogContent>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        {action.name}
                    </Typography>
                    {action.entityName && (
                        <Typography variant="body2" color="text.secondary">
                            Target: {action.entityName}
                        </Typography>
                    )}
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <TextField
                    label="Action Date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    fullWidth
                    InputLabelProps={{
                        shrink: true,
                    }}
                    helperText={`Original date: ${formatDisplayDate(action.date)}`}
                />

                {hasChanges && selectedDate && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                        <Typography variant="body2" color="info.contrastText">
                            Date will be changed from <strong>{formatDisplayDate(action.date)}</strong> to <strong>{formatDisplayDate(selectedDate)}</strong>
                        </Typography>
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button
                    onClick={handleClose}
                    disabled={updateActionDateMutation.isPending}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    disabled={!hasChanges || updateActionDateMutation.isPending || !action.slotId}
                    startIcon={updateActionDateMutation.isPending ? <CircularProgress size={20} /> : <Save />}
                >
                    {updateActionDateMutation.isPending ? 'Saving...' : 'Save Date'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditActionDateDialog;