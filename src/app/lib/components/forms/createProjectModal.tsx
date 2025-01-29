import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
} from '@mui/material';
import { ProjectService, CreateProjectRequestDTO } from '@/app/lib/api/services/projectService';

interface CreateProjectModalProps {
    open: boolean;
    onClose: () => void;
    organizationId?: number;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
                                                                   open,
                                                                   onClose,
                                                                   organizationId = 1,
                                                               }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<CreateProjectRequestDTO>();

    const queryClient = useQueryClient();
    const projectService = ProjectService.getInstance();

    const createProjectMutation = useMutation({
        mutationFn: (data: CreateProjectRequestDTO) => projectService.createProject(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            reset();
            onClose();
        }
    });

    const onSubmit = (data: CreateProjectRequestDTO) => {
        createProjectMutation.mutate({
            ...data,
            organizationId
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogContent>
                    {createProjectMutation.isError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {createProjectMutation.error instanceof Error
                                ? createProjectMutation.error.message
                                : 'Failed to create project'}
                        </Alert>
                    )}

                    <TextField
                        autoFocus
                        margin="dense"
                        label="Project Name"
                        fullWidth
                        variant="outlined"
                        {...register('projectName', {
                            required: 'Project name is required',
                            minLength: { value: 3, message: 'Minimum length is 3 characters' }
                        })}
                        error={!!errors.projectName}
                        helperText={errors.projectName?.message}
                        sx={{ mt: 2 }}
                    />
                </DialogContent>

                <DialogActions sx={{ p: 2 }}>
                    <Button
                        onClick={onClose}
                        disabled={createProjectMutation.isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={createProjectMutation.isPending}
                    >
                        Create Project
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default CreateProjectModal;