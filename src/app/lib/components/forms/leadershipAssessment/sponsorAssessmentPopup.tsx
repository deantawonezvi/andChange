import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
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
    Typography
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { ESponsorDTO, SponsorService } from '@/app/lib/api/services/sponsorService';
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
    existingSponsor?: ESponsorDTO | null;
    isEditMode?: boolean;
}

const SponsorAssessmentPopup: React.FC<SponsorAssessmentPopupProps> = ({
                                                                           open,
                                                                           onClose,
                                                                           impactedGroupId,
                                                                           projectId,
                                                                           organizationId,
                                                                           onSuccess,
                                                                           existingSponsor,
                                                                           isEditMode = false
                                                                       }) => {
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isValid }
    } = useForm<SponsorAssessmentFormData>({
        defaultValues: {
            firstName: '',
            lastName: '',
            entityName: '',
            sponsorTitle: '',
            absupAwareness: 1,
            absupBuyin: 1,
            absupSkill: 1,
            absupUse: 1,
            absupProficiency: 1,
            anticipatedResistanceLevel: 1,
            anticipatedResistanceDriver: 'AWARENESS',
            specialTactics: ''
        },
        mode: 'onChange'
    });

    
    useEffect(() => {
        if (isEditMode && existingSponsor && open) {
            
            const nameParts = existingSponsor.anagraphicDataDTO.entityName.split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            reset({
                firstName,
                lastName,
                entityName: existingSponsor.anagraphicDataDTO.entityName,
                sponsorTitle: existingSponsor.sponsorTitle || '',
                absupAwareness: existingSponsor.groupProjectABSUPDTO?.absupAwareness || 1,
                absupBuyin: existingSponsor.groupProjectABSUPDTO?.absupBuyin || 1,
                absupSkill: existingSponsor.groupProjectABSUPDTO?.absupSkill || 1,
                absupUse: existingSponsor.groupProjectABSUPDTO?.absupUse || 1,
                absupProficiency: existingSponsor.groupProjectABSUPDTO?.absupProficiency || 1,
                anticipatedResistanceLevel: 1,
                anticipatedResistanceDriver: 'AWARENESS',
                specialTactics: existingSponsor.anagraphicDataDTO.uniqueGroupConsiderations || ''
            });
        } else if (!isEditMode && open) {
            
            reset({
                firstName: '',
                lastName: '',
                entityName: '',
                sponsorTitle: '',
                absupAwareness: 1,
                absupBuyin: 1,
                absupSkill: 1,
                absupUse: 1,
                absupProficiency: 1,
                anticipatedResistanceLevel: 1,
                anticipatedResistanceDriver: 'AWARENESS',
                specialTactics: ''
            });
        }
    }, [isEditMode, existingSponsor, open, reset]);

    const onSubmit = async (data: SponsorAssessmentFormData) => {
        setLoading(true);
        setError(null);

        try {
            const sponsorService = SponsorService.getInstance();
            const individualService = IndividualService.getInstance();
            const impactedGroupService = ImpactedGroupService.getInstance();

            if (isEditMode && existingSponsor) {
                

                
                await sponsorService.updateAnagraphicData({
                    entityId: existingSponsor.id!,
                    entityName: data.entityName,
                    roleDefinition: data.sponsorTitle,
                    definitionOfAdoption: '',
                    uniqueGroupConsiderations: data.specialTactics,
                    hasEmail: true,
                    membersColocated: false,
                    virtualPreference: 3,
                    whatsInItForMe: '',
                    individualsToAdd: [],
                    individualsToRemove: []
                });

                
                await sponsorService.updateProjectABSUP({
                    entityId: existingSponsor.id!,
                    absupAwareness: data.absupAwareness,
                    absupBuyin: data.absupBuyin,
                    absupSkill: data.absupSkill,
                    absupUse: data.absupUse,
                    absupProficiency: data.absupProficiency
                });

            } else {
                

                
                const individual = await individualService.createIndividual({
                    organizationId,
                    firstName: data.firstName,
                    lastName: data.lastName
                });

                
                const sponsor = await sponsorService.createSponsor({
                    projectId,
                    entityName: data.entityName,
                    roleDefinition: data.sponsorTitle,
                    definitionOfAdoption: '',
                    uniqueGroupConsiderations: data.specialTactics,
                    hasEmail: true,
                    membersColocated: false,
                    virtualPreference: 3,
                    whatsInItForMe: '',
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

                
                await impactedGroupService.updateEntities({
                    impactGroupId: impactedGroupId,
                    sponsorEntitiesToAdd: [sponsor.id!],
                    sponsorEntitiesToRemove: [],
                    momEntitiesToAdd: [],
                    momEntitiesToRemove: [],
                    mopEntitiesToAdd: [],
                    mopEntitiesToRemove: []
                });
            }

            
            queryClient.invalidateQueries({ queryKey: ['leadership-structure'] });
            queryClient.invalidateQueries({ queryKey: ['impacted-groups'] });

            onSuccess?.();
            handleClose();

        } catch (err) {
            console.error('Error saving sponsor:', err);
            setError(isEditMode ? 'Failed to update sponsor. Please try again.' : 'Failed to create sponsor. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setError(null);
        reset();
        onClose();
    };

    const absupMarks = [
        { value: 1, label: 'Very Low' },
        { value: 2, label: 'Low' },
        { value: 3, label: 'Moderate' },
        { value: 4, label: 'High' },
        { value: 5, label: 'Very High' }
    ];

    const resistanceDriverOptions = [
        { value: 'AWARENESS', label: 'Awareness' },
        { value: 'BUYIN', label: 'Buy-in' },
        { value: 'SKILL', label: 'Skill' },
        { value: 'USE', label: 'Use' },
        { value: 'PROFICIENCY', label: 'Proficiency' }
    ];

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: { minHeight: '70vh' }
            }}
        >
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">
                        {isEditMode ? 'Edit Sponsor Assessment' : 'Sponsor Assessment'}
                    </Typography>
                    <IconButton onClick={handleClose} size="small">
                        <Close />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent dividers>
                <Box component="form" noValidate>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box sx={{ display: 'grid', gap: 2, mb: 3 }}>
                        {!isEditMode && (
                            <>
                                <QuestionWithRating
                                    label="First Name"
                                    tooltip="Enter the sponsor's first name"
                                    control={control}
                                    fieldName="firstName"
                                    required
                                    type="text"
                                    errors={errors}
                                />

                                <QuestionWithRating
                                    label="Last Name"
                                    tooltip="Enter the sponsor's last name"
                                    control={control}
                                    fieldName="lastName"
                                    required
                                    type="text"
                                    errors={errors}
                                />
                            </>
                        )}

                        <QuestionWithRating
                            label="Entity Name"
                            tooltip="Enter the sponsor's full entity name as it will appear in the system"
                            control={control}
                            fieldName="entityName"
                            required
                            type="text"
                            errors={errors}
                        />

                        <QuestionWithRating
                            label="Sponsor Title"
                            tooltip="Enter the sponsor's job title or position"
                            control={control}
                            fieldName="sponsorTitle"
                            type="text"
                            errors={errors}
                        />
                    </Box>

                    <Box sx={{ display: 'grid', gap: 3, mb: 3 }}>
                        <QuestionWithRating
                            label="Awareness Level"
                            tooltip="How aware is this sponsor of the change initiative?"
                            control={control}
                            fieldName="absupAwareness"
                            type="slider"
                            min={1}
                            max={5}
                            marks={absupMarks}
                            errors={errors}
                        />

                        <QuestionWithRating
                            label="Buy-in Level"
                            tooltip="How committed is this sponsor to the change?"
                            control={control}
                            fieldName="absupBuyin"
                            type="slider"
                            min={1}
                            max={5}
                            marks={absupMarks}
                            errors={errors}
                        />

                        <QuestionWithRating
                            label="Skill Level"
                            tooltip="What is this sponsor's skill level for supporting the change?"
                            control={control}
                            fieldName="absupSkill"
                            type="slider"
                            min={1}
                            max={5}
                            marks={absupMarks}
                            errors={errors}
                        />

                        <QuestionWithRating
                            label="Use Level"
                            tooltip="How actively will this sponsor use/support the new processes?"
                            control={control}
                            fieldName="absupUse"
                            type="slider"
                            min={1}
                            max={5}
                            marks={absupMarks}
                            errors={errors}
                        />

                        <QuestionWithRating
                            label="Proficiency Level"
                            tooltip="What is this sponsor's expected proficiency with the change?"
                            control={control}
                            fieldName="absupProficiency"
                            type="slider"
                            min={1}
                            max={5}
                            marks={absupMarks}
                            errors={errors}
                        />
                    </Box>

                    <Box sx={{ display: 'grid', gap: 3, mb: 3 }}>
                        <QuestionWithRating
                            label="Anticipated Resistance Level"
                            tooltip="How much resistance do you expect from this sponsor?"
                            control={control}
                            fieldName="anticipatedResistanceLevel"
                            type="slider"
                            min={1}
                            max={5}
                            marks={absupMarks}
                            errors={errors}
                        />

                        <QuestionWithRating
                            label="Primary Resistance Driver"
                            tooltip="What aspect is most likely to drive resistance?"
                            control={control}
                            fieldName="anticipatedResistanceDriver"
                            type="select"
                            options={resistanceDriverOptions}
                            errors={errors}
                        />
                    </Box>

                    <QuestionWithRating
                        label="Special Tactics / Notes"
                        tooltip="Any special considerations or tactics for engaging this sponsor"
                        control={control}
                        fieldName="specialTactics"
                        type="text"
                        multiline
                        errors={errors}
                    />
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2, gap: 1 }}>
                <Button
                    onClick={handleClose}
                    disabled={loading}
                    variant="outlined"
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit(onSubmit)}
                    disabled={loading || !isValid}
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                    {loading ? 'Saving...' : (isEditMode ? 'Update Sponsor' : 'Create Sponsor')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SponsorAssessmentPopup;