import React from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import { Save } from 'lucide-react';
import { ModelAnagraphicDataDTO, ModelService } from "@/app/lib/api/services/modelService";
import { QuestionWithRating } from "@/app/lib/components/forms/formComponents";
import { organisationInfoFields } from "@/app/lib/components/forms/organisationInfo/types";

const OrganizationalAssessmentForm: React.FC = () => {
    const params = useParams();
    const projectId = typeof params.id === 'string' ? parseInt(params.id) : 0;
    const queryClient = useQueryClient();
    const modelService = ModelService.getInstance();

    const { control, handleSubmit, reset, formState: { errors, isDirty } } = useForm<ModelAnagraphicDataDTO>({
        defaultValues: {
            modelId: projectId,
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
            changeProjectObjectives: '',
            changeProjectObjectivesRating: 1,
            projectAlignmentToOrgValues: '',
            projectAlignmentToOrgValuesRating: 1,
            projectAlignmentToOrgStrategy: '',
            projectAlignmentToOrgStrategyRating: 1,
            isProjectAgile: false,
        }
    });

    const { data: modelData, isLoading, error } = useQuery({
        queryKey: ['model', projectId],
        queryFn: () => modelService.getModelVariables(projectId),
        enabled: projectId > 0,
    });

    const mutation = useMutation({
        mutationFn: (data: ModelAnagraphicDataDTO) => modelService.updateAnagraphicData(data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['model', projectId] })
    });

    React.useEffect(() => {
        if (modelData?.anagraphicData) reset(modelData.anagraphicData);
    }, [modelData, reset]);

    const onSubmit = (data: ModelAnagraphicDataDTO) => mutation.mutate({ ...data, modelId: projectId });

    if (projectId === 0) return <Alert severity="error">Invalid project ID</Alert>;
    if (isLoading) return <Typography sx={{ p: 4, textAlign: 'center' }}>Loading organization data...</Typography>;
    if (error) return <Alert severity="error">Error loading organization data</Alert>;

    // Sort fields by order property
    const sortedFields = [...organisationInfoFields].sort((a, b) =>
        (a.order || 100) - (b.order || 100)
    );

    return (
        <Box sx={{ mx: 'auto', p: 3 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={3}>
                    {mutation.isSuccess && <Alert severity="success">Organization information updated successfully</Alert>}
                    {mutation.isError && <Alert severity="error">Error updating organization information</Alert>}

                    {sortedFields.map((field) => (
                        <QuestionWithRating
                            key={field.fieldName}
                            label={field.label}
                            tooltip={field.tooltip}
                            fieldName={field.fieldName}
                            ratingFieldName={field.ratingFieldName}
                            required={field.required}
                            multiline={field.type !== 'select' && field.type !== 'slider' && field.type !== 'boolean' ? field.multiline : undefined}
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
                            disabled={!isDirty || mutation.isPending}
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