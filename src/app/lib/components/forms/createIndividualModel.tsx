import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Save } from 'lucide-react';
import IndividualService, { CreateIndividualRequestDTO } from '@/app/lib/api/services/individualService';

interface CreateIndividualModalProps {
    open: boolean;
    onClose: () => void;
    organizationId: number;
    onSuccess: () => void;
}

interface FormInputs extends Omit<CreateIndividualRequestDTO, 'organizationId'> {
    firstName: string;
    lastName: string;
}

const CreateIndividualModal: React.FC<CreateIndividualModalProps> = ({
                                                                         open,
                                                                         onClose,
                                                                         organizationId,
                                                                         onSuccess,
                                                                     }) => {

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormInputs>({
        defaultValues: {
            firstName: '',
            lastName: '',
        },
    });

    const createIndividualMutation = useMutation({
        mutationFn: (data: CreateIndividualRequestDTO) =>
            IndividualService.getInstance().createIndividual(data),
        onSuccess: () => {
            reset();
            onSuccess();
        },
    });

    const onSubmit = (data: FormInputs) => {
        createIndividualMutation.mutate({
            ...data,
            organizationId,
        });
    };

    const handleClose = () => {

        reset();
        createIndividualMutation.reset();
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>Add New Individual</DialogTitle>
            <DialogContent>
                <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
                    {createIndividualMutation.isError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            Error creating individual. Please try again.
                        </Alert>
                    )}

                    <Controller
                        name="firstName"
                        control={control}
                        rules={{ required: 'First name is required' }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="First Name"
                                fullWidth
                                margin="normal"
                                error={!!errors.firstName}
                                helperText={errors.firstName?.message}
                            />
                        )}
                    />

                    <Controller
                        name="lastName"
                        control={control}
                        rules={{ required: 'Last name is required' }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Last Name"
                                fullWidth
                                margin="normal"
                                error={!!errors.lastName}
                                helperText={errors.lastName?.message}
                            />
                        )}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={createIndividualMutation.isPending}>
                    Cancel
                </Button>
                <LoadingButton
                    onClick={handleSubmit(onSubmit)}
                    loading={createIndividualMutation.isPending}
                    variant="contained"
                    color="primary"
                    startIcon={<Save size={16} />}
                >
                    Save
                </LoadingButton>
            </DialogActions>
        </Dialog>
    );
};

export default CreateIndividualModal;