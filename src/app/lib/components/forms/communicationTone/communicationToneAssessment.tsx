import React from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert, Box, Button, Paper, Stack, Typography } from '@mui/material';
import { Save } from 'lucide-react';
import { ModelService } from "@/app/lib/api/services/modelService";
import { QuestionWithRating } from "@/app/lib/components/forms/formComponents";
import {
    communicationToneDescriptions,
    communicationToneFields,
    CommunicationToneFormData,
    ModelToneFactorsDTO
} from "@/app/lib/components/forms/communicationTone/types";
import { useToast } from '@/app/lib/hooks/useToast';

const CommunicationToneAssessment: React.FC = () => {
    const params = useParams();
    const projectId = typeof params.id === 'string' ? parseInt(params.id) : 0;
    const queryClient = useQueryClient();
    const modelService = ModelService.getInstance();
    const { showToast } = useToast();

    const { control, handleSubmit, reset, formState: { errors, isDirty } } = useForm<CommunicationToneFormData>({
        defaultValues: {
            formalityCasualityLevel: 3,
            enthusiasmLevel: 3,
            emotionalExpressivenessLevel: 3
        }
    });

    const { data: modelData, isLoading, error } = useQuery({
        queryKey: ['model', projectId],
        queryFn: () => modelService.getModelVariables(projectId),
        enabled: projectId > 0,
    });

    // Map from API model to form data
    const mapModelToFormData = (model: any): CommunicationToneFormData => {
        return {
            formalityCasualityLevel: model.toneFactorsDTO?.formalVsCasual || 3,
            enthusiasmLevel: model.toneFactorsDTO?.levelOfEnthusiasm || 3,
            emotionalExpressivenessLevel: model.toneFactorsDTO?.emotionalExpressiveness || 3
        };
    };

    React.useEffect(() => {
        if (modelData) {
            const formData = mapModelToFormData(modelData);
            reset(formData);
        }
    }, [modelData, reset]);

    const updateToneFactorsMutation = useMutation({
        mutationFn: (data: ModelToneFactorsDTO) => modelService.updateToneFactors(data),
        onSuccess: () => {
            showToast('Communication tone settings updated successfully', 'success');
            queryClient.invalidateQueries({ queryKey: ['model', projectId] });
        },
        onError: (error) => {
            showToast(`Error updating communication tone settings: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
        }
    });

    const onSubmit = async (formData: CommunicationToneFormData) => {
        if (!modelData) return;

        try {
            const toneFactorsData: ModelToneFactorsDTO = {
                modelId: projectId,
                formalVsCasual: formData.formalityCasualityLevel,
                levelOfEnthusiasm: formData.enthusiasmLevel,
                emotionalExpressiveness: formData.emotionalExpressivenessLevel
            };

            await updateToneFactorsMutation.mutateAsync(toneFactorsData);
        } catch (error) {
            console.log('Error submitting form:', error);
        }
    };

    // Helper to get description for a specific level of a dimension
    const getDescription = (dimension: keyof typeof communicationToneDescriptions, level: number): string => {
        return communicationToneDescriptions[dimension][level - 1] || '';
    };

    if (projectId === 0) {
        return <Alert severity="error">Invalid project ID</Alert>;
    }

    if (isLoading) {
        return <Typography sx={{ p: 4, textAlign: 'center' }}>Loading communication tone data...</Typography>;
    }

    if (error) {
        return <Alert severity="error">Error loading communication tone data</Alert>;
    }

    // Sort fields by order property
    const sortedFields = [...communicationToneFields].sort((a, b) =>
        (a.order || 100) - (b.order || 100)
    );

    return (
        <Box sx={{ mx: 'auto', p: 3 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={3}>
                    {updateToneFactorsMutation.isError && (
                        <Alert severity="error">
                            Error updating communication tone settings. Please try again.
                        </Alert>
                    )}

                    <Typography variant="body1" paragraph>
                        Set the communication tone preferences to help the system generate content with the appropriate style and language for your organization.
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
                                orientation={field.type === 'radio' ? field.orientation : 'horizontal'}
                                control={control}
                                errors={errors}
                            >
                            </QuestionWithRating>

                            {/* Display the description for the currently selected level */}
                            {field.fieldName === 'formalityCasualityLevel' && (
                                <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: 'text.secondary' }}>
                                    {getDescription('formality', control._formValues.formalityCasualityLevel)}
                                </Typography>
                            )}
                            {field.fieldName === 'enthusiasmLevel' && (
                                <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: 'text.secondary' }}>
                                    {getDescription('enthusiasm', control._formValues.enthusiasmLevel)}
                                </Typography>
                            )}
                            {field.fieldName === 'emotionalExpressivenessLevel' && (
                                <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: 'text.secondary' }}>
                                    {getDescription('emotionalExpressiveness', control._formValues.emotionalExpressivenessLevel)}
                                </Typography>
                            )}
                        </Paper>
                    ))}

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={!isDirty || updateToneFactorsMutation.isPending}
                            startIcon={<Save />}
                        >
                            Save Communication Tone Settings
                        </Button>
                    </Box>
                </Stack>
            </form>
        </Box>
    );
};

export default CommunicationToneAssessment;