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
    Typography,
    Stack,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Autocomplete,
    TextField,
    Divider,
    Chip
} from '@mui/material';
import { X as Close, Trash2, UserMinus, Plus, Search } from 'lucide-react';
import { ESponsorDTO, SponsorService } from '@/app/lib/api/services/sponsorService';
import { IndividualService } from '@/app/lib/api/services/individualService';
import { QuestionWithRating } from '@/app/lib/components/forms/formComponents';
import ImpactedGroupService from "@/app/lib/api/services/impactedGroupService";
import { useQuery, useQueryClient } from "@tanstack/react-query";

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
    supportLevel: number;
    influenceLevel: number;
    availabilityLevel: number;
    isPrimary: boolean;
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
    onDelete?: () => void;
    existingSponsor?: ESponsorDTO | null;
    isEditMode?: boolean;
    allowDelete?: boolean;
}

type SponsorMode = 'create' | 'select' | 'edit';

const SponsorAssessmentPopup: React.FC<SponsorAssessmentPopupProps> = ({
                                                                           open,
                                                                           onClose,
                                                                           impactedGroupId,
                                                                           projectId,
                                                                           organizationId,
                                                                           onSuccess,
                                                                           onDelete,
                                                                           existingSponsor,
                                                                           isEditMode = false,
                                                                           allowDelete = true
                                                                       }) => {
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [sponsorMode, setSponsorMode] = useState<SponsorMode>(isEditMode ? 'edit' : 'create');
    const [selectedExistingSponsor, setSelectedExistingSponsor] = useState<ESponsorDTO | null>(null);

    
    const { data: existingSponsors = [], isLoading: loadingSponsors } = useQuery({
        queryKey: ['unassigned-sponsors', projectId, organizationId, impactedGroupId],
        queryFn: async () => {
            const sponsorService = SponsorService.getInstance();
            return await sponsorService.getUnassignedSponsors(projectId, organizationId, impactedGroupId);
        },
        enabled: open && sponsorMode === 'select'
    });

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
            supportLevel: 1,
            influenceLevel: 1,
            availabilityLevel: 1,
            isPrimary: false,
            anticipatedResistanceDriver: 'AWARENESS',
            specialTactics: '',
        },
        mode: 'onChange'
    });

    useEffect(() => {
        if (isEditMode && existingSponsor && open) {
            setSponsorMode('edit');
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
                availabilityLevel: existingSponsor.groupUnityAssessmentDTO?.availabilityLevel || 1,
                supportLevel: existingSponsor.groupUnityAssessmentDTO?.supportLevel || 1,
                influenceLevel: existingSponsor.groupUnityAssessmentDTO?.influenceLevel || 1,
                isPrimary: existingSponsor.groupUnityAssessmentDTO?.primary || false,
                anticipatedResistanceLevel: 1,
                anticipatedResistanceDriver: 'AWARENESS',
                specialTactics: existingSponsor.anagraphicDataDTO.uniqueGroupConsiderations || ''
            });
        } else if (!isEditMode && open) {
            setSponsorMode('create');
            setSelectedExistingSponsor(null);
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
                availabilityLevel: 1,
                supportLevel: 1,
                influenceLevel: 1,
                isPrimary: false,
                anticipatedResistanceDriver: 'AWARENESS',
                specialTactics: ''
            });
        }
    }, [isEditMode, existingSponsor, open, reset]);

    const handleModeChange = (mode: SponsorMode) => {
        setSponsorMode(mode);
        setSelectedExistingSponsor(null);
        setError(null);

        if (mode === 'create') {
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
                availabilityLevel: 1,
                supportLevel: 1,
                influenceLevel: 1,
                isPrimary: false,
                anticipatedResistanceDriver: 'AWARENESS',
                specialTactics: ''
            });
        }
    };

    const handleExistingSponsorSelect = (sponsor: ESponsorDTO | null) => {
        setSelectedExistingSponsor(sponsor);
        if (sponsor) {
            reset({
                firstName: '',
                lastName: '',
                entityName: sponsor.anagraphicDataDTO.entityName,
                sponsorTitle: sponsor.sponsorTitle || '',
                absupAwareness: sponsor.groupProjectABSUPDTO?.absupAwareness || 1,
                absupBuyin: sponsor.groupProjectABSUPDTO?.absupBuyin || 1,
                absupSkill: sponsor.groupProjectABSUPDTO?.absupSkill || 1,
                absupUse: sponsor.groupProjectABSUPDTO?.absupUse || 1,
                absupProficiency: sponsor.groupProjectABSUPDTO?.absupProficiency || 1,
                availabilityLevel: sponsor.groupUnityAssessmentDTO?.availabilityLevel || 1,
                supportLevel: sponsor.groupUnityAssessmentDTO?.supportLevel || 1,
                influenceLevel: sponsor.groupUnityAssessmentDTO?.influenceLevel || 1,
                isPrimary: sponsor.groupUnityAssessmentDTO?.primary || false,
                anticipatedResistanceLevel: 1,
                anticipatedResistanceDriver: 'AWARENESS',
                specialTactics: sponsor.anagraphicDataDTO.uniqueGroupConsiderations || ''
            });
        }
    };

    const onSubmit = async (data: SponsorAssessmentFormData) => {
        setLoading(true);
        setError(null);

        try {
            const sponsorService = SponsorService.getInstance();
            const individualService = IndividualService.getInstance();
            const impactedGroupService = ImpactedGroupService.getInstance();

            if (sponsorMode === 'edit' && existingSponsor) {
                
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

                await sponsorService.updateUnityAssessment({
                    entityId: existingSponsor.id!,
                    availabilityLevel: data.availabilityLevel,
                    influenceLevel: data.influenceLevel,
                    supportLevel: data.supportLevel,
                    isPrimary: data.isPrimary,
                });

            } else if (sponsorMode === 'select' && selectedExistingSponsor) {
                
                await impactedGroupService.updateEntities({
                    impactGroupId: impactedGroupId,
                    sponsorEntitiesToAdd: [selectedExistingSponsor.id!],
                    sponsorEntitiesToRemove: [],
                    momEntitiesToAdd: [],
                    momEntitiesToRemove: [],
                    mopEntitiesToAdd: [],
                    mopEntitiesToRemove: []
                });

            } else if (sponsorMode === 'create') {
                
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

                await sponsorService.updateUnityAssessment({
                    entityId: sponsor.id!,
                    availabilityLevel: data.availabilityLevel,
                    influenceLevel: data.influenceLevel,
                    supportLevel: data.supportLevel,
                    isPrimary: data.isPrimary,
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
            queryClient.invalidateQueries({ queryKey: ['unassigned-sponsors'] });

            onSuccess?.();
            handleClose();

        } catch (err) {
            console.error('Error saving sponsor:', err);
            setError('Failed to save sponsor. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!existingSponsor?.id) return;

        setDeleteLoading(true);
        setError(null);

        try {
            const impactedGroupService = ImpactedGroupService.getInstance();
            await impactedGroupService.updateEntities({
                impactGroupId: impactedGroupId,
                sponsorEntitiesToAdd: [],
                sponsorEntitiesToRemove: [existingSponsor.id],
                momEntitiesToAdd: [],
                momEntitiesToRemove: [],
                mopEntitiesToAdd: [],
                mopEntitiesToRemove: []
            });

            queryClient.invalidateQueries({ queryKey: ['leadership-structure'] });
            queryClient.invalidateQueries({ queryKey: ['impacted-groups'] });
            queryClient.invalidateQueries({ queryKey: ['unassigned-sponsors'] });

            onDelete?.();
            handleClose();
        } catch (err) {
            console.error('Error removing sponsor:', err);
            setError('Failed to remove sponsor. Please try again.');
        } finally {
            setDeleteLoading(false);
            setShowDeleteConfirmation(false);
        }
    };

    const handleClose = () => {
        setError(null);
        setShowDeleteConfirmation(false);
        setSelectedExistingSponsor(null);
        setSponsorMode(isEditMode ? 'edit' : 'create');
        reset();
        onClose();
    };

    const handleDeleteClick = () => {
        setShowDeleteConfirmation(true);
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirmation(false);
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
            fieldName: 'availabilityLevel' as const,
            label: 'Availability',
            tooltip: 'How available is the leader to perform change management actions.',
            marks: [
                { value: 1, label: 'Often' },
                { value: 3, label: 'Somewhat' },
                { value: 5, label: 'Rarely' }
            ]
        },
        {
            fieldName: 'influenceLevel' as const,
            label: 'The level of influence and visibility of the leader.',
            tooltip: 'To what extent does this leader have influence over and is visible to the impacted group.',
            marks: [
                { value: 1, label: 'Often' },
                { value: 3, label: 'Somewhat' },
                { value: 5, label: 'Rarely' }
            ]
        },
        {
            fieldName: 'supportLevel' as const,
            label: 'The level of support expressed for the change.',
            tooltip: 'To what extent is the leader supportive of the change. If this information is not available, default to low.',
            marks: [
                { value: 1, label: 'Often' },
                { value: 3, label: 'Somewhat' },
                { value: 5, label: 'Rarely' }
            ]
        },
        {
            fieldName: 'anticipatedResistanceLevel' as const,
            label: 'What is the anticipated level of resistance for this executive?',
            tooltip: 'Based on your assessment, what level of resistance do you expect from this executive?',
            marks: [
                { value: 1, label: 'Low' },
                { value: 3, label: 'Medium' },
                { value: 5, label: 'High' }
            ]
        },
        {
            fieldName: 'isPrimary' as const,
            label: 'Is Primary?',
            tooltip: 'Is this the primary sponsor of the project?',
            type: 'boolean'
        },
    ];

    const resistanceDriverOptions = [
        { value: 'AWARENESS', label: 'Awareness of the role of leadership in change' },
        { value: 'BUYIN', label: 'Buy-in to the process of change management' },
        { value: 'SKILL', label: 'Skills formally developed in a leader\'s role in change' },
        { value: 'USE', label: 'Usage of the skills in being visible and building a coalition for the change' },
        { value: 'PROFICIENCY', label: 'Proficiency in leading change' }
    ];

    const getDialogTitle = () => {
        switch (sponsorMode) {
            case 'edit':
                return 'Edit Sponsor Assessment';
            case 'select':
                return 'Assign Existing Sponsor';
            case 'create':
            default:
                return 'Create New Sponsor';
        }
    };

    const isFormValid = () => {
        if (sponsorMode === 'select') {
            return selectedExistingSponsor !== null;
        }
        return isValid;
    };

    const getABSUPAverage = (sponsor: ESponsorDTO): number => {
        const sponsorService = SponsorService.getInstance();
        return sponsorService.getABSUPAverage(sponsor);
    };

    const getInfluenceLevel = (sponsor: ESponsorDTO): string => {
        const sponsorService = SponsorService.getInstance();
        return sponsorService.getInfluenceLevel(sponsor);
    };

    return (
        <>
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
                            {getDialogTitle()}
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

                        {/* Mode Selection - Only show if not in edit mode */}
                        {!isEditMode && (
                            <>
                                <FormControl component="fieldset" sx={{ mb: 3 }}>
                                    <FormLabel component="legend">
                                        <Typography variant="subtitle1" fontWeight="medium">
                                            How would you like to add a sponsor?
                                        </Typography>
                                    </FormLabel>
                                    <RadioGroup
                                        row
                                        value={sponsorMode}
                                        onChange={(e) => handleModeChange(e.target.value as SponsorMode)}
                                        sx={{ mt: 1 }}
                                    >
                                        <FormControlLabel
                                            value="create"
                                            control={<Radio />}
                                            label={
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <Plus size={16} />
                                                    Create New Sponsor
                                                </Box>
                                            }
                                        />
                                        <FormControlLabel
                                            value="select"
                                            control={<Radio />}
                                            label={
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <Search size={16} />
                                                    Select Existing Sponsor
                                                </Box>
                                            }
                                        />
                                    </RadioGroup>
                                </FormControl>

                                <Divider sx={{ mb: 3 }} />
                            </>
                        )}

                        {/* Existing Sponsor Selection */}
                        {sponsorMode === 'select' && (
                            <Box sx={{ mb: 3 }}>
                                <Autocomplete
                                    options={existingSponsors}
                                    getOptionLabel={(option) => option.anagraphicDataDTO.entityName}
                                    value={selectedExistingSponsor}
                                    onChange={(_, newValue) => handleExistingSponsorSelect(newValue)}
                                    loading={loadingSponsors}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Select Existing Sponsor"
                                            placeholder="Search for a sponsor..."
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {loadingSponsors ? <CircularProgress color="inherit" size={20} /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </>
                                                ),
                                            }}
                                        />
                                    )}
                                    renderOption={(props, option) => (
                                        <Box component="li" {...props}>
                                            <Box sx={{ width: '100%' }}>
                                                <Typography variant="body1">
                                                    {option.anagraphicDataDTO.entityName}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {option.sponsorTitle || 'No title specified'}
                                                </Typography>
                                                <Box display="flex" gap={1} mt={0.5}>
                                                    <Chip
                                                        size="small"
                                                        label={`ABSUP Avg: ${getABSUPAverage(option).toFixed(1)}`}
                                                        variant="outlined"
                                                        color="primary"
                                                    />
                                                    <Chip
                                                        size="small"
                                                        label={`Influence: ${getInfluenceLevel(option)}`}
                                                        variant="outlined"
                                                        color="secondary"
                                                    />
                                                    {option.groupUnityAssessmentDTO?.primary && (
                                                        <Chip
                                                            size="small"
                                                            label="Primary"
                                                            variant="filled"
                                                            color="success"
                                                        />
                                                    )}
                                                </Box>
                                            </Box>
                                        </Box>
                                    )}
                                    noOptionsText={loadingSponsors ? "Loading..." : "No available sponsors found"}
                                />

                                {selectedExistingSponsor && (
                                    <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                                        <Typography variant="subtitle2" gutterBottom>
                                            Selected Sponsor Details:
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Name:</strong> {selectedExistingSponsor.anagraphicDataDTO.entityName}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Title:</strong> {selectedExistingSponsor.sponsorTitle || 'Not specified'}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>ABSUP Scores:</strong> A:{selectedExistingSponsor.groupProjectABSUPDTO?.absupAwareness},
                                            B:{selectedExistingSponsor.groupProjectABSUPDTO?.absupBuyin},
                                            S:{selectedExistingSponsor.groupProjectABSUPDTO?.absupSkill},
                                            U:{selectedExistingSponsor.groupProjectABSUPDTO?.absupUse},
                                            P:{selectedExistingSponsor.groupProjectABSUPDTO?.absupProficiency}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Unity Assessment:</strong> Support:{selectedExistingSponsor.groupUnityAssessmentDTO?.supportLevel},
                                            Influence:{selectedExistingSponsor.groupUnityAssessmentDTO?.influenceLevel},
                                            Availability:{selectedExistingSponsor.groupUnityAssessmentDTO?.availabilityLevel}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        )}

                        {/* Form Fields - Show for create and edit modes */}
                        {(sponsorMode === 'create' || sponsorMode === 'edit') && (
                            <>
                                <Box sx={{ display: 'grid', gap: 2, mb: 3 }}>
                                    {sponsorMode === 'create' && (
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
                                        tooltip="Enter the sponsor's name or title"
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
                                    {questionConfigs.map((config) => (
                                        <QuestionWithRating
                                            key={config.fieldName}
                                            label={config.label}
                                            tooltip={config.tooltip}
                                            control={control}
                                            fieldName={config.fieldName}
                                            type={config.type || "slider"}
                                            min={1}
                                            max={5}
                                            marks={config.marks}
                                            errors={errors}
                                        />
                                    ))}
                                </Box>

                                <Box sx={{ display: 'grid', gap: 3, mb: 3 }}>
                                    <QuestionWithRating
                                        label="Primary Resistance Driver"
                                        tooltip="What aspect is most likely to drive resistance from this executive?"
                                        control={control}
                                        fieldName="anticipatedResistanceDriver"
                                        type="radio"
                                        orientation="vertical"
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
                            </>
                        )}
                    </Box>
                </DialogContent>

                <DialogActions sx={{ p: 2 }}>
                    <Stack direction="row" spacing={2} width="100%" justifyContent="space-between">
                        <Box>
                            {isEditMode && allowDelete && (
                                <Button
                                    onClick={handleDeleteClick}
                                    variant="outlined"
                                    color="error"
                                    startIcon={<UserMinus />}
                                    disabled={loading || deleteLoading}
                                >
                                    Remove Sponsor
                                </Button>
                            )}
                        </Box>

                        <Stack direction="row" spacing={2}>
                            <Button
                                onClick={handleClose}
                                disabled={loading || deleteLoading}
                                variant="outlined"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSubmit(onSubmit)}
                                disabled={loading || deleteLoading || !isFormValid()}
                                variant="contained"
                                startIcon={loading ? <CircularProgress size={20} /> : null}
                            >
                                {loading ? 'Saving...' :
                                    sponsorMode === 'edit' ? 'Update Sponsor' :
                                        sponsorMode === 'select' ? 'Assign Sponsor' :
                                            'Create Sponsor'
                                }
                            </Button>
                        </Stack>
                    </Stack>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={showDeleteConfirmation}
                onClose={handleCancelDelete}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Trash2 size={20} color="error" />
                        Confirm Sponsor Removal
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to remove {existingSponsor?.anagraphicDataDTO?.entityName} as a sponsor for this impacted group?
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        This will disassociate the sponsor from this impacted group but will not delete their data completely. The sponsor can be reassigned to other groups if needed.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleCancelDelete} disabled={deleteLoading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDelete}
                        variant="contained"
                        color="error"
                        disabled={deleteLoading}
                        startIcon={deleteLoading ? <CircularProgress size={20} /> : <Trash2 />}
                    >
                        {deleteLoading ? 'Removing...' : 'Remove Sponsor'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default SponsorAssessmentPopup;