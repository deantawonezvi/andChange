import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField,
    Typography
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { SponsorService } from '@/app/lib/api/services/sponsorService';
import { IndividualService } from '@/app/lib/api/services/individualService';
import { QuestionWithRating } from '@/app/lib/components/forms/formComponents';
import ImpactedGroupService from "@/app/lib/api/services/impactedGroupService";
import { useQueryClient } from "@tanstack/react-query";

interface SponsorAssessmentFormData {
    firstName: string;
    lastName: string;
    entityName: string;
    sponsorTitle: string;
    absupAwareness: number;
    absupBuyin: number;
    absupSkill: number;
    absupUse: number;
    absupProficiency: number;
    anticipatedResistanceLevel: number;
    anticipatedResistanceDriver: 'AWARENESS' | 'BUYIN' | 'SKILL' | 'USE' | 'PROFICIENCY';
    specialTactics: string;
}

interface SponsorAssessmentPopupProps {
    open: boolean;
    onClose: () => void;
    impactedGroupId: number;
    projectId: number;
    organizationId: number;
    onSuccess?: () => void;
}

const SponsorAssessmentPopup: React.FC<SponsorAssessmentPopupProps> = ({
                                                                           open,
                                                                           onClose,
                                                                           impactedGroupId,
                                                                           projectId,
                                                                           organizationId,
                                                                           onSuccess
                                                                       }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors }
    } = useForm<SponsorAssessmentFormData>({
        defaultValues: {
            firstName: '',
            lastName: '',
            entityName: '',
            sponsorTitle: '',
            absupAwareness: 3,
            absupBuyin: 3,
            absupSkill: 3,
            absupUse: 3,
            absupProficiency: 3,
            anticipatedResistanceLevel: 3,
            anticipatedResistanceDriver: 'AWARENESS',
            specialTactics: ''
        }
    });

    const onSubmit = async (data: SponsorAssessmentFormData) => {
        setIsLoading(true);
        setError(null);

        try {
            const sponsorService = SponsorService.getInstance();
            const individualService = IndividualService.getInstance();
            const impactedGroupService = ImpactedGroupService.getInstance();

            const individual = await individualService.createIndividual({
                organizationId,
                firstName: data.firstName,
                lastName: data.lastName
            });

            const sponsor = await sponsorService.createSponsor({
                projectId,
                entityName: data.entityName,
                individualIds: [individual.id!]
            });

            await sponsorService.updateProjectABSUP({
                entityId: sponsor.id!,
                absupAwareness: data.absupAwareness,
                absupBuyin: data.absupBuyin,
                absupSkill: data.absupSkill,
                absupUse: data.absupUse,
                absupProficiency: data.absupProficiency
            });

            await sponsorService.updateAnagraphicData({
                entityId: sponsor.id!,
                entityName: data.entityName,
                roleDefinition: data.sponsorTitle,
                individualsToAdd: [],
                individualsToRemove: []
            });

            await impactedGroupService.updateEntities({
                impactGroupId: impactedGroupId,
                sponsorEntitiesToAdd: [sponsor.id!],
                sponsorEntitiesToRemove: [],
                momEntitiesToAdd: [],
                momEntitiesToRemove: [],
                mopEntitiesToAdd: [],
                mopEntitiesToRemove: []
            });

            queryClient.invalidateQueries({
                queryKey: ['impacted-groups', 'project', projectId]
            });
            queryClient.invalidateQueries({
                queryKey: ['impacted-group', impactedGroupId]
            });

            location.reload();


            onSuccess?.();
            handleClose();
        } catch (err) {
            console.error('Error creating sponsor:', err);
            setError(err instanceof Error ? err.message : 'Failed to create sponsor');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        reset();
        setError(null);
        onClose();
    };

    const questionConfigs = [
        {
            fieldName: 'absupAwareness' as const,
            label: 'Awareness of the role of leadership in change',
            tooltip: 'How aware is this executive of their role in leading change?',
            marks: [
                { value: 1, label: 'Unaware' },
                { value: 3, label: 'Partial' },
                { value: 5, label: 'Clear' }
            ]
        },
        {
            fieldName: 'absupBuyin' as const,
            label: 'Buy-in to the process of change management',
            tooltip: 'How committed is this executive to the change management process?',
            marks: [
                { value: 1, label: 'Limited' },
                { value: 3, label: 'Some' },
                { value: 5, label: 'Full' }
            ]
        },
        {
            fieldName: 'absupSkill' as const,
            label: 'Skills formally developed in a leader\'s role in change',
            tooltip: 'What level of change leadership skills does this executive have?',
            marks: [
                { value: 1, label: 'None' },
                { value: 3, label: 'Basic' },
                { value: 5, label: 'Advanced' }
            ]
        },
        {
            fieldName: 'absupUse' as const,
            label: 'Usage of the skills in being visible and building a coalition for the change',
            tooltip: 'How consistently does this executive use their change leadership skills?',
            marks: [
                { value: 1, label: 'Rare' },
                { value: 3, label: 'Occasional' },
                { value: 5, label: 'Consistent' }
            ]
        },
        {
            fieldName: 'absupProficiency' as const,
            label: 'Proficiency in leading change',
            tooltip: 'What is this executive\'s overall proficiency in leading change?',
            marks: [
                { value: 1, label: 'Novice' },
                { value: 3, label: 'Competent' },
                { value: 5, label: 'Expert' }
            ]
        },
        {
            fieldName: 'anticipatedResistanceLevel' as const,
            label: 'What is the anticipated level of resistance for this group?',
            tooltip: 'Based on your assessment, what level of resistance do you expect from this executive?',
            marks: [
                { value: 1, label: 'Low' },
                { value: 3, label: 'Medium' },
                { value: 5, label: 'High' }
            ]
        }
    ];

    const resistanceDriverOptions = [
        { value: 'AWARENESS', label: 'Awareness of the role of leadership in change' },
        { value: 'BUYIN', label: 'Buy-in to the process of change management' },
        { value: 'SKILL', label: 'Skills formally developed in a leader\'s role in change' },
        { value: 'USE', label: 'Usage of the skills in being visible and building a coalition for the change' },
        { value: 'PROFICIENCY', label: 'Proficiency in leading change' }
    ];

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    minHeight: '600px'
                }
            }}
        >
            <DialogTitle sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                pb: 1
            }}>
                <Typography variant="h6" component="div">
                    Leadership Assessment
                </Typography>
                <IconButton onClick={handleClose} size="small">
                    <Close />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ pt: 2 }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box component="form" noValidate>
                    {/* Name Fields */}
                    <Box sx={{ mb: 4 }}>
                        <Controller
                            name="firstName"
                            control={control}
                            rules={{ required: 'First name is required' }}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="First Name"
                                    placeholder="Enter the first name"
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                    variant="outlined"
                                    disabled={isLoading}
                                />
                            )}
                        />
                    </Box>
                    <Box sx={{ mb: 4 }}>
                        <Controller
                            name="lastName"
                            control={control}
                            rules={{ required: 'Last name is required' }}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Last Name"
                                    placeholder="Enter the last name"
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                    variant="outlined"
                                    disabled={isLoading}
                                />
                            )}
                        />
                    </Box>

                    {/* Title Field */}
                    <Box sx={{ mb: 4 }}>
                        <Controller
                            name="sponsorTitle"
                            control={control}
                            rules={{ required: 'Title is required' }}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Title"
                                    placeholder="Enter the preferred title to use in communications"
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                    variant="outlined"
                                    disabled={isLoading}
                                />
                            )}
                        />
                    </Box>

                    {/* Questions using the same config as team leader */}
                    {questionConfigs.map((config) => (
                        <Box key={config.fieldName} sx={{ mb: 3 }}>
                            <QuestionWithRating
                                label={config.label}
                                tooltip={config.tooltip}
                                control={control}
                                fieldName={config.fieldName}
                                type="slider"
                                min={1}
                                max={5}
                                marks={config.marks}
                                errors={errors}
                                required={true}
                            />
                        </Box>
                    ))}

                    {/* Resistance Driver Radio Group */}
                    <Box sx={{ mb: 4 }}>
                        <QuestionWithRating
                            label="Which area is likely to be the strongest driver of resistance?"
                            tooltip="Select the ABSUP dimension that is most likely to cause resistance for this executive."
                            control={control}
                            fieldName="anticipatedResistanceDriver"
                            type="radio"
                            options={resistanceDriverOptions}
                            optionValueKey="value"
                            optionLabelKey="label"
                            orientation="vertical"
                            errors={errors}
                            required={true}
                        />
                    </Box>

                    {/* Special Tactics Text Area */}
                    <Box sx={{ mb: 2 }}>
                        <QuestionWithRating
                            label="What special tactics need to be considered?"
                            tooltip="Enter any specific strategies, approaches, or considerations needed for this executive or group."
                            control={control}
                            fieldName="specialTactics"
                            type="text"
                            multiline={true}
                            errors={errors}
                            required={false}
                        />
                    </Box>

                    {/* Hidden Entity Name Field - auto-populated */}
                    <Controller
                        name="entityName"
                        control={control}
                        render={({ field }) => {

                            const firstName = watch('firstName');
                            const lastName = watch('lastName');
                            if (firstName && lastName && !field.value) {
                                field.onChange(`${firstName} ${lastName}`);
                            }
                            return <input type="hidden" {...field} />;
                        }}
                    />
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 1 }}>
                <Button
                    onClick={handleClose}
                    variant="outlined"
                    disabled={isLoading}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit(onSubmit)}
                    variant="contained"
                    disabled={isLoading}
                    startIcon={isLoading ? <CircularProgress size={20} /> : null}
                >
                    Save Assessment
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SponsorAssessmentPopup;