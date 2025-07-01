import React from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert, Box, Button, Collapse, Grid, IconButton, Paper, Stack, Typography } from '@mui/material';
import { ChevronDown, ChevronUp, Save, Tag } from 'lucide-react';
import {
    CreateCommonEntityRequestDTO,
    EImpactedGroupDTO,
    ImpactedGroupService,
    UpdateABSUPRequestDTO,
    UpdateAnagraphicDataRequestDTO,
    UpdateIGChangeImpactAssessmentRequestDTO,
    UpdateResistanceAssessmentRequestDTO
} from "@/app/lib/api/services/impactedGroupService";
import { QuestionWithRating } from "@/app/lib/components/forms/formComponents";
import {
    ImpactedGroupFormData,
    impactedGroupFormFields,
    resistanceDriverOptions
} from "@/app/lib/components/forms/impactedGroupAssesssment/types";
import { useToast } from '@/app/lib/hooks/useToast';
import { SectionLoader } from '@/app/lib/components/common/pageLoader';
import ImpactRadarChart from '../../common/impactAssessmentRadarChart';

const ImpactedGroupAssessment: React.FC = () => {
    const params = useParams();
    const projectId = typeof params.id === 'string' ? parseInt(params.id) : 0;
    const groupId = params.groupId ? parseInt(params.groupId as string) : 0;
    const isEditMode = !!groupId;

    const queryClient = useQueryClient();
    const impactedGroupService = ImpactedGroupService.getInstance();
    const { showToast } = useToast();

    const [expandedSections, setExpandedSections] = React.useState({
        basicInfo: true,
        changeStatus: true,
        adoptionAssessment: false,
        changeImpactAssessment: false,
        resistanceAssessment: false,
        tags: false
    });

    const { control, handleSubmit, reset, watch, formState: { errors, isDirty, isSubmitting } } = useForm<ImpactedGroupFormData>({
        defaultValues: {

            entityName: '',
            roleDefinition: '',
            definitionOfAdoption: '',
            uniqueGroupConsiderations: '',
            hasEmail: false,
            membersColocated: false,
            virtualPreference: 3,
            whatsInItForMe: '',
            individualsIds: [],

            absupAwareness: 1,
            absupBuyin: 1,
            absupSkill: 1,
            absupUse: 1,
            absupProficiency: 1,

            process: 0,
            processDescription: '',
            systems: 0,
            systemsDescription: '',
            tools: 0,
            toolsDescription: '',
            jobRoles: 0,
            jobRolesDescription: '',
            criticalBehaviours: 0,
            criticalBehavioursDescription: '',
            mindsetAttitudesBeliefs: 0,
            mindsetAttitudeBeliefsDescription: '',
            reportingStructure: 0,
            reportingStructureDescription: '',
            performanceReviews: 0,
            performanceReviewsDescription: '',
            compensation: 0,
            compensationDescription: '',
            location: 0,
            locationDescription: '',
            retrenchments: 0,
            retrenchmentDescription: '',
            clarityOfFutureState: 0,

            anticipatedResistanceLevel: 1,
            anticipatedResistanceDriver: 'AWARENESS',
            resistanceManagementTactics: [],

            adoptionAssessments: [],

            tags: []
        }
    });

    const { data: impactedGroup, isLoading: isLoadingGroup, error: groupError } = useQuery({
        queryKey: ['impactedGroup', groupId],
        queryFn: () => impactedGroupService.getImpactedGroupById(groupId),
        enabled: isEditMode && !!groupId,
    });

    const mapApiToForm = React.useCallback((data: EImpactedGroupDTO): ImpactedGroupFormData => {
        return {
            managersOfManagers: [],
            managersOfPeople: [],
            numberOfIndividuals: 0,
            organizationalGrouping: "",
            preferredInteraction: 0,
            sponsors: [],

            entityName: data.anagraphicDataDTO?.entityName || '',
            roleDefinition: data.anagraphicDataDTO?.roleDefinition || '',
            definitionOfAdoption: data.anagraphicDataDTO?.definitionOfAdoption || '',
            uniqueGroupConsiderations: data.anagraphicDataDTO?.uniqueGroupConsiderations || '',
            hasEmail: data.anagraphicDataDTO?.hasEmail || false,
            membersColocated: data.anagraphicDataDTO?.membersColocated || false,
            virtualPreference: data.anagraphicDataDTO?.virtualPreference || 3,
            whatsInItForMe: data.anagraphicDataDTO?.whatsInItForMe || '',
            individualsIds: data.anagraphicDataDTO?.individuals || [],

            absupAwareness: data.groupProjectABSUPDTO?.absupAwareness || 1,
            absupBuyin: data.groupProjectABSUPDTO?.absupBuyin || 1,
            absupSkill: data.groupProjectABSUPDTO?.absupSkill || 1,
            absupUse: data.groupProjectABSUPDTO?.absupUse || 1,
            absupProficiency: data.groupProjectABSUPDTO?.absupProficiency || 1,

            process: data.changeImpactAssessment?.process || 0,
            processDescription: data.echangeImpactAssessmentDescriptionsDTO?.processDescription || '',
            systems: data.changeImpactAssessment?.systems || 0,
            systemsDescription: data.echangeImpactAssessmentDescriptionsDTO?.systemsDescription || '',
            tools: data.changeImpactAssessment?.tools || 0,
            toolsDescription: data.echangeImpactAssessmentDescriptionsDTO?.toolsDescription || '',
            jobRoles: data.changeImpactAssessment?.jobRoles || 0,
            jobRolesDescription: data.echangeImpactAssessmentDescriptionsDTO?.jobRolesDescription || '',
            criticalBehaviours: data.changeImpactAssessment?.criticalBehaviours || 0,
            criticalBehavioursDescription: data.echangeImpactAssessmentDescriptionsDTO?.criticalBehavioursDescription || '',
            mindsetAttitudesBeliefs: data.changeImpactAssessment?.mindsetAttitudesBeliefs || 0,
            mindsetAttitudeBeliefsDescription: data.echangeImpactAssessmentDescriptionsDTO?.mindsetAttitudeBeliefsDescription || '',
            reportingStructure: data.changeImpactAssessment?.reportingStructure || 0,
            reportingStructureDescription: data.echangeImpactAssessmentDescriptionsDTO?.reportingStructureDescription || '',
            performanceReviews: data.changeImpactAssessment?.performanceReviews || 0,
            performanceReviewsDescription: data.echangeImpactAssessmentDescriptionsDTO?.performanceReviewsDescription || '',
            compensation: data.changeImpactAssessment?.compensation || 0,
            compensationDescription: data.echangeImpactAssessmentDescriptionsDTO?.compensationDescription || '',
            location: data.changeImpactAssessment?.location || 0,
            locationDescription: data.echangeImpactAssessmentDescriptionsDTO?.locationDescription || '',
            retrenchments: data.changeImpactAssessment?.retrenchments || 0,
            retrenchmentDescription: data.echangeImpactAssessmentDescriptionsDTO?.retrenchmentDescription || '',
            clarityOfFutureState: data.changeImpactAssessment?.clarityOfFutureState || 0,

            anticipatedResistanceLevel: data.resistanceAssessment?.anticipatedResistanceLevel || 1,
            anticipatedResistanceDriver: data.resistanceAssessment?.anticipatedResistanceDriver || 'AWARENESS',
            resistanceManagementTactics: data.resistanceAssessment?.resistanceManagementTactics || [],

            adoptionAssessments: data.adoptionAssessments || [],


            tags: data.tagDTOs?.map(tag => tag.id).filter((id): id is number => id !== undefined) || []
        };
    }, []);

    React.useEffect(() => {
        if (impactedGroup) {
            const formData = mapApiToForm(impactedGroup);
            reset(formData);
        }
    }, [impactedGroup, mapApiToForm, reset]);

    const createImpactedGroupMutation = useMutation({
        mutationFn: (data: CreateCommonEntityRequestDTO) => impactedGroupService.createImpactedGroup(data),
        onSuccess: (response) => {
            showToast('Impacted group created successfully', 'success');
            queryClient.invalidateQueries({ queryKey: ['impactedGroups'] });

            if (response.id) {
                window.location.href = `/projects/${projectId}/impacted-group/${response.id}`;
            }
        },
        onError: (error) => {
            showToast(`Error creating impacted group: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
        }
    });

    const updateABSUPMutation = useMutation({
        mutationFn: (data: UpdateABSUPRequestDTO) => impactedGroupService.updateABSUP(data),
        onSuccess: () => {
            showToast('ABSUP ratings updated successfully', 'success');
            queryClient.invalidateQueries({ queryKey: ['impactedGroup', groupId] });
        },
        onError: (error) => {
            showToast(`Error updating ABSUP ratings: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
        }
    });

    const updateAnagraphicDataMutation = useMutation({
        mutationFn: (data: UpdateAnagraphicDataRequestDTO) => impactedGroupService.updateAnagraphicData(data),
        onSuccess: () => {
            showToast('Group information updated successfully', 'success');
            queryClient.invalidateQueries({ queryKey: ['impactedGroup', groupId] });
        },
        onError: (error) => {
            showToast(`Error updating group information: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
        }
    });

    const updateResistanceAssessmentMutation = useMutation({
        mutationFn: (data: UpdateResistanceAssessmentRequestDTO) => impactedGroupService.updateResistanceAssessment(data),
        onSuccess: () => {
            showToast('Resistance assessment updated successfully', 'success');
            queryClient.invalidateQueries({ queryKey: ['impactedGroup', groupId] });
        },
        onError: (error) => {
            showToast(`Error updating resistance assessment: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
        }
    });

    const updateChangeImpactAssessmentMutation = useMutation({
        mutationFn: (data: UpdateIGChangeImpactAssessmentRequestDTO) => impactedGroupService.updateChangeImpactAssessment(data),
        onSuccess: () => {
            showToast('Change impact assessment updated successfully', 'success');
            queryClient.invalidateQueries({ queryKey: ['impactedGroup', groupId] });
        },
        onError: (error) => {
            showToast(`Error updating change impact assessment: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
        }
    });

    const onSubmit = async (formData: ImpactedGroupFormData) => {
        try {
            if (isEditMode && groupId) {


                await updateAnagraphicDataMutation.mutateAsync({
                    entityId: groupId,
                    entityName: formData.entityName || '',
                    roleDefinition: formData.roleDefinition || '',
                    definitionOfAdoption: formData.definitionOfAdoption || '',
                    uniqueGroupConsiderations: formData.uniqueGroupConsiderations || '',
                    hasEmail: formData.hasEmail || false,
                    membersColocated: formData.membersColocated || false,
                    virtualPreference: formData.virtualPreference || 0,
                    whatsInItForMe: formData.whatsInItForMe,
                    individualsToAdd: [], // Would need to calculate delta
                    individualsToRemove: [] // Would need to calculate delta
                });

                await updateABSUPMutation.mutateAsync({
                    entityId: groupId,
                    absupAwareness: formData.absupAwareness || 1,
                    absupBuyin: formData.absupBuyin || 1,
                    absupSkill: formData.absupSkill || 1,
                    absupUse: formData.absupUse || 1,
                    absupProficiency: formData.absupProficiency || 1
                });

                await updateResistanceAssessmentMutation.mutateAsync({
                    entityId: groupId,
                    anticipatedResistanceLevel: formData.anticipatedResistanceLevel || 1,
                    anticipatedResistanceDriver: formData.anticipatedResistanceDriver || '',
                    resistanceManagementTacticsToAdd: [], // Would need to calculate delta
                    resistanceManagementTacticsToRemove: [] // Would need to calculate delta
                });

                await updateChangeImpactAssessmentMutation.mutateAsync({
                    impactGroupId: groupId,
                    process: formData.process || 0,
                    systems: formData.systems || 0,
                    tools: formData.tools || 0,
                    jobRoles: formData.jobRoles || 0,
                    criticalBehaviours: formData.criticalBehaviours || 0,
                    mindsetAttitudesBeliefs: formData.mindsetAttitudesBeliefs || 0,
                    reportingStructure: formData.reportingStructure || 0,
                    performanceReviews: formData.performanceReviews || 0,
                    compensation: formData.compensation || 0,
                    location: formData.location || 0,
                    restructuringOrRetrenchments: formData.retrenchments || 0,
                    clarityOfFutureState: formData.clarityOfFutureState || 0
                });





                showToast('Impacted group updated successfully', 'success');
            } else {

                await createImpactedGroupMutation.mutateAsync({
                    projectId: projectId,
                    entityName: formData.entityName,
                    roleDefinition: formData.roleDefinition,
                    definitionOfAdoption: formData.definitionOfAdoption,
                    uniqueGroupConsiderations: formData.uniqueGroupConsiderations,
                    hasEmail: formData.hasEmail,
                    membersColocated: formData.membersColocated,
                    virtualPreference: formData.virtualPreference,
                    whatsInItForMe: formData.whatsInItForMe,
                    individualIds: formData.individualsIds
                });

            }
        } catch (error) {
            console.log('Error submitting form:', error);
            showToast('An error occurred while saving. Please try again.', 'error');
        }
    };

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const renderSectionHeader = (title: string, section: keyof typeof expandedSections) => (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                py: 2,
                px: 3,
                backgroundColor: 'background.paper',
                borderBottom: '1px solid',
                borderColor: 'divider'
            }}
            onClick={() => toggleSection(section)}
        >
            <Typography variant="h6">{title}</Typography>
            <IconButton size="small">
                {expandedSections[section] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </IconButton>
        </Box>
    );

    if (isEditMode && isLoadingGroup) {
        return <SectionLoader message="Loading impacted group data..." />;
    }

    if (isEditMode && groupError) {
        return (
            <Alert severity="error" sx={{ mb: 3 }}>
                Error loading impacted group: {groupError instanceof Error ? groupError.message : 'Unknown error'}
            </Alert>
        );
    }

    const basicInfoFields = impactedGroupFormFields.basicInfo || [];
    const absupFields = impactedGroupFormFields.absupFields || [];
    const adoptionFields = impactedGroupFormFields.adoptionAssessment || [];
    const impactFields = impactedGroupFormFields.changeImpactAssessment || [];
    const resistanceFields = impactedGroupFormFields.resistanceAssessment || [];

    return (
        <Box sx={{ mx: 'auto', p: 3 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={3}>
                    {/* Overall impact summary */}
                    <Paper sx={{ p: 3, mb: 4 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box>
                                <Typography variant="h5">
                                    {isEditMode ? 'Edit Impacted Group' : 'Create New Impacted Group'}
                                </Typography>
                                {isEditMode && (
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        {impactedGroup?.anagraphicDataDTO?.entityName || ''}
                                    </Typography>
                                )}
                            </Box>

                            {isEditMode && (
                                <Box sx={{ flexGrow: 1, ml: 4 }}>
                                    {/* Radar Chart Integration */}
                                    <ImpactRadarChart watch={watch} />
                                </Box>
                            )}
                        </Box>
                    </Paper>

                    {/* Basic Information Section */}
                    <Paper sx={{ mb: 3 }}>
                        {renderSectionHeader('Basic Information', 'basicInfo')}
                        <Collapse in={expandedSections.basicInfo}>
                            <Box sx={{ p: 3 }}>
                                {basicInfoFields.map((field) => (
                                    <QuestionWithRating
                                        key={field.fieldName}
                                        label={field.label}
                                        tooltip={field.tooltip}
                                        fieldName={field.fieldName}
                                        required={field.required}
                                        type={field.type}
                                        options={field.type === 'select' ? field.options : undefined}
                                        min={field.type === 'slider' ? field.min : undefined}
                                        max={field.type === 'slider' ? field.max : undefined}
                                        marks={field.type === 'slider' ? field.marks : undefined}
                                        control={control}
                                        errors={errors}
                                    />
                                ))}
                            </Box>
                        </Collapse>
                    </Paper>

                    {/* ABSUP Ratings Section */}
                    <Paper sx={{ mb: 3 }}>
                        {renderSectionHeader('Change Status', 'changeStatus')}
                        <Collapse in={expandedSections.changeStatus}>
                            <Box sx={{ p: 3 }}>
                                <Typography variant="body2" sx={{ mb: 3 }}>
                                    This section captures the current status of the people-change metrics in this group.
                                </Typography>

                                <Grid container spacing={3}>
                                    {absupFields.map((field) => (
                                        <Grid item xs={12} sm={6} md={4} key={field.fieldName}>
                                            <QuestionWithRating
                                                label={field.label}
                                                tooltip={field.tooltip}
                                                fieldName={field.fieldName}
                                                required={field.required}
                                                type={field.type}
                                                min={field.type === 'slider' ? field.min : undefined}
                                                max={field.type === 'slider' ? field.max : undefined}
                                                marks={field.type === 'slider' ? field.marks : undefined}
                                                control={control}
                                                errors={errors}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        </Collapse>
                    </Paper>

                    {/* Adoption Assessment Section */}
                    <Paper sx={{ mb: 3 }}>
                        {renderSectionHeader('Adoption Assessment', 'adoptionAssessment')}
                        <Collapse in={expandedSections.adoptionAssessment}>
                            <Box sx={{ p: 3 }}>
                                <Typography variant="body2" sx={{ mb: 3 }}>
                                    Define metrics used to determine if this group is adopting the change and demonstrating new behaviors.
                                </Typography>

                                {adoptionFields.map((field) => (
                                    <QuestionWithRating
                                        key={field.fieldName}
                                        label={field.label}
                                        tooltip={field.tooltip}
                                        fieldName={field.fieldName}
                                        required={field.required}
                                        type={field.type}
                                        control={control}
                                        errors={errors}
                                    />
                                ))}
                            </Box>
                        </Collapse>
                    </Paper>

                    {/* Change Impact Assessment Section */}
                    <Paper sx={{ mb: 3 }}>
                        {renderSectionHeader('Change Impact Assessment', 'changeImpactAssessment')}
                        <Collapse in={expandedSections.changeImpactAssessment}>
                            <Box sx={{ p: 3 }}>
                                <Typography variant="body2" sx={{ mb: 3 }}>
                                    Describe in what ways and to what degree this group is impacted by the change.
                                </Typography>

                                {/* Change impact assessment fields - there are many, so we could group them */}
                                {impactFields.map((field) => (
                                    <QuestionWithRating
                                        key={field.fieldName}
                                        label={field.label}
                                        tooltip={field.tooltip}
                                        fieldName={field.fieldName}
                                        ratingFieldName={field.ratingFieldName}
                                        required={field.required}
                                        type={field.type}
                                        min={field.type === 'slider' ? field.min : undefined}
                                        max={field.type === 'slider' ? field.max : undefined}
                                        marks={field.type === 'slider' ? field.marks : undefined}
                                        control={control}
                                        errors={errors}
                                    />
                                ))}
                            </Box>
                        </Collapse>
                    </Paper>

                    {/* Resistance Assessment Section */}
                    <Paper sx={{ mb: 3 }}>
                        {renderSectionHeader('Resistance Assessment', 'resistanceAssessment')}
                        <Collapse in={expandedSections.resistanceAssessment}>
                            <Box sx={{ p: 3 }}>
                                <Typography variant="body2" sx={{ mb: 3 }}>
                                    Collect resistance information regarding this group.
                                </Typography>

                                {resistanceFields.map((field) => (
                                    <QuestionWithRating
                                        key={field.fieldName}
                                        label={field.label}
                                        tooltip={field.tooltip}
                                        fieldName={field.fieldName}
                                        required={field.required}
                                        type={field.type}
                                        options={field.type === 'select' ? resistanceDriverOptions : undefined}
                                        min={field.type === 'slider' ? field.min : undefined}
                                        max={field.type === 'slider' ? field.max : undefined}
                                        marks={field.type === 'slider' ? field.marks : undefined}
                                        control={control}
                                        errors={errors}
                                    />
                                ))}
                            </Box>
                        </Collapse>
                    </Paper>

                    {/* Tags Section */}
                    <Paper sx={{ mb: 3 }}>
                        {renderSectionHeader('Tags', 'tags')}
                        <Collapse in={expandedSections.tags}>
                            <Box sx={{ p: 3 }}>
                                <Typography variant="body2" sx={{ mb: 3 }}>
                                    Add tags to this group for easier sorting later.
                                </Typography>

                                {/* This would be a custom tag selection component */}
                                <Button
                                    variant="outlined"
                                    startIcon={<Tag size={16} />}
                                    onClick={() => {/* Open tag selection dialog */}}
                                >
                                    Manage Tags
                                </Button>
                            </Box>
                        </Collapse>
                    </Paper>

                    {/* Submit Button */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={!isDirty || isSubmitting}
                            startIcon={<Save />}
                        >
                            {isEditMode ? 'Save Changes' : 'Create Impacted Group'}
                        </Button>
                    </Box>
                </Stack>
            </form>
        </Box>
    );
};

export default ImpactedGroupAssessment;


