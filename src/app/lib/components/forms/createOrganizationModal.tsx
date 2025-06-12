import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Save } from 'lucide-react';
import { CreateOrganizationRequestDTO, OrganizationService } from '@/app/lib/api/services/organisationService';

interface CreateOrganizationModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface FormInputs extends Omit<CreateOrganizationRequestDTO, 'ownerUserId'> {
    organizationName: string;
    industry: string;
    language: string;
}

// Common industries for the dropdown
const INDUSTRIES = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Manufacturing',
    'Retail',
    'Construction',
    'Transportation',
    'Energy',
    'Agriculture',
    'Media',
    'Real Estate',
    'Consulting',
    'Government',
    'Non-Profit',
    'Other'
];

// Common languages
const LANGUAGES = [
    'English',
    'Spanish',
    'French',
    'German',
    'Italian',
    'Portuguese',
    'Dutch',
    'Chinese',
    'Japanese',
    'Korean',
    'Arabic',
    'Russian',
    'Other'
];

const CreateOrganizationModal: React.FC<CreateOrganizationModalProps> = ({
                                                                             open,
                                                                             onClose,
                                                                             onSuccess
                                                                         }) => {
    const organizationService = OrganizationService.getInstance();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<FormInputs>({
        defaultValues: {
            organizationName: '',
            industry: '',
            language: 'English'
        }
    });

    // Mutation for creating an organization
    const createMutation = useMutation({
        mutationFn: (data: CreateOrganizationRequestDTO) =>
            organizationService.createOrganization(data),
        onSuccess: () => {
            onSuccess();
            reset();
        },
        onError: (error) => {
            console.error('Failed to create organization:', error);
        }
    });

    // Handle form submission
    const onSubmit = (data: FormInputs) => {
        const ownerUserId = '0';

        createMutation.mutate({
            ...data,
            ownerUserId
        });
    };

    // Handle modal close and reset
    const handleClose = () => {
        if (!createMutation.isPending) {
            onClose();
            reset();
            createMutation.reset();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 2 }
            }}
        >
            <DialogTitle>
                Create New Organization
            </DialogTitle>

            <DialogContent>
                {createMutation.error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {createMutation.error instanceof Error
                            ? createMutation.error.message
                            : 'Failed to create organization. Please try again.'}
                    </Alert>
                )}

                <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        name="organizationName"
                        control={control}
                        rules={{
                            required: 'Organization name is required',
                            minLength: {
                                value: 2,
                                message: 'Organization name must be at least 2 characters'
                            }
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                margin="normal"
                                required
                                fullWidth
                                label="Organization Name"
                                error={!!errors.organizationName}
                                helperText={errors.organizationName?.message}
                                disabled={createMutation.isPending}
                            />
                        )}
                    />

                    <Controller
                        name="industry"
                        control={control}
                        rules={{ required: 'Industry is required' }}
                        render={({ field }) => (
                            <FormControl
                                fullWidth
                                margin="normal"
                                error={!!errors.industry}
                                disabled={createMutation.isPending}
                            >
                                <InputLabel>Industry *</InputLabel>
                                <Select
                                    {...field}
                                    label="Industry *"
                                >
                                    {INDUSTRIES.map((industry) => (
                                        <MenuItem key={industry} value={industry}>
                                            {industry}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.industry && (
                                    <FormHelperText>{errors.industry.message}</FormHelperText>
                                )}
                            </FormControl>
                        )}
                    />

                    <Controller
                        name="language"
                        control={control}
                        rules={{ required: 'Language is required' }}
                        render={({ field }) => (
                            <FormControl
                                fullWidth
                                margin="normal"
                                error={!!errors.language}
                                disabled={createMutation.isPending}
                            >
                                <InputLabel>Language *</InputLabel>
                                <Select
                                    {...field}
                                    label="Language *"
                                >
                                    {LANGUAGES.map((language) => (
                                        <MenuItem key={language} value={language}>
                                            {language}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.language && (
                                    <FormHelperText>{errors.language.message}</FormHelperText>
                                )}
                            </FormControl>
                        )}
                    />
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 1 }}>
                <Button
                    onClick={handleClose}
                    disabled={createMutation.isPending}
                >
                    Cancel
                </Button>
                <LoadingButton
                    onClick={handleSubmit(onSubmit)}
                    loading={createMutation.isPending}
                    variant="contained"
                    startIcon={<Save />}
                    loadingPosition="start"
                >
                    Create Organization
                </LoadingButton>
            </DialogActions>
        </Dialog>
    );
};

export default CreateOrganizationModal;