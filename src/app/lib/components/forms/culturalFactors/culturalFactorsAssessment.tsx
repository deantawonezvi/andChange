import React from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import { Save } from 'lucide-react';
import { ModelService } from "@/app/lib/api/services/modelService";
import { QuestionWithRating } from "@/app/lib/components/forms/formComponents";
import {
    culturalFactorsDescriptions,
    culturalFactorsFields,
    CulturalFactorsFormData,
    ModelCulturalFactorsDTO
} from "@/app/lib/components/forms/culturalFactors/types";
import { useToast } from '@/app/lib/hooks/useToast';

const CulturalFactorsAssessment: React.FC = () => {
    const params = useParams();
    const projectId = typeof params.id === 'string' ? parseInt(params.id) : 0;
    const queryClient = useQueryClient();
    const modelService = ModelService.getInstance();
    const { showToast } = useToast();

    const { control, handleSubmit, reset, formState: { errors, isDirty } } = useForm<CulturalFactorsFormData>({
        defaultValues: {
            emotionalExpressivenessLevel: 3,
            uncertaintyAvoidanceLevel: 3,
            powerDistanceLevel: 3,
            individualismVsCollectivismLevel: 3,
            performanceViaMetricsVsRelationshipsLevel: 3,
            assertivenessLevel: 3,
            stabilityVsInnovationLevel: 3,
            consultativeDecisionMakingLevel: 3
        }
    });

    const { data: modelData, isLoading, error } = useQuery({
        queryKey: ['model', projectId],
        queryFn: () => modelService.getModelVariables(projectId),
        enabled: projectId > 0,
    });

    const mapModelToFormData = (model: any): CulturalFactorsFormData => {
        return {
            emotionalExpressivenessLevel: model.culturalFactorsDTO?.emotionalExpressiveness || 3,
            uncertaintyAvoidanceLevel: model.culturalFactorsDTO?.uncertaintyAvoidance || 3,
            powerDistanceLevel: model.culturalFactorsDTO?.powerDistance || 3,
            individualismVsCollectivismLevel: model.culturalFactorsDTO?.individualismVsCollectivism || 3,
            performanceViaMetricsVsRelationshipsLevel: model.culturalFactorsDTO?.performanceViaMetricsVsRelationships || 3,
            assertivenessLevel: model.culturalFactorsDTO?.assertiveness || 3,
            stabilityVsInnovationLevel: model.culturalFactorsDTO?.stabilityVsInnovation || 3,
            consultativeDecisionMakingLevel: model.culturalFactorsDTO?.consultativeDecisionMakingAndInclusivity || 3
        };
    };

    React.useEffect(() => {
        if (modelData) {
            const formData = mapModelToFormData(modelData);
            reset(formData);
        }
    }, [modelData, reset]);

    const updateCulturalFactorsMutation = useMutation({
        mutationFn: (data: ModelCulturalFactorsDTO) => modelService.updateCulturalFactors(data),
        onSuccess: () => {
            showToast('Cultural factors updated successfully', 'success');
            queryClient.invalidateQueries({ queryKey: ['model', projectId] });
        },
        onError: (error) => {
            showToast(`Error updating cultural factors: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
        }
    });

    const onSubmit = async (formData: CulturalFactorsFormData) => {
        if (!modelData) return;

        try {
            const culturalFactorsData: ModelCulturalFactorsDTO = {
                modelId: projectId,
                emotionalExpressiveness: formData.emotionalExpressivenessLevel,
                uncertaintyAvoidance: formData.uncertaintyAvoidanceLevel,
                powerDistance: formData.powerDistanceLevel,
                individualismVsCollectivism: formData.individualismVsCollectivismLevel,
                performanceViaMetricsVsRelationships: formData.performanceViaMetricsVsRelationshipsLevel,
                assertiveness: formData.assertivenessLevel,
                stabilityVsInnovation: formData.stabilityVsInnovationLevel,
                consultativeDecisionMakingAndInclusivity: formData.consultativeDecisionMakingLevel
            };

            await updateCulturalFactorsMutation.mutateAsync(culturalFactorsData);
        } catch (error) {
            console.log('Error submitting form:', error);
        }
    };

    const getDescriptionsForField = (fieldName: string): string[] => {
        switch (fieldName) {
            case 'emotionalExpressivenessLevel':
                return culturalFactorsDescriptions.emotionalExpressiveness;
            case 'uncertaintyAvoidanceLevel':
                return culturalFactorsDescriptions.uncertaintyAvoidance;
            case 'powerDistanceLevel':
                return culturalFactorsDescriptions.powerDistance;
            case 'individualismVsCollectivismLevel':
                return culturalFactorsDescriptions.individualismVsCollectivism;
            case 'performanceViaMetricsVsRelationshipsLevel':
                return culturalFactorsDescriptions.performanceViaMetricsVsRelationships;
            case 'assertivenessLevel':
                return culturalFactorsDescriptions.assertiveness;
            case 'stabilityVsInnovationLevel':
                return culturalFactorsDescriptions.stabilityVsInnovation;
            case 'consultativeDecisionMakingLevel':
                return culturalFactorsDescriptions.consultativeDecisionMaking;
            default:
                return [];
        }
    };

    if (projectId === 0) {
        return <Alert severity="error">Invalid project ID</Alert>;
    }

    if (isLoading) {
        return <Typography sx={{ p: 4, textAlign: 'center' }}>Loading cultural factors data...</Typography>;
    }

    if (error) {
        return <Alert severity="error">Error loading cultural factors data</Alert>;
    }

    const sortedFields = [...culturalFactorsFields].sort((a, b) =>
        (a.order || 100) - (b.order || 100)
    );

    return (
        <Box sx={{ mx: 'auto'}}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={3}>
                    {updateCulturalFactorsMutation.isError && (
                        <Alert severity="error">
                            Error updating cultural factors. Please try again.
                        </Alert>
                    )}

                    <Typography variant="body1" paragraph>
                        Set the cultural factors to help the system understand your organizations culture and generate
                        appropriate change management strategies.
                    </Typography>

                    {sortedFields.map((field) => (
                        <QuestionWithRating
                            key={field.fieldName}
                            label={field.label}
                            tooltip={field.tooltip}
                            fieldName={field.fieldName}
                            required={field.required}
                            type={field.type}
                            options={field.type === 'radio' ? field.options : undefined}
                            orientation={field.type === 'radio' ? field.orientation : 'vertical'}
                            control={control}
                            errors={errors}
                            descriptions={getDescriptionsForField(field.fieldName)}
                        />
                    ))}

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={!isDirty || updateCulturalFactorsMutation.isPending}
                            startIcon={<Save />}
                        >
                            Save Cultural Factors Settings
                        </Button>
                    </Box>
                </Stack>
            </form>
        </Box>
    );
};

export default CulturalFactorsAssessment;