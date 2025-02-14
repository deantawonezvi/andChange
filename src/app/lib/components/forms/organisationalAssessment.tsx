import React from 'react';
import { useParams } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    Alert,
    Box,
    Button,
    FormControl,
    MenuItem,
    Paper,
    Radio,
    RadioGroup,
    Select,
    Stack,
    TextField,
    Tooltip,
    Typography,
    IconButton, FormControlLabel,
} from '@mui/material';
import { HelpCircle, Save } from 'lucide-react';
import { ModelAnagraphicDataDTO, ModelService } from "@/app/lib/api/services/modelService";
import { AdequacyRatingProps, QuestionWithRatingProps, QuestionWithTooltipProps, formFields } from "@/app/lib/api/types";

const QuestionWithTooltip: React.FC<QuestionWithTooltipProps> = ({ label, tooltip, error, required, children }) => (
    <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle1" sx={{ flex: 1, color: error ? 'error.main' : 'text.primary' }}>
                {label}{required && ' *'}
            </Typography>
            <Tooltip title={tooltip}>
                <IconButton size="small">
                    <HelpCircle size={16} />
                </IconButton>
            </Tooltip>
        </Box>
        {children}
        {error && <Typography variant="caption" color="error">{error}</Typography>}
    </Box>
);

const AdequacyRating: React.FC<AdequacyRatingProps> = ({ value, onChange, error }) => (
    <Box sx={{ mt: 2, textAlign: 'center' }}>
        <RadioGroup row value={value} onChange={(e) => onChange(Number(e.target.value))}>
            {[{ label: 'Complete', val: 3 }, { label: 'Adequate', val: 2 }, { label: 'Inadequate', val: 1 }].map(({ label, val }) => (
                <FormControlLabel key={val} value={val} control={<Radio size="small" />} label={label} />
            ))}
        </RadioGroup>
        {error && <Typography variant="caption" color="error">{error}</Typography>}
    </Box>
);

const QuestionWithRating: React.FC<QuestionWithRatingProps> = ({ label, tooltip, control, fieldName, ratingFieldName, required, multiline, errors, children }) => (
    <Paper elevation={1} sx={{ p: 3, mb: 2, display: 'flex', alignItems: 'center', gap: 3 }}>
        <Box sx={{ flex: 1 }}>
            <Controller
                name={fieldName}
                control={control}
                rules={{ required: required ? 'This field is required' : false }}
                render={({ field }) => (
                    <QuestionWithTooltip label={label} tooltip={tooltip} error={errors[fieldName]?.message} required={required}>
                        {children || <TextField {...field} fullWidth multiline={multiline} rows={multiline ? 4 : 1} error={!!errors[fieldName]} />}
                    </QuestionWithTooltip>
                )}
            />
        </Box>
        <Box sx={{ minWidth: '200px', textAlign: 'center' }}>
            <Controller
                name={ratingFieldName}
                control={control}
                rules={{ required: 'Rating is required' }}
                render={({ field }) => (
                    <AdequacyRating value={Number(field.value) ?? 1} onChange={field.onChange} error={errors[ratingFieldName]?.message} />
                )}
            />
        </Box>
    </Paper>
);

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

    return (
        <Box sx={{ maxWidth: 'lg', mx: 'auto', p: 3 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={3}>
                    {mutation.isSuccess && <Alert severity="success">Organization information updated successfully</Alert>}
                    {mutation.isError && <Alert severity="error">Error updating organization information</Alert>}

                    {formFields.map((field) => (
                        <QuestionWithRating key={field.fieldName} {...field} control={control} errors={errors}>
                            {field.type === 'select' && (
                                <FormControl fullWidth error={!!errors[field.fieldName]}>
                                    <Select {...control.register(field.fieldName)}>{field.options.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}</Select>
                                </FormControl>
                            )}
                        </QuestionWithRating>
                    ))}

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                        <Button type="submit" variant="contained" disabled={!isDirty || mutation.isPending} startIcon={<Save />}>Save Organization Information</Button>
                    </Box>
                </Stack>
            </form>
        </Box>
    );
};

export default OrganizationalAssessmentForm;
