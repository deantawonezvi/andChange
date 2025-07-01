import React, { useState } from 'react';
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Alert,
    Box
} from '@mui/material';
import { PlayCircle, AlertTriangle } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ActionService, { CreateActionPlanRequestDTO } from '@/app/lib/api/services/actionService';
import { useToast } from '@/app/lib/hooks/useToast';

interface GenerateActionsButtonProps {
    projectId: number;
    onSuccess?: () => void;
}

const GenerateActionsButton: React.FC<GenerateActionsButtonProps> = ({ projectId, onSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    const { data: existingActionPlan } = useQuery({
        queryKey: ['actionPlan', projectId],
        queryFn: () => ActionService.getInstance().getActionPlanByProjectId(projectId),
        enabled: !!projectId
    });

    const generateActionsMutation = useMutation({
        mutationFn: (data: CreateActionPlanRequestDTO) => {
            return ActionService.getInstance().createActionPlan(data);
        },
        onSuccess: () => {
            showToast('Actions generated successfully', 'success');
            queryClient.invalidateQueries({ queryKey: ['actionPlan', projectId] });
            if (onSuccess) onSuccess();
        },
        onError: (error) => {
            console.log('Error generating actions:', error);
            showToast('Failed to generate actions. Please try again.', 'error');
        },
        onSettled: () => {
            setIsLoading(false);
            setShowConfirmDialog(false);
        }
    });

    const handleGenerateActions = () => {

        if (existingActionPlan) {
            setShowConfirmDialog(true);
        } else {

            executeGeneration();
        }
    };

    const executeGeneration = () => {
        setIsLoading(true);

        const requestData: CreateActionPlanRequestDTO = {
            projectId: projectId,
            additiveProcess: false,
            entityABSUPSpecification: {
                "IG": [
                    "AWARENESS",
                    "BUYIN",
                    "SKILL",
                    "USE"
                ],
                "MOP": [
                    "AWARENESS",
                    "BUYIN",
                    "SKILL"
                ],
                "SPONSOR": [
                    "AWARENESS",
                    "BUYIN",
                    "SKILL"
                ]
            }
        };

        generateActionsMutation.mutate(requestData);
    };

    const handleConfirmGeneration = () => {
        setShowConfirmDialog(false);
        executeGeneration();
    };

    const handleCancelGeneration = () => {
        setShowConfirmDialog(false);
    };

    return (
        <>
            <Button
                variant="contained"
                color="primary"
                onClick={handleGenerateActions}
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} /> : <PlayCircle />}
            >
                {isLoading ? 'Generating...' : 'Generate Actions'}
            </Button>

            {/* Confirmation Dialog */}
            <Dialog
                open={showConfirmDialog}
                onClose={handleCancelGeneration}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AlertTriangle size={24} color="orange" />
                    Replace Existing Action Plan?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        This project already has an existing action plan. Generating new actions will replace the current action plan and all its associated data.
                    </DialogContentText>
                    <Box mt={2}>
                        <Alert severity="warning">
                            <strong>Warning:</strong> This action cannot be undone. All current actions, schedules, and progress will be lost.
                        </Alert>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCancelGeneration}
                        variant="outlined"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmGeneration}
                        variant="contained"
                        color="warning"
                        startIcon={<PlayCircle />}
                    >
                        Generate
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default GenerateActionsButton;