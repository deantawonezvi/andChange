import React from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert, Box, Button, Paper, Stack, Typography } from '@mui/material';
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

    const { control, handleSubmit, reset, watch, formState: { errors, isDirty } } = useForm<CulturalFactorsFormData>({
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

    // Map from API model to form data
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

    // Helper to get description for a specific level of a dimension
    const getDescription = (dimension: keyof typeof culturalFactorsDescriptions, level: number): string => {
        return culturalFactorsDescriptions[dimension][level - 1] || '';
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

    // Current form values
    const formValues = watch();

    // Sort fields by order property
    const sortedFields = [...culturalFactorsFields].sort((a, b) =>
        (a.order || 100) - (b.order || 100)
    );

    return (
        <Box sx={{ mx: 'auto', p: 3 }}>
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
                        <Paper key={field.fieldName} elevation={0} sx={{ p: 3, mb: 2, borderRadius: 1 }}>
                            <QuestionWithRating
                                label={field.label}
                                tooltip={field.tooltip}
                                fieldName={field.fieldName}
                                required={field.required}
                                type={field.type}
                                options={field.type === 'radio' ? field.options : undefined}
                                orientation={field.type === 'radio' ? field.orientation : 'vertical'}
                                min={field.type === 'slider' ? field.min : undefined}
                                max={field.type === 'slider' ? field.max : undefined}
                                marks={field.type === 'slider' ? field.marks : undefined}
                                control={control}
                                errors={errors}
                            >
                                {/* We could add field-specific elements here if needed */}
                            </QuestionWithRating>

                            {/* Display the description for the currently selected level */}
                            {field.fieldName === 'emotionalExpressivenessLevel' && (
                                <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: 'text.secondary' }}>
                                    {getDescription('emotionalExpressiveness', formValues.emotionalExpressivenessLevel)}
                                </Typography>
                            )}
                            {field.fieldName === 'uncertaintyAvoidanceLevel' && (
                                <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: 'text.secondary' }}>
                                    {getDescription('uncertaintyAvoidance', formValues.uncertaintyAvoidanceLevel)}
                                </Typography>
                            )}
                            {field.fieldName === 'powerDistanceLevel' && (
                                <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: 'text.secondary' }}>
                                    {getDescription('powerDistance', formValues.powerDistanceLevel)}
                                </Typography>
                            )}
                            {field.fieldName === 'individualismVsCollectivismLevel' && (
                                <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: 'text.secondary' }}>
                                    {getDescription('individualismVsCollectivism', formValues.individualismVsCollectivismLevel)}
                                </Typography>
                            )}
                            {field.fieldName === 'performanceViaMetricsVsRelationshipsLevel' && (
                                <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: 'text.secondary' }}>
                                    {getDescription('performanceViaMetricsVsRelationships', formValues.performanceViaMetricsVsRelationshipsLevel)}
                                </Typography>
                            )}
                            {field.fieldName === 'assertivenessLevel' && (
                                <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: 'text.secondary' }}>
                                    {getDescription('assertiveness', formValues.assertivenessLevel)}
                                </Typography>
                            )}
                            {field.fieldName === 'stabilityVsInnovationLevel' && (
                                <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: 'text.secondary' }}>
                                    {getDescription('stabilityVsInnovation', formValues.stabilityVsInnovationLevel)}
                                </Typography>
                            )}
                            {field.fieldName === 'consultativeDecisionMakingLevel' && (
                                <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: 'text.secondary' }}>
                                    {getDescription('consultativeDecisionMaking', formValues.consultativeDecisionMakingLevel)}
                                </Typography>
                            )}
                        </Paper>
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