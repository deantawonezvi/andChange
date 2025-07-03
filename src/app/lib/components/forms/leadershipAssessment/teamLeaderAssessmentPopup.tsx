import React, { useEffect, useState } from 'react';
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
import { EManagerOfPeopleDTO, MOPService } from '@/app/lib/api/services/mopService';
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
    organizationId: number;
    onSuccess?: () => void;
    existingTeamLeader?: EManagerOfPeopleDTO | null;
    isEditMode?: boolean;
}

const TeamLeaderAssessmentPopup: React.FC<TeamLeaderAssessmentPopupProps> = ({
                                                                                 open,
                                                                                 onClose,
                                                                                 impactedGroupId,
                                                                                 projectId,
                                                                                 organizationId,
                                                                                 onSuccess,
                                                                                 existingTeamLeader,
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
    } = useForm<TeamLeaderAssessmentFormData>({
        defaultValues: {
            firstName: '',
            lastName: '',
            entityName: '',
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
        if (isEditMode && existingTeamLeader && open) {
            const nameParts = existingTeamLeader.anagraphicDataDTO.entityName.split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            reset({
                firstName,
                lastName,
                entityName: existingTeamLeader.anagraphicDataDTO.entityName,
                absupAwareness: existingTeamLeader.groupProjectABSUPDTO?.absupAwareness || 1,
                absupBuyin: existingTeamLeader.groupProjectABSUPDTO?.absupBuyin || 1,
                absupSkill: existingTeamLeader.groupProjectABSUPDTO?.absupSkill || 1,
                absupUse: existingTeamLeader.groupProjectABSUPDTO?.absupUse || 1,
                absupProficiency: existingTeamLeader.groupProjectABSUPDTO?.absupProficiency || 1,
                anticipatedResistanceLevel: existingTeamLeader.resistanceAssessment?.anticipatedResistanceLevel || 1,
                anticipatedResistanceDriver: (existingTeamLeader.resistanceAssessment?.anticipatedResistanceDriver as any) || 'AWARENESS',
                specialTactics: existingTeamLeader.anagraphicDataDTO.uniqueGroupConsiderations || ''
            });
        } else if (!isEditMode && open) {
            reset({
                firstName: '',
                lastName: '',
                entityName: '',
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
    }, [isEditMode, existingTeamLeader, open, reset]);

    const onSubmit = async (data: TeamLeaderAssessmentFormData) => {
        setLoading(true);
        setError(null);

        try {
            const mopService = MOPService.getInstance();
            const individualService = IndividualService.getInstance();
            const impactedGroupService = ImpactedGroupService.getInstance();

            if (isEditMode && existingTeamLeader) {
                // Update existing team leader
                await mopService.updateAnagraphicData({
                    entityId: existingTeamLeader.id!,
                    entityName: data.entityName,
                    roleDefinition: 'Team Leader',
                    definitionOfAdoption: '',
                    uniqueGroupConsiderations: data.specialTactics,
                    hasEmail: true,
                    membersColocated: false,
                    virtualPreference: 3,
                    whatsInItForMe: '',
                    individualsToAdd: [],
                    individualsToRemove: []
                });

                await mopService.updateProjectABSUP({
                    entityId: existingTeamLeader.id!,
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

                const teamLeader = await mopService.createMOP({
                    projectId,
                    entityName: data.entityName || `${data.firstName} ${data.lastName}`,
                    roleDefinition: 'Team Leader',
                    definitionOfAdoption: '',
                    uniqueGroupConsiderations: data.specialTactics,
                    hasEmail: true,
                    membersColocated: false,
                    virtualPreference: 3,
                    whatsInItForMe: '',
                    individualIds: [individual.id!]
                });

                await mopService.updateProjectABSUP({
                    entityId: teamLeader.id!,
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
                    mopEntitiesToAdd: [teamLeader.id!],
                    mopEntitiesToRemove: []
                });
            }

            queryClient.invalidateQueries({ queryKey: ['leadership-structure'] });
            queryClient.invalidateQueries({ queryKey: ['impacted-groups'] });

            onSuccess?.();
            handleClose();

        } catch (err) {
            console.error('Error saving team leader:', err);
            setError(isEditMode ? 'Failed to update team leader. Please try again.' : 'Failed to create team leader. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setError(null);
        reset();
        onClose();
    };

    // Question configurations with better labels and marks
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
                        {isEditMode ? 'Edit Team Leader Assessment' : 'Team Leader Assessment'}
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
                            <>
                                <QuestionWithRating
                                    label="First Name"
                                    tooltip="Enter the team leader's first name"
                                    control={control}
                                    fieldName="firstName"
                                    required
                                    type="text"
                                    errors={errors}
                                />

                                <QuestionWithRating
                                    label="Last Name"
                                    tooltip="Enter the team leader's last name"
                                    control={control}
                                    fieldName="lastName"
                                    required
                                    type="text"
                                    errors={errors}
                                />
                            </>
                    </Box>

                    <Box sx={{ display: 'grid', gap: 3, mb: 3 }}>
                        {questionConfigs.map((config) => (
                            <QuestionWithRating
                                key={config.fieldName}
                                label={config.label}
                                tooltip={config.tooltip}
                                control={control}
                                fieldName={config.fieldName}
                                type="slider"
                                min={1}
                                max={5}
                                marks={config.marks}
                                errors={errors}
                            />
                        ))}
                    </Box>


                    <QuestionWithRating
                        label="Special Tactics / Notes"
                        tooltip="Any special considerations or tactics for engaging this team leader"
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
                    {loading ? 'Saving...' : (isEditMode ? 'Update Team Leader' : 'Create Team Leader')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TeamLeaderAssessmentPopup;