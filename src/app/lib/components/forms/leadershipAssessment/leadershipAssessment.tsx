import React from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import { Save } from 'lucide-react';
import {
    ModelPCTChangeManagementDTO,
    ModelPCTSponsorshipDTO,
    ModelPCTSuccessDTO,
    ModelService,
    ModelVariablesDTO
} from "@/app/lib/api/services/modelService";
import { QuestionWithRating } from "@/app/lib/components/forms/formComponents";
import { useToast } from '@/app/lib/hooks/useToast';
import { leadershipFields } from "@/app/lib/components/forms/leadershipAssessment/types";

// Define the leadership fields based on the table provided

interface LeadershipFormData {
    // PCT Success fields
    sponsorshipConsensusOnDefinitionOfSuccess: string;
    sponsorshipConsensusOnDefinitionOfSuccessRating: number;

    // PCT Sponsorship fields
    sponsorHasAuthority: string;
    sponsorHasAuthorityRating: number;
    sponsorIsResolvingIssues: string;
    sponsorIsResolvingIssuesRating: number;

    // PCT Change Management fields
    strengthOfSponsorCoalitionAssessed: string;
    strengthOfSponsorCoalitionAssessedRating: number;
    changeStrategyWithSponsorshipCommitment: string;
    changeStrategyWithSponsorshipCommitmentRating: number;
}

const LeadershipAssessment: React.FC = () => {
    const params = useParams();
    const projectId = typeof params.id === 'string' ? parseInt(params.id) : 0;
    const queryClient = useQueryClient();
    const modelService = ModelService.getInstance();
    const { showToast } = useToast();

    const { control, handleSubmit, reset, formState: { errors, isDirty } } = useForm<LeadershipFormData>({
        defaultValues: {
            sponsorshipConsensusOnDefinitionOfSuccess: '',
            sponsorshipConsensusOnDefinitionOfSuccessRating: 1,
            sponsorHasAuthority: '',
            sponsorHasAuthorityRating: 1,
            sponsorIsResolvingIssues: '',
            sponsorIsResolvingIssuesRating: 1,
            strengthOfSponsorCoalitionAssessed: '',
            strengthOfSponsorCoalitionAssessedRating: 1,
            changeStrategyWithSponsorshipCommitment: '',
            changeStrategyWithSponsorshipCommitmentRating: 1,
        }
    });

    const { data: modelData, isLoading, error } = useQuery({
        queryKey: ['model', projectId],
        queryFn: () => modelService.getModelVariables(projectId),
        enabled: projectId > 0,
    });

    // Map from API model to form data
    const mapModelToFormData = (model: ModelVariablesDTO): LeadershipFormData => {
        return {
            // PCT Success field
            sponsorshipConsensusOnDefinitionOfSuccess: '',
            sponsorshipConsensusOnDefinitionOfSuccessRating: model.pctSuccess?.sponsorshipConsensusOnDefinitionOfSuccess || 1,

            // PCT Sponsorship fields
            sponsorHasAuthority: '',
            sponsorHasAuthorityRating: model.pctSponsorship?.sponsorHasAuthority || 1,
            sponsorIsResolvingIssues: '',
            sponsorIsResolvingIssuesRating: model.pctSponsorship?.sponsorIsResolvingIssues || 1,

            // PCT Change Management fields
            strengthOfSponsorCoalitionAssessed: '',
            strengthOfSponsorCoalitionAssessedRating: model.pctChangeManagement?.strengthOfSponsorCoalitionAssessed || 1,
            changeStrategyWithSponsorshipCommitment: '',
            changeStrategyWithSponsorshipCommitmentRating: model.pctChangeManagement?.changeStrategyWithSponsorshipCommitment || 1,
        };
    };

    React.useEffect(() => {
        if (modelData) {
            const formData = mapModelToFormData(modelData);
            reset(formData);
        }
    }, [modelData, reset]);

    // Mutations for the three different endpoints
    const updatePCTSuccessMutation = useMutation({
        mutationFn: (data: ModelPCTSuccessDTO) => modelService.updatePCTSuccess(data),
        onSuccess: () => {
            showToast('Success definition information updated', 'success');
            queryClient.invalidateQueries({ queryKey: ['model', projectId] });
        },
        onError: (error) => {
            showToast(`Error updating success definition: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
        }
    });

    const updatePCTSponsorshipMutation = useMutation({
        mutationFn: (data: ModelPCTSponsorshipDTO) => modelService.updatePCTSponsorship(data),
        onSuccess: () => {
            showToast('Sponsorship information updated', 'success');
            queryClient.invalidateQueries({ queryKey: ['model', projectId] });
        },
        onError: (error) => {
            showToast(`Error updating sponsorship information: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
        }
    });

    const updatePCTChangeManagementMutation = useMutation({
        mutationFn: (data: ModelPCTChangeManagementDTO) => modelService.updatePCTChangeManagement(data),
        onSuccess: () => {
            showToast('Change management information updated', 'success');
            queryClient.invalidateQueries({ queryKey: ['model', projectId] });
        },
        onError: (error) => {
            showToast(`Error updating change management information: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
        }
    });

    const onSubmit = async (formData: LeadershipFormData) => {
        if (!modelData) return;

        try {
            // Prepare the data for each endpoint
            const pctSuccessData: ModelPCTSuccessDTO = {
                modelId: projectId,
                sponsorshipConsensusOnDefinitionOfSuccess: formData.sponsorshipConsensusOnDefinitionOfSuccessRating,
                processInputsDefined: modelData.pctSuccess?.processInputsDefined,
                processBenefitsDefined: modelData.pctSuccess?.processBenefitsDefined,
                projectObjectivesDefined: modelData.pctSuccess?.projectObjectivesDefined,
                adoptionAndUsageObjectivesDefined: modelData.pctSuccess?.adoptionAndUsageObjectivesDefined,
                metricsOfBenefitsAndObjectivesDefined: modelData.pctSuccess?.metricsOfBenefitsAndObjectivesDefined,
                benefitsAndObjectivesPrioritized: modelData.pctSuccess?.benefitsAndObjectivesPrioritized,
                benefitAndObjectiveOwnershipDesignated: modelData.pctSuccess?.benefitAndObjectiveOwnershipDesignated,
                benefitAndObjectivePeopleDependencyEvaluated: modelData.pctSuccess?.benefitAndObjectivePeopleDependencyEvaluated,
                definitionOfSuccessDefined: modelData.pctSuccess?.definitionOfSuccessDefined
            };

            const pctSponsorshipData: ModelPCTSponsorshipDTO = {
                modelId: projectId,
                sponsorHasAuthority: formData.sponsorHasAuthorityRating,
                sponsorIsResolvingIssues: formData.sponsorIsResolvingIssuesRating,
                sponsorCanJustifyChange: modelData.pctSponsorship?.sponsorCanJustifyChange,
                organizationHasDefinedVisionAndStrategy: modelData.pctSponsorship?.organizationHasDefinedVisionAndStrategy,
                changeIsAlignedWithOrganization: modelData.pctSponsorship?.changeIsAlignedWithOrganization,
                prioritiesSetAndCommunicated: modelData.pctSponsorship?.prioritiesSetAndCommunicated,
                sponsorIsParticipatingThroughoutLifecycle: modelData.pctSponsorship?.sponsorIsParticipatingThroughoutLifecycle,
                sponsorIsEncouragingLeadersToParticipate: modelData.pctSponsorship?.sponsorIsEncouragingLeadersToParticipate,
                sponsorBuildingAwarenessOfNeedDirectly: modelData.pctSponsorship?.sponsorBuildingAwarenessOfNeedDirectly,
                sponsorIsReinforcingChange: modelData.pctSponsorship?.sponsorIsReinforcingChange
            };

            const pctChangeManagementData: ModelPCTChangeManagementDTO = {
                modelId: projectId,
                strengthOfSponsorCoalitionAssessed: formData.strengthOfSponsorCoalitionAssessedRating,
                changeStrategyWithSponsorshipCommitment: formData.changeStrategyWithSponsorshipCommitmentRating,
                assessedImpactOfChange: modelData.pctChangeManagement?.assessedImpactOfChange,
                assessedChangeRisk: modelData.pctChangeManagement?.assessedChangeRisk,
                changeHasAdoptionAndUsageObjectives: modelData.pctChangeManagement?.changeHasAdoptionAndUsageObjectives,
                resourcesIdentifiedAndAcquired: modelData.pctChangeManagement?.resourcesIdentifiedAndAcquired,
                resistanceMitigationAndAdoptionPlansUnderway: modelData.pctChangeManagement?.resistanceMitigationAndAdoptionPlansUnderway,
                effectivenessMonitoredAndAdaptionOccurring: modelData.pctChangeManagement?.effectivenessMonitoredAndAdaptionOccurring,
                organizationReadyToOwnAndSustainChange: modelData.pctChangeManagement?.organizationReadyToOwnAndSustainChange
            };

            // Submit each update to the appropriate endpoint
            await updatePCTSuccessMutation.mutateAsync(pctSuccessData);
            await updatePCTSponsorshipMutation.mutateAsync(pctSponsorshipData);
            await updatePCTChangeManagementMutation.mutateAsync(pctChangeManagementData);

            showToast('Leadership assessment updated successfully', 'success');
        } catch (error) {
            console.log('Error submitting form:', error);
            showToast('Failed to update some leadership information', 'error');
        }
    };

    if (projectId === 0) {
        return <Alert severity="error">Invalid project ID</Alert>;
    }

    if (isLoading) {
        return <Typography sx={{ p: 4, textAlign: 'center' }}>Loading leadership data...</Typography>;
    }

    if (error) {
        return <Alert severity="error">Error loading leadership data</Alert>;
    }

    // Sort fields by order property
    const sortedFields = [...leadershipFields].sort((a, b) =>
        (a.order || 100) - (b.order || 100)
    );

    return (
        <Box sx={{ mx: 'auto', p: 3 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={3}>
                    {(updatePCTSuccessMutation.isError ||
                        updatePCTSponsorshipMutation.isError ||
                        updatePCTChangeManagementMutation.isError) && (
                        <Alert severity="error">
                            Error updating leadership information. Please try again.
                        </Alert>
                    )}

                    {sortedFields.map((field) => (
                        <QuestionWithRating
                            key={field.fieldName}
                            label={field.label}
                            tooltip={field.tooltip}
                            fieldName={field.fieldName}
                            required={field.required}
                            multiline={field.multiline}
                            control={control}
                            errors={errors}
                            type={field.type}
                            options={field.type === 'select' ? field.options : undefined}
                            min={field.type === 'slider' ? field.min : undefined}
                            max={field.type === 'slider' ? field.max : undefined}
                            marks={field.type === 'slider' ? field.marks : undefined}
                        />
                    ))}

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={!isDirty ||
                                updatePCTSuccessMutation.isPending ||
                                updatePCTSponsorshipMutation.isPending ||
                                updatePCTChangeManagementMutation.isPending}
                            startIcon={<Save />}
                        >
                            Save Leadership Information
                        </Button>
                    </Box>
                </Stack>
            </form>
        </Box>
    );
};

export default LeadershipAssessment;