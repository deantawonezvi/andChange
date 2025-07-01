import React from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import { Save } from 'lucide-react';
import { ModelService, ModelVariablesDTO } from "@/app/lib/api/services/modelService";
import { QuestionWithRating } from "@/app/lib/components/forms/formComponents";
import { projectInfoFields } from "@/app/lib/components/forms/projectInformation/types";
import { useToast } from '@/app/lib/hooks/useToast';

interface ProjectInformationFormData {

    projectCharter?: string;
    changeProjectName: string;
    changeProjectNameRating: number;
    changeProjectObjectives: string;
    changeProjectObjectivesRating: number;
    projectAlignmentToOrgValues: string;
    projectAlignmentToOrgValuesRating: number;
    projectAlignmentToOrgStrategy: string;
    projectAlignmentToOrgStrategyRating: number;
    isProjectAgile: boolean;

    prepareApproachBudget: number;
    manageChangeBudget: number;
    sustainOutcomesBudget: number;
    sourceOfBudget: string;
    sufficiencyOfBudget: number;
    timingAndFlow: number;

    whyValueStatement: string;
    whyValueStatementRating: number;
    whyNowValueStatement: string;
    whyNowValueStatementRating: number;
    ifNotValueStatement: string;
    ifNotValueStatementRating: number;

    scopeOfChange: number;
    amountOfOverallChange: number;
    degreeOfConfidentialityRequired: number;
    degreeOfExternalStakeholderImpact: number;

    isProjectPerceivedAsStrategic: boolean;
    changeCompetencyOfKeyRolesDeveloped: boolean;

    perceivedNeedToChangeAmongImpacted: number;
}

const ProjectInformationAssessment: React.FC = () => {
    const params = useParams();
    const projectId = typeof params.id === 'string' ? parseInt(params.id) : 0;
    const queryClient = useQueryClient();
    const modelService = ModelService.getInstance();
    const { showToast } = useToast();

    const { control, handleSubmit, reset, formState: { errors, isDirty } } = useForm<ProjectInformationFormData>({
        defaultValues: {

            projectCharter: '',
            changeProjectName: '',
            changeProjectNameRating: 1,
            changeProjectObjectives: '',
            changeProjectObjectivesRating: 1,
            projectAlignmentToOrgValues: '',
            projectAlignmentToOrgValuesRating: 1,
            projectAlignmentToOrgStrategy: '',
            projectAlignmentToOrgStrategyRating: 1,
            isProjectAgile: false,

            prepareApproachBudget: 0,
            manageChangeBudget: 0,
            sustainOutcomesBudget: 0,
            sourceOfBudget: '',
            sufficiencyOfBudget: 1,
            timingAndFlow: 1,

            whyValueStatement: '',
            whyValueStatementRating: 1,
            whyNowValueStatement: '',
            whyNowValueStatementRating: 1,
            ifNotValueStatement: '',
            ifNotValueStatementRating: 1,

            scopeOfChange: 1,
            amountOfOverallChange: 1,
            degreeOfConfidentialityRequired: 1,
            degreeOfExternalStakeholderImpact: 1,

            isProjectPerceivedAsStrategic: false,
            changeCompetencyOfKeyRolesDeveloped: false,

            perceivedNeedToChangeAmongImpacted: 1,
        }
    });

    const { data: modelData, isLoading, error } = useQuery({
        queryKey: ['model', projectId],
        queryFn: () => modelService.getModelVariables(projectId),
        enabled: projectId > 0,
    });

    const mapModelToFormData = (model: ModelVariablesDTO): ProjectInformationFormData => {
        return {

            projectCharter: model.anagraphicData?.projectCharter || '',
            changeProjectName: model.anagraphicData?.changeProjectName || '',
            changeProjectNameRating: model.anagraphicData?.changeProjectNameRating || 1,
            changeProjectObjectives: model.anagraphicData?.changeProjectObjectives || '',
            changeProjectObjectivesRating: model.anagraphicData?.changeProjectObjectivesRating || 1,
            projectAlignmentToOrgValues: model.anagraphicData?.projectAlignmentToOrgValues || '',
            projectAlignmentToOrgValuesRating: model.anagraphicData?.projectAlignmentToOrgValuesRating || 1,
            projectAlignmentToOrgStrategy: model.anagraphicData?.projectAlignmentToOrgStrategy || '',
            projectAlignmentToOrgStrategyRating: model.anagraphicData?.projectAlignmentToOrgStrategyRating || 1,
            isProjectAgile: model.anagraphicData?.isProjectAgile || false,

            prepareApproachBudget: model.budget?.prepareApproachBudget || 0,
            manageChangeBudget: model.budget?.manageChangeBudget || 0,
            sustainOutcomesBudget: model.budget?.sustainOutcomesBudget || 0,
            sourceOfBudget: model.budget?.sourceOfBudget || '',
            sufficiencyOfBudget: model.budget?.sufficiencyOfBudget || 1,
            timingAndFlow: model.budget?.timingAndFlow || 1,

            whyValueStatement: model.valueStatement?.whyValueStatement || '',
            whyValueStatementRating: model.valueStatement?.whyValueStatementRating || 1,
            whyNowValueStatement: model.valueStatement?.whyNowValueStatement || '',
            whyNowValueStatementRating: model.valueStatement?.whyNowValueStatementRating || 1,
            ifNotValueStatement: model.valueStatement?.ifNotValueStatement || '',
            ifNotValueStatementRating: model.valueStatement?.ifNotValueStatementRating || 1,

            scopeOfChange: model.changeCharacteristics?.scopeOfChange || 1,
            amountOfOverallChange: model.changeCharacteristics?.amountOfOverallChange || 1,
            degreeOfConfidentialityRequired: model.changeCharacteristics?.degreeOfConfidentialityRequired || 1,
            degreeOfExternalStakeholderImpact: model.changeCharacteristics?.degreeOfExternalStakeholderImpact || 1,

            isProjectPerceivedAsStrategic: model.ecmAssessment?.isProjectPerceivedAsStrategic || false,
            changeCompetencyOfKeyRolesDeveloped: model.ecmAssessment?.changeCompetencyOfKeyRolesDeveloped || false,

            perceivedNeedToChangeAmongImpacted: model.organizationalReadiness?.perceivedNeedToChangeAmongImpacted || 1,
        };
    };

    const mapFormDataToModel = (formData: ProjectInformationFormData, existingModel: ModelVariablesDTO): Partial<ModelVariablesDTO> => {
        const model: Partial<ModelVariablesDTO> = {
            id: existingModel.id,
            projectId: existingModel.projectId,
            anagraphicData: {
                ...existingModel.anagraphicData,
                modelId: projectId,
                projectCharter: formData.projectCharter,
                changeProjectName: formData.changeProjectName,
                changeProjectNameRating: formData.changeProjectNameRating,
                changeProjectObjectives: formData.changeProjectObjectives,
                changeProjectObjectivesRating: formData.changeProjectObjectivesRating,
                projectAlignmentToOrgValues: formData.projectAlignmentToOrgValues,
                projectAlignmentToOrgValuesRating: formData.projectAlignmentToOrgValuesRating,
                projectAlignmentToOrgStrategy: formData.projectAlignmentToOrgStrategy,
                projectAlignmentToOrgStrategyRating: formData.projectAlignmentToOrgStrategyRating,
                isProjectAgile: formData.isProjectAgile,
            },
            budget: {
                ...existingModel.budget,
                modelId: projectId,
                prepareApproachBudget: formData.prepareApproachBudget,
                manageChangeBudget: formData.manageChangeBudget,
                sustainOutcomesBudget: formData.sustainOutcomesBudget,
                sourceOfBudget: formData.sourceOfBudget,
                sufficiencyOfBudget: formData.sufficiencyOfBudget,
                timingAndFlow: formData.timingAndFlow,
            },
            valueStatement: {
                ...existingModel.valueStatement,
                modelId: projectId,
                whyValueStatement: formData.whyValueStatement,
                whyValueStatementRating: formData.whyValueStatementRating,
                whyNowValueStatement: formData.whyNowValueStatement,
                whyNowValueStatementRating: formData.whyNowValueStatementRating,
                ifNotValueStatement: formData.ifNotValueStatement,
                ifNotValueStatementRating: formData.ifNotValueStatementRating,
            },
            changeCharacteristics: {
                ...existingModel.changeCharacteristics,
                modelId: projectId,
                scopeOfChange: formData.scopeOfChange,
                amountOfOverallChange: formData.amountOfOverallChange,
                degreeOfConfidentialityRequired: formData.degreeOfConfidentialityRequired,
                degreeOfExternalStakeholderImpact: formData.degreeOfExternalStakeholderImpact,
            },
            ecmAssessment: {
                ...existingModel.ecmAssessment,
                modelId: projectId,
                isProjectPerceivedAsStrategic: formData.isProjectPerceivedAsStrategic,
                changeCompetencyOfKeyRolesDeveloped: formData.changeCompetencyOfKeyRolesDeveloped,
            },
            organizationalReadiness: {
                ...existingModel.organizationalReadiness,
                modelId: projectId,
                perceivedNeedToChangeAmongImpacted: formData.perceivedNeedToChangeAmongImpacted,
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
            showToast('Project information updated successfully', 'success');
            queryClient.invalidateQueries({ queryKey: ['model', projectId] });
        },
        onError: (error) => {
            showToast(`Error updating project information: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
        }
    });

    const updateBudgetMutation = useMutation({
        mutationFn: (data: any) => modelService.updateBudget(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['model', projectId] });
        },
        onError: (error) => {
            showToast(`Error updating budget information: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
        }
    });

    const updateValueStatementMutation = useMutation({
        mutationFn: (data: any) => modelService.updateValueStatement(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['model', projectId] });
        },
        onError: (error) => {
            showToast(`Error updating value statement: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
        }
    });

    const updateChangeCharacteristicsMutation = useMutation({
        mutationFn: (data: any) => modelService.updateChangeCharacteristics(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['model', projectId] });
        },
        onError: (error) => {
            showToast(`Error updating change characteristics: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
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

    const updateOrganizationalReadinessMutation = useMutation({
        mutationFn: (data: any) => modelService.updateOrganizationalReadiness(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['model', projectId] });
        },
        onError: (error) => {
            showToast(`Error updating organizational readiness: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
        }
    });

    const onSubmit = async (formData: ProjectInformationFormData) => {
        if (!modelData) return;

        try {
            const modelUpdates = mapFormDataToModel(formData, modelData);

            if (modelUpdates.anagraphicData) {
                await updateAnagraphicDataMutation.mutateAsync(modelUpdates.anagraphicData);
            }

            if (modelUpdates.budget) {
                await updateBudgetMutation.mutateAsync(modelUpdates.budget);
            }

            if (modelUpdates.valueStatement) {
                await updateValueStatementMutation.mutateAsync(modelUpdates.valueStatement);
            }

            if (modelUpdates.changeCharacteristics) {
                await updateChangeCharacteristicsMutation.mutateAsync(modelUpdates.changeCharacteristics);
            }

            if (modelUpdates.ecmAssessment) {
                await updateECMAssessmentMutation.mutateAsync(modelUpdates.ecmAssessment);
            }

            if (modelUpdates.organizationalReadiness) {
                await updateOrganizationalReadinessMutation.mutateAsync(modelUpdates.organizationalReadiness);
            }
        } catch (error) {
            console.log('Error submitting form:', error);
        }
    };

    if (projectId === 0) {
        return <Alert severity="error">Invalid project ID</Alert>;
    }

    if (isLoading) {
        return <Typography sx={{ p: 4, textAlign: 'center' }}>Loading project data...</Typography>;
    }

    if (error) {
        return <Alert severity="error">Error loading project data</Alert>;
    }

    const sortedFields = [...projectInfoFields].sort((a, b) =>
        (a.order || 100) - (b.order || 100)
    );

    return (
        <Box sx={{ mx: 'auto' }}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={3}>
                    {(updateAnagraphicDataMutation.isError ||
                        updateBudgetMutation.isError ||
                        updateValueStatementMutation.isError ||
                        updateChangeCharacteristicsMutation.isError ||
                        updateECMAssessmentMutation.isError ||
                        updateOrganizationalReadinessMutation.isError) && (
                        <Alert severity="error">
                            Error updating project information. Please try again.
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
                            multiline={field.type !== 'select' && field.type !== 'slider' && field.type !== 'boolean'&& field.type !== 'date' ? field.multiline : undefined}
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
                                updateBudgetMutation.isPending ||
                                updateValueStatementMutation.isPending ||
                                updateChangeCharacteristicsMutation.isPending ||
                                updateECMAssessmentMutation.isPending ||
                                updateOrganizationalReadinessMutation.isPending}
                            startIcon={<Save />}
                        >
                            Save Project Information
                        </Button>
                    </Box>
                </Stack>
            </form>
        </Box>
    );
};

export default ProjectInformationAssessment;