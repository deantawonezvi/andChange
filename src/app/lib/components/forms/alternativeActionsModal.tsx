import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    Card,
    CardContent,
    Chip,
    Grid,
    IconButton,
    CircularProgress,
    Alert
} from '@mui/material';
import { X as Close, RefreshCw } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ActionService, { ActionSummaryDTO } from '@/app/lib/api/services/actionService';
import { useToast } from '@/app/lib/hooks/useToast';

import { ActionOptionsForActionPlanEntitySlotDTO } from '@/app/lib/api/services/actionService';

interface AlternativeActionsModalProps {
    open: boolean;
    onClose: () => void;
    slotId: number;
    currentAction?: {
        date: string;
        absupCategory: string;
        sender: string;
        receiver: string;
    };
    projectId: number;
}

const AlternativeActionsModal: React.FC<AlternativeActionsModalProps> = ({
                                                                             open,
                                                                             onClose,
                                                                             slotId,
                                                                             currentAction,
                                                                             projectId
                                                                         }) => {
    const [selectedActionId, setSelectedActionId] = useState<number | null>(null);
    const actionService = ActionService.getInstance();
    const { showToast } = useToast();
    const queryClient = useQueryClient();

    // Fetch action options
    const { data: actionOptions, isLoading, error } = useQuery<ActionOptionsForActionPlanEntitySlotDTO>({
        queryKey: ['actionOptions', slotId],
        queryFn: async () => {
            return await actionService.getActionOptionsForSlot(slotId);
        },
        enabled: open && !!slotId,
    });

    // Update action mutation
    const updateActionMutation = useMutation({
        mutationFn: async (actionId: number) => {
            // Get current slot details
            const slotDetails = await actionService.getActionPlanSlotById(slotId);

            // Update the slot with new action ID
            const updatedSlot = {
                ...slotDetails,
                actionId: actionId,
                slotState: 'ACCEPTED' as const
            };

            return await actionService.updateActionPlanEntitySlot(updatedSlot);
        },
        onSuccess: () => {
            showToast('Action updated successfully!', 'success');
            queryClient.invalidateQueries({ queryKey: ['actionPlan', projectId] });
            queryClient.invalidateQueries({ queryKey: ['actionSlotDetails', slotId] });
            onClose();
        },
        onError: (error) => {
            console.error('Error updating action:', error);
            showToast('Failed to update action. Please try again.', 'error');
        }
    });

    const handleSelectAction = (actionId: number) => {
        setSelectedActionId(actionId);
    };

    const handleConfirmSelection = () => {
        if (selectedActionId) {
            updateActionMutation.mutate(selectedActionId);
        }
    };

    const handleRollAgain = () => {
        // Trigger a refetch of action options
        queryClient.invalidateQueries({ queryKey: ['actionOptions', slotId] });
    };

    const mapWhoCode = (code: string): string => {
        const mapping: Record<string, string> = {
            'E_IG': 'Impacted Group',
            'E_MOP': 'Team Leader',
            'E_SP': 'Sponsor / Executive',
            'E_CM': 'Change Manager',
            'MULTIPLE': 'Multiple',
            'AUTHOR': 'Author'
        };
        return mapping[code] || code;
    };

    if (isLoading) {
        return (
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
                <DialogContent>
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
                        <CircularProgress />
                    </Box>
                </DialogContent>
            </Dialog>
        );
    }

    if (error) {
        return (
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        Alternative Actions
                        <IconButton onClick={onClose} size="small">
                            <Close />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Alert severity="error">
                        Failed to load alternative actions. Please try again.
                    </Alert>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5" component="h2">
                        Alternative Actions
                    </Typography>
                    <IconButton onClick={onClose} size="small">
                        <Close />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent>
                {/* Current Action Details */}
                {currentAction && (
                    <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={3}>
                                <Typography variant="body2" color="textSecondary">
                                    Date:
                                </Typography>
                                <Typography variant="body1">
                                    {currentAction.date}
                                </Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography variant="body2" color="textSecondary">
                                    ABSUP Category:
                                </Typography>
                                <Typography variant="body1">
                                    {currentAction.absupCategory}
                                </Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography variant="body2" color="textSecondary">
                                    Sender:
                                </Typography>
                                <Typography variant="body1">
                                    {currentAction.sender}
                                </Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography variant="body2" color="textSecondary">
                                    Receiver:
                                </Typography>
                                <Typography variant="body1">
                                    {currentAction.receiver}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                )}

                {/* Roll Again Button */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshCw size={16} />}
                        onClick={handleRollAgain}
                        disabled={isLoading}
                    >
                        Roll Again
                    </Button>
                </Box>

                {/* Action Options */}
                <Grid container spacing={2}>
                    {actionOptions?.actionOptionsList.map((action: ActionSummaryDTO) => (
                        <Grid item xs={12} sm={6} md={4} key={action.id}>
                            <Card
                                sx={{
                                    cursor: 'pointer',
                                    border: selectedActionId === action.id ? 2 : 1,
                                    borderColor: selectedActionId === action.id ? 'primary.main' : 'grey.300',
                                    '&:hover': {
                                        borderColor: 'primary.main',
                                        boxShadow: 2
                                    }
                                }}
                                onClick={() => handleSelectAction(action.id || 0)}
                            >
                                <CardContent>
                                    {/* Action Verb */}
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="h6" component="h3">
                                            {action.actionCore.actionVerb.verbName}
                                        </Typography>
                                    </Box>

                                    {/* Action Name */}
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body1" fontWeight="medium">
                                            {action.actionCore.actionName}
                                        </Typography>
                                    </Box>

                                    {/* Receiver and Sender */}
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" color="textSecondary">
                                            <strong>Receiver:</strong> {mapWhoCode(action.actionCore.whoReceiver)}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            <strong>Sender:</strong> {mapWhoCode(action.actionCore.whoSender)}
                                        </Typography>
                                    </Box>

                                    {/* Assets */}
                                    {action.actionContentDTOList && action.actionContentDTOList.length > 0 && (
                                        <Box sx={{ mb: 1 }}>
                                            <Typography variant="body2" color="textSecondary" gutterBottom>
                                                Assets:
                                            </Typography>
                                            {action.actionContentDTOList.map((asset, index) => (
                                                <Box key={asset.id} sx={{ mb: 1 }}>
                                                    <Typography variant="body2" component="div">
                                                        <strong>Asset {index + 1}:</strong> {asset.aiGenerateAssetName}
                                                    </Typography>
                                                    {asset.outputFormat && (
                                                        <Chip
                                                            label={asset.outputFormat}
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{ mt: 0.5 }}
                                                        />
                                                    )}
                                                </Box>
                                            ))}
                                        </Box>
                                    )}

                                    {/* Sprint and Shareable indicators */}
                                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                        {action.actionCore.sprint && (
                                            <Chip label="Sprint" size="small" color="primary" />
                                        )}
                                        {action.actionCore.shareable && (
                                            <Chip label="Shareable" size="small" color="secondary" />
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {actionOptions?.actionOptionsList.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body1" color="textSecondary">
                            No alternative actions available for this slot.
                        </Typography>
                    </Box>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} variant="outlined">
                    Cancel
                </Button>
                <Button
                    onClick={handleConfirmSelection}
                    variant="contained"
                    disabled={!selectedActionId || updateActionMutation.isPending}
                >
                    {updateActionMutation.isPending ? (
                        <CircularProgress size={20} />
                    ) : (
                        'Confirm Selection'
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AlternativeActionsModal;