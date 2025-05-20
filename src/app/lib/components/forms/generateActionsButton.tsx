import React, { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { PlayCircle } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ActionService, { CreateActionPlanRequestDTO } from '@/app/lib/api/services/actionService';
import { useToast } from '@/app/lib/hooks/useToast';

interface GenerateActionsButtonProps {
    projectId: number;
    onSuccess?: () => void;
}

const GenerateActionsButton: React.FC<GenerateActionsButtonProps> = ({ projectId, onSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);
    const queryClient = useQueryClient();
    const { showToast } = useToast();

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
        }
    });

    const handleGenerateActions = () => {
        setIsLoading(true);

        // Create the request payload with the specified format
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

        // Call the mutation
        generateActionsMutation.mutate(requestData);
    };

    return (
        <Button
            variant="contained"
            color="primary"
            onClick={handleGenerateActions}
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : <PlayCircle />}
        >
            {isLoading ? 'Generating...' : 'Generate Actions'}
        </Button>
    );
};

export default GenerateActionsButton;