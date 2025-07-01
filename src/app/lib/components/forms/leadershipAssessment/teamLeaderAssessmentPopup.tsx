import React, { useEffect, useState } from 'react';
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
import { MOPService } from '@/app/lib/api/services/mopService';
import { IndividualService } from '@/app/lib/api/services/individualService';
import { QuestionWithRating } from '@/app/lib/components/forms/formComponents';
import ImpactedGroupService from "@/app/lib/api/services/impactedGroupService";
import { useQueryClient } from "@tanstack/react-query";

interface TeamLeaderAssessmentFormData {
    firstName: string;
    lastName: string;
    entityName: string;
    absupAwareness: number;
    absupBuyin: number;
    absupSkill: number;
    absupUse: number;
    absupProficiency: number;
    anticipatedResistanceLevel: number;
    anticipatedResistanceDriver: 'AWARENESS' | 'BUYIN' | 'SKILL' | 'USE' | 'PROFICIENCY';
    specialTactics: string;
}

interface TeamLeaderAssessmentPopupProps {
    open: boolean;
    onClose: () => void;
    impactedGroupId: number;
    projectId: number;
    organizationId: number
    onSuccess?: () => void;
}

const TeamLeaderAssessmentPopup: React.FC<TeamLeaderAssessmentPopupProps> = ({
                                                                                 open,
                                                                                 onClose,
                                                                                 impactedGroupId,
                                                                                 projectId,
                                                                                 organizationId,
                                                                                 onSuccess
                                                                             }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const queryClient = useQueryClient();


    const { control, handleSubmit, reset, formState: { errors } } = useForm<TeamLeaderAssessmentFormData>({
        defaultValues: {
            firstName: '',
            lastName: '',
            entityName: '',
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

    useEffect(() => {
        if (open) {
            reset({
                firstName: '',
                lastName: '',
                entityName: '',
                absupAwareness: 3,
                absupBuyin: 3,
                absupSkill: 3,
                absupUse: 3,
                absupProficiency: 3,
                anticipatedResistanceLevel: 3,
                anticipatedResistanceDriver: 'AWARENESS',
                specialTactics: ''
            });
        }
    }, [open, reset]);

    const onSubmit = async (data: TeamLeaderAssessmentFormData) => {
        setIsSubmitting(true);
        setError(null);

        let createdIndividualId: number | null = null;
        let createdMOPId: number | null = null;


        try {
            const individualService = IndividualService.getInstance();
            const mopService = MOPService.getInstance();
            const impactedGroupService = ImpactedGroupService.getInstance();

            const newIndividual = await individualService.createIndividual({
                organizationId: organizationId,
                firstName: data.firstName,
                lastName: data.lastName
            });

            createdIndividualId = newIndividual.id!;

            const result = await mopService.createMOP({
                projectId: projectId,
                entityName: data.entityName || `${data.firstName} ${data.lastName}`,
                roleDefinition: 'Team Leader',
                definitionOfAdoption: 'Leading team through change process',
                uniqueGroupConsiderations: data.specialTactics || '',
                hasEmail: true,
                membersColocated: true,
                virtualPreference: 3,
                whatsInItForMe: 'Leadership development and team success',
                individualIds: [createdIndividualId]
            });

            createdMOPId = result.id!;

            await mopService.updateProjectABSUP({
                entityId: createdMOPId,
                absupAwareness: data.absupAwareness,
                absupBuyin: data.absupBuyin,
                absupSkill: data.absupSkill,
                absupUse: data.absupUse,
                absupProficiency: data.absupProficiency
            });

            await impactedGroupService.updateEntities({
                impactGroupId: impactedGroupId,
                sponsorEntitiesToAdd: [],
                sponsorEntitiesToRemove: [],
                momEntitiesToAdd: [],
                momEntitiesToRemove: [],
                mopEntitiesToAdd: [createdMOPId],
                mopEntitiesToRemove: []
            });

            await queryClient.invalidateQueries({queryKey: ['leadership-structure', projectId]});

            location.reload();


            onSuccess?.();
            onClose();

        } catch (err) {
            console.error('Error creating team leader:', err);
            setError('Failed to create team leader. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            reset();
            setError(null);
            onClose();
        }
    };

    const questionConfigs = [
        {
            fieldName: 'absupAwareness' as const,
            label: 'Awareness of the role of leadership in change',
            tooltip: 'How aware is the team leader of their role in leading change?',
            marks: [
                { value: 1, label: 'Unaware' },
                { value: 3, label: 'Partial' },
                { value: 5, label: 'Clear' }
            ]
        },
        {
            fieldName: 'absupBuyin' as const,
            label: 'Buy-in to the process of change management',
            tooltip: 'How committed is the team leader to the change management process?',
            marks: [
                { value: 1, label: 'Limited' },
                { value: 3, label: 'Some' },
                { value: 5, label: 'Full' }
            ]
        },
        {
            fieldName: 'absupSkill' as const,
            label: 'Skills formally developed in the team leader\'s role in change',
            tooltip: 'What level of formal change leadership skills does the team leader have?',
            marks: [
                { value: 1, label: 'None' },
                { value: 3, label: 'Basic' },
                { value: 5, label: 'Advanced' }
            ]
        },
        {
            fieldName: 'absupUse' as const,
            label: 'Actively managing the change with their team',
            tooltip: 'How actively is the team leader managing change with their team?',
            marks: [
                { value: 1, label: 'Rare' },
                { value: 3, label: 'Occasional' },
                { value: 5, label: 'Consistent' }
            ]
        },
        {
            fieldName: 'absupProficiency' as const,
            label: 'Proficiency in leading change',
            tooltip: 'How proficient is the team leader at leading change initiatives?',
            marks: [
                { value: 1, label: 'Novice' },
                { value: 3, label: 'Competent' },
                { value: 5, label: 'Expert' }
            ]
        },
        {
            fieldName: 'anticipatedResistanceLevel' as const,
            label: 'What is the anticipated level of resistance for this group?',
            tooltip: 'Based on your assessment, what level of resistance do you expect from this team?',
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
        { value: 'SKILL', label: 'Skills formally developed in the team leader\'s role in change' },
        { value: 'USE', label: 'Actively managing the change with their team' },
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
                    maxHeight: '90vh'
                }
            }}
        >
            <DialogTitle sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #e0e0e0',
                pb: 2
            }}>
                <Typography variant="h6" component="div">
                    Add New Team Leader Assessment
                </Typography>
                <IconButton
                    onClick={handleClose}
                    size="small"
                    sx={{ color: 'grey.500' }}
                    disabled={isSubmitting}
                >
                    <Close />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ pt: 3 }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box component="form" noValidate>
                    <Box sx={{ mb: 4, mt: 2 }}>
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
                                    disabled={isSubmitting}
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
                                    disabled={isSubmitting}
                                />
                            )}
                        />
                    </Box>

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
                            tooltip="Select the ABSUP dimension that is most likely to cause resistance in this team."
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
                            tooltip="Enter any specific strategies, approaches, or considerations needed for this team leader or group."
                            control={control}
                            fieldName="specialTactics"
                            type="text"
                            multiline={true}
                            errors={errors}
                            required={false}
                        />
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions sx={{
                px: 3,
                py: 2,
                borderTop: '1px solid #e0e0e0'
            }}>
                <Button
                    onClick={handleSubmit(onSubmit)}
                    variant="contained"
                    fullWidth
                    disabled={isSubmitting}
                    sx={{
                        py: 1.5,
                        backgroundColor: '#000',
                        '&:hover': {
                            backgroundColor: '#333'
                        },
                        '&:disabled': {
                            backgroundColor: '#ccc'
                        }
                    }}
                    startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
                >
                    {isSubmitting ? 'Creating Assessment...' : 'Create Team Leader'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TeamLeaderAssessmentPopup;