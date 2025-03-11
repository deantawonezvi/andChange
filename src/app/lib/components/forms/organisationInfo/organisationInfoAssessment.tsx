import React from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import { Save } from 'lucide-react';
import { ModelService, ModelVariablesDTO } from "@/app/lib/api/services/modelService";
import { QuestionWithRating } from "@/app/lib/components/forms/formComponents";
import { organisationInfoFields } from "@/app/lib/components/forms/organisationInfo/types";
import { useToast } from '@/app/lib/hooks/useToast';

interface OrganizationalFormData {
    organizationName: string;
    organizationNameRating: number;
    industry: string;
    industryRating: number;
    organizationValues: string;
    organizationValuesRating: number;
    definitionOfSuccess: string;
    definitionOfSuccessRating: number;
    organizationBenefits: string;
    organizationBenefitsRating: number;
    reasonsForChange: string;
    reasonsForChangeRating: number;
    projectAlignmentToOrgValues: string;
    projectAlignmentToOrgValuesRating: number;
    projectAlignmentToOrgStrategy: string;
    projectAlignmentToOrgStrategyRating: number;
    isProjectAgile: boolean;

    // Governance fields
    sponsorAccessEvaluation: number;

    // ECM Assessment
    establishedCMO: boolean;

    // OrganizationalReadiness fields
    changeSaturation: number;
    managementOfPastChanges: number;
    organizationSharedVisionAndStrategicDirection: number;
    availabilityOfResourcesAndFunding: number;
    leadershipMindset: number;
    impactedEmployeeChangeCompetency: number;
    changeManagementMaturity: number;
    projectManagementMaturity: number;
}

const OrganizationalAssessmentForm: React.FC = () => {
    const params = useParams();
    const projectId = typeof params.id === 'string' ? parseInt(params.id) : 0;
    const queryClient = useQueryClient();
    const modelService = ModelService.getInstance();
    const { showToast } = useToast();

    const { control, handleSubmit, reset, formState: { errors, isDirty } } = useForm<OrganizationalFormData>({
        defaultValues: {
            // AnagraphicData fields
            organizationName: '',
            organizationNameRating: 1,
            industry: '',
            industryRating: 1,
            organizationValues: '',
            organizationValuesRating: 1,
            definitionOfSuccess: '',
            definitionOfSuccessRating: 1,
            organizationBenefits: '',
            organizationBenefitsRating: 1,
            reasonsForChange: '',
            reasonsForChangeRating: 1,
            projectAlignmentToOrgValues: '',
            projectAlignmentToOrgValuesRating: 1,
            projectAlignmentToOrgStrategy: '',
            projectAlignmentToOrgStrategyRating: 1,
            isProjectAgile: false,

            // Governance fields
            sponsorAccessEvaluation: 1,

            // ECM Assessment
            establishedCMO: false,

            // OrganizationalReadiness fields
            changeSaturation: 1,
            managementOfPastChanges: 1,
            organizationSharedVisionAndStrategicDirection: 1,
            availabilityOfResourcesAndFunding: 1,
            leadershipMindset: 1,
            impactedEmployeeChangeCompetency: 1,
            changeManagementMaturity: 1,
            projectManagementMaturity: 1,
        }
    });

    const { data: modelData, isLoading, error } = useQuery({
        queryKey: ['model', projectId],
        queryFn: () => modelService.getModelVariables(projectId),
        enabled: projectId > 0,
    });

    // Map from API model to form data
    const mapModelToFormData = (model: ModelVariablesDTO): OrganizationalFormData => {
        return {
            // AnagraphicData fields
            organizationName: model.anagraphicData?.organizationName || '',
            organizationNameRating: model.anagraphicData?.organizationNameRating || 1,
            industry: model.anagraphicData?.industry || '',
            industryRating: model.anagraphicData?.industryRating || 1,
            organizationValues: model.anagraphicData?.organizationValues || '',
            organizationValuesRating: model.anagraphicData?.organizationValuesRating || 1,
            definitionOfSuccess: model.anagraphicData?.definitionOfSuccess || '',
            definitionOfSuccessRating: model.anagraphicData?.definitionOfSuccessRating || 1,
            organizationBenefits: model.anagraphicData?.organizationBenefits || '',
            organizationBenefitsRating: model.anagraphicData?.organizationBenefitsRating || 1,
            reasonsForChange: model.anagraphicData?.reasonsForChange || '',
            reasonsForChangeRating: model.anagraphicData?.reasonsForChangeRating || 1,
            projectAlignmentToOrgValues: model.anagraphicData?.projectAlignmentToOrgValues || '',
            projectAlignmentToOrgValuesRating: model.anagraphicData?.projectAlignmentToOrgValuesRating || 1,
            projectAlignmentToOrgStrategy: model.anagraphicData?.projectAlignmentToOrgStrategy || '',
            projectAlignmentToOrgStrategyRating: model.anagraphicData?.projectAlignmentToOrgStrategyRating || 1,
            isProjectAgile: model.anagraphicData?.isProjectAgile || false,

            // Governance fields
            sponsorAccessEvaluation: model.governance?.sponsorAccessEvaluation || 1,

            // ECM Assessment
            establishedCMO: model.ecmAssessment?.establishedCMO || false,

            // OrganizationalReadiness fields
            changeSaturation: model.organizationalReadiness?.changeSaturation || 1,
            managementOfPastChanges: model.organizationalReadiness?.managementOfPastChanges || 1,
            organizationSharedVisionAndStrategicDirection: model.organizationalReadiness?.organizationSharedVisionAndStrategicDirection || 1,
            availabilityOfResourcesAndFunding: model.organizationalReadiness?.availabilityOfResourcesAndFunding || 1,
            leadershipMindset: model.organizationalReadiness?.leadershipMindset || 1,
            impactedEmployeeChangeCompetency: model.organizationalReadiness?.impactedEmployeeChangeCompetency || 1,
            changeManagementMaturity: model.organizationalReadiness?.changeManagementMaturity || 1,
            projectManagementMaturity: model.organizationalReadiness?.projectManagementMaturity || 1,
        };
    };

    // Map form data back to API model structure
    const mapFormDataToModel = (formData: OrganizationalFormData, existingModel: ModelVariablesDTO): Partial<ModelVariablesDTO> => {
        const model: Partial<ModelVariablesDTO> = {
            id: existingModel.id,
            projectId: existingModel.projectId,
            anagraphicData: {
                ...existingModel.anagraphicData,
                modelId: projectId,
                organizationName: formData.organizationName,
                organizationNameRating: formData.organizationNameRating,
                industry: formData.industry,
                industryRating: formData.industryRating,
                organizationValues: formData.organizationValues,
                organizationValuesRating: formData.organizationValuesRating,
                definitionOfSuccess: formData.definitionOfSuccess,
                definitionOfSuccessRating: formData.definitionOfSuccessRating,
                organizationBenefits: formData.organizationBenefits,
                organizationBenefitsRating: formData.organizationBenefitsRating,
                reasonsForChange: formData.reasonsForChange,
                reasonsForChangeRating: formData.reasonsForChangeRating,
                projectAlignmentToOrgValues: formData.projectAlignmentToOrgValues,
                projectAlignmentToOrgValuesRating: formData.projectAlignmentToOrgValuesRating,
                projectAlignmentToOrgStrategy: formData.projectAlignmentToOrgStrategy,
                projectAlignmentToOrgStrategyRating: formData.projectAlignmentToOrgStrategyRating,
                isProjectAgile: formData.isProjectAgile,
            },
            governance: {
                ...existingModel.governance,
                modelId: projectId,
                sponsorAccessEvaluation: formData.sponsorAccessEvaluation,
            },
            ecmAssessment: {
                ...existingModel.ecmAssessment,
                modelId: projectId,
                establishedCMO: formData.establishedCMO,
            },
            organizationalReadiness: {
                ...existingModel.organizationalReadiness,
                modelId: projectId,
                changeSaturation: formData.changeSaturation,
                managementOfPastChanges: formData.managementOfPastChanges,
                organizationSharedVisionAndStrategicDirection: formData.organizationSharedVisionAndStrategicDirection,
                availabilityOfResourcesAndFunding: formData.availabilityOfResourcesAndFunding,
                leadershipMindset: formData.leadershipMindset,
                impactedEmployeeChangeCompetency: formData.impactedEmployeeChangeCompetency,
                changeManagementMaturity: formData.changeManagementMaturity,
                projectManagementMaturity: formData.projectManagementMaturity,
            }
        };

        return model;
    };

    React.useEffect(() => {
        if (modelData) {
            const formData = mapModelToFormData(modelData);
            reset(formData);
        }
    }, [modelData, reset]);

    const updateAnagraphicDataMutation = useMutation({
        mutationFn: (data: any) => modelService.updateAnagraphicData(data),
        onSuccess: () => {
            showToast('Organization information updated successfully', 'success');
            queryClient.invalidateQueries({ queryKey: ['model', projectId] });
        },
        onError: (error) => {
            showToast(`Error updating anagraphic data: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
        }
    });

    const updateOrganizationalReadinessMutation = useMutation({
        mutationFn: (data: any) => modelService.updateOrganizationalReadiness(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['model', projectId] });
        },
        onError: (error) => {
            showToast(`Error updating organizational readiness: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
        }
    });

    const updateGovernanceMutation = useMutation({
        mutationFn: (data: any) => modelService.updateGovernance(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['model', projectId] });
        },
        onError: (error) => {
            showToast(`Error updating governance: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
        }
    });

    const updateECMAssessmentMutation = useMutation({
        mutationFn: (data: any) => modelService.updateECMAssessment(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['model', projectId] });
        },
        onError: (error) => {
            showToast(`Error updating ECM assessment: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
        }
    });

    const onSubmit = async (formData: OrganizationalFormData) => {

        console.log(modelData)
        if (!modelData) return;

        try {
            const modelUpdates = mapFormDataToModel(formData, modelData);

            // Update anagraphic data
            if (modelUpdates.anagraphicData) {
                await updateAnagraphicDataMutation.mutateAsync(modelUpdates.anagraphicData);
            }

            // Update organizational readiness
            if (modelUpdates.organizationalReadiness) {
                await updateOrganizationalReadinessMutation.mutateAsync(modelUpdates.organizationalReadiness);
            }

            // Update governance
            if (modelUpdates.governance) {
                await updateGovernanceMutation.mutateAsync(modelUpdates.governance);
            }

            // Update ECM assessment
            if (modelUpdates.ecmAssessment) {
                await updateECMAssessmentMutation.mutateAsync(modelUpdates.ecmAssessment);
            }
        } catch (error) {
            console.log('Error submitting form:', error);
        }
    };

    if (projectId === 0) {
        return <Alert severity="error">Invalid project ID</Alert>;
    }

    if (isLoading) {
        return <Typography sx={{ p: 4, textAlign: 'center' }}>Loading organization data...</Typography>;
    }

    if (error) {
        return <Alert severity="error">Error loading organization data</Alert>;
    }

    // Sort fields by order property
    const sortedFields = [...organisationInfoFields].sort((a, b) =>
        (a.order || 100) - (b.order || 100)
    );

    return (
        <Box sx={{ mx: 'auto', p: 3 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={3}>
                    {(updateAnagraphicDataMutation.isError ||
                        updateOrganizationalReadinessMutation.isError ||
                        updateGovernanceMutation.isError ||
                        updateECMAssessmentMutation.isError) && (
                        <Alert severity="error">
                            Error updating organization information. Please try again.
                        </Alert>
                    )}

                    {sortedFields.map((field) => (
                        <QuestionWithRating
                            key={field.fieldName}
                            label={field.label}
                            tooltip={field.tooltip}
                            fieldName={field.fieldName}
                            ratingFieldName={field.ratingFieldName}
                            required={field.required}
                            multiline={field.multiline}
                            type={field.type}
                            options={field.type === 'select' ? field.options : undefined}
                            min={field.type === 'slider' ? field.min : undefined}
                            max={field.type === 'slider' ? field.max : undefined}
                            marks={field.type === 'slider' ? field.marks : undefined}
                            control={control}
                            errors={errors}
                        />
                    ))}

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={!isDirty ||
                                updateAnagraphicDataMutation.isPending ||
                                updateOrganizationalReadinessMutation.isPending ||
                                updateGovernanceMutation.isPending ||
                                updateECMAssessmentMutation.isPending}
                            startIcon={<Save />}
                        >
                            Save Organization Information
                        </Button>
                    </Box>
                </Stack>
            </form>
        </Box>
    );
};

export default OrganizationalAssessmentForm;