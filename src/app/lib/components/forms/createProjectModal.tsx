import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    Select,
    InputLabel,
    MenuItem,
    FormHelperText,
    FormControl,
} from '@mui/material';
import { ProjectService, CreateProjectRequestDTO } from '@/app/lib/api/services/projectService';
import { OrganizationService } from "@/app/lib/api/services/organisationService";

interface CreateProjectModalProps {
    open: boolean;
    onClose: () => void;
}

interface FormInputs extends CreateProjectRequestDTO {
    projectName: string;
    organizationId: number;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
                                                                   open,
                                                                   onClose,
                                                               }) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<FormInputs>({
        defaultValues: {
            projectName: '',
            organizationId: 0
        }
    });

    const queryClient = useQueryClient();
    const projectService = ProjectService.getInstance();
    const organizationService = OrganizationService.getInstance();

    const { data: organizations, isLoading: isLoadingOrgs } = useQuery({
        queryKey: ['accessible-organizations'],
        queryFn: () => organizationService.getAccessibleOrganizations(),
    });

    const createProjectMutation = useMutation({
        mutationFn: (data: FormInputs) => projectService.createProject(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            reset();
            onClose();
        }
    });

    const handleClose = () => {
        reset();
        onClose();
    };

    if (isLoadingOrgs) {
        return null;
    }

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <form onSubmit={handleSubmit((data) => createProjectMutation.mutate(data))}>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogContent>
                    {createProjectMutation.isError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {createProjectMutation.error instanceof Error
                                ? createProjectMutation.error.message
                                : 'Failed to create project'}
                        </Alert>
                    )}

                    <Controller
                        name="projectName"
                        control={control}
                        rules={{
                            required: 'Project name is required',
                            minLength: { value: 3, message: 'Minimum length is 3 characters' }
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                autoFocus
                                margin="dense"
                                label="Project Name"
                                fullWidth
                                variant="outlined"
                                error={!!errors.projectName}
                                helperText={errors.projectName?.message}
                                sx={{ mt: 2 }}
                            />
                        )}
                    />

                    <Controller
                        name="organizationId"
                        control={control}
                        rules={{ required: 'Please select an organization' }}
                        render={({ field }) => (
                            <FormControl
                                fullWidth
                                error={!!errors.organizationId}
                                sx={{ mt: 2, mb: 2 }}
                            >
                                <InputLabel>Organization</InputLabel>
                                <Select
                                    {...field}
                                    label="Organization"
                                >
                                    {organizations?.map((org) => (
                                        <MenuItem
                                            key={org.id}
                                            value={org.id}
                                        >
                                            {org.organizationName} - {org.industry}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.organizationId && (
                                    <FormHelperText>
                                        {errors.organizationId.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        )}
                    />
                </DialogContent>

                <DialogActions sx={{ p: 2 }}>
                    <Button
                        onClick={handleClose}
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