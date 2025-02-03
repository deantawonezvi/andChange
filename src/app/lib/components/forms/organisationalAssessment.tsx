// src/app/lib/components/forms/organisationalAssessment.tsx
import React from 'react';
import {useParams} from 'next/navigation';
import {Controller, useForm} from 'react-hook-form';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {
    Alert,
    Box,
    Button,
    FormControl,
    FormControlLabel,
    FormHelperText,
    FormLabel,
    IconButton,
    InputLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    Stack,
    TextField,
    Tooltip,
} from '@mui/material';
import {HelpCircle, Save} from 'lucide-react';
import {ModelAnagraphicDataDTO, ModelService} from '@/app/lib/api/services/modelService';

const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Manufacturing',
    'Retail',
    'Education',
    'Government',
    'Non-profit',
    'FMCG',
    'Other'
];

const OrganizationalAssessmentForm = () => {
    const params = useParams();
    const projectId = typeof params.id === 'string' ? parseInt(params.id) : 0;

    const queryClient = useQueryClient();
    const modelService = ModelService.getInstance();

    // Fetch model data
    const { data: modelData, isLoading, error } = useQuery({
        queryKey: ['model', projectId],
        queryFn: () => modelService.getModelVariables(projectId),
        enabled: projectId > 0
    });

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isDirty }
    } = useForm<ModelAnagraphicDataDTO>({
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
            isProjectAgile: false
        }
    });

    // Update form when data is loaded
    React.useEffect(() => {
        if (modelData?.anagraphicData) {
            reset(modelData.anagraphicData);
        }
    }, [modelData, reset]);

    // Mutation for updating data
    const mutation = useMutation({
        mutationFn: (data: ModelAnagraphicDataDTO) => modelService.updateAnagraphicData(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['model', projectId] });
        }
    });

    const onSubmit = (data: ModelAnagraphicDataDTO) => {
        mutation.mutate({
            ...data,
            modelId: projectId
        });
    };

    const renderHelpIcon = (tooltip: string) => (
        <Tooltip title={tooltip}>
            <IconButton size="small" sx={{ ml: 1 }}>
                <HelpCircle size={16} />
            </IconButton>
        </Tooltip>
    );

    const renderRatingGroup = (
        name: keyof ModelAnagraphicDataDTO & string,
        label: string
    ) => (
        <Controller
            name={name as never}
            control={control}
            rules={{ required: 'Please select a rating' }}
            render={({ field }) => (
                <FormControl component="fieldset" error={!!errors[name]}>
                    <FormLabel component="legend">{label}</FormLabel>
                    <RadioGroup
                        row
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        value={field.value}
                    >
                        <FormControlLabel value="3" control={<Radio />} label="Complete" />
                        <FormControlLabel value="2" control={<Radio />} label="Adequate" />
                        <FormControlLabel value="1" control={<Radio />} label="Inadequate" />
                    </RadioGroup>
                    {errors[name] && (
                        <FormHelperText>{errors[name]?.message}</FormHelperText>
                    )}
                </FormControl>
            )}
        />
    );

    if (projectId === 0) {
        return <Alert severity="error">Invalid project ID</Alert>;
    }

    if (isLoading) {
        return <div>Loading organization data...</div>;
    }

    if (error) {
        return <Alert severity="error">Error loading organization data</Alert>;
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
                {mutation.isSuccess && (
                    <Alert severity="success">
                        Organization information updated successfully
                    </Alert>
                )}

                {mutation.isError && (
                    <Alert severity="error">
                        Error updating organization information
                    </Alert>
                )}

                {/* Organization Name */}
                <Box>
                    <Controller
                        name="organizationName"
                        control={control}
                        rules={{ required: 'Organization name is required' }}
                        render={({ field }) => (
                            <FormControl fullWidth error={!!errors.organizationName}>
                                <InputLabel>Organization Name</InputLabel>
                                <TextField
                                    {...field}
                                    label="Organization Name"
                                    error={!!errors.organizationName}
                                    helperText={errors.organizationName?.message}
                                    InputProps={{
                                        endAdornment: renderHelpIcon('Enter the full legal name of your organization')
                                    }}
                                />
                            </FormControl>
                        )}
                    />
                    {renderRatingGroup('organizationNameRating', 'Organization Name Quality')}
                </Box>

                {/* Industry */}
                <Box>
                    <Controller
                        name="industry"
                        control={control}
                        rules={{ required: 'Industry is required' }}
                        render={({ field }) => (
                            <FormControl fullWidth error={!!errors.industry}>
                                <InputLabel>Industry</InputLabel>
                                <Select
                                    {...field}
                                    label="Industry"
                                >
                                    {industries.map((industry) => (
                                        <MenuItem key={industry} value={industry}>
                                            {industry}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.industry && (
                                    <FormHelperText>{errors.industry.message}</FormHelperText>
                                )}
                            </FormControl>
                        )}
                    />
                    {renderRatingGroup('industryRating', 'Industry Classification Quality')}
                </Box>

                {/* Organization Values */}
                <Box>
                    <Controller
                        name="organizationValues"
                        control={control}
                        rules={{ required: 'Organization values are required' }}
                        render={({ field }) => (
                            <FormControl fullWidth error={!!errors.organizationValues}>
                                <TextField
                                    {...field}
                                    label="Organization Values"
                                    multiline
                                    rows={4}
                                    error={!!errors.organizationValues}
                                    helperText={errors.organizationValues?.message}
                                    InputProps={{
                                        endAdornment: renderHelpIcon('List the core values of your organization')
                                    }}
                                />
                            </FormControl>
                        )}
                    />
                    {renderRatingGroup('organizationValuesRating', 'Values Description Quality')}
                </Box>

                {/* Definition of Success */}
                <Box>
                    <Controller
                        name="definitionOfSuccess"
                        control={control}
                        rules={{ required: 'Definition of success is required' }}
                        render={({ field }) => (
                            <FormControl fullWidth error={!!errors.definitionOfSuccess}>
                                <TextField
                                    {...field}
                                    label="Definition of Success"
                                    multiline
                                    rows={4}
                                    error={!!errors.definitionOfSuccess}
                                    helperText={errors.definitionOfSuccess?.message}
                                    InputProps={{
                                        endAdornment: renderHelpIcon('Describe what success looks like for this organization')
                                    }}
                                />
                            </FormControl>
                        )}
                    />
                    {renderRatingGroup('definitionOfSuccessRating', 'Success Definition Quality')}
                </Box>

                {/* Organization Benefits */}
                <Box>
                    <Controller
                        name="organizationBenefits"
                        control={control}
                        rules={{ required: 'Organization benefits are required' }}
                        render={({ field }) => (
                            <FormControl fullWidth error={!!errors.organizationBenefits}>
                                <TextField
                                    {...field}
                                    label="Organization Benefits"
                                    multiline
                                    rows={4}
                                    error={!!errors.organizationBenefits}
                                    helperText={errors.organizationBenefits?.message}
                                    InputProps={{
                                        endAdornment: renderHelpIcon('Describe the benefits this change will bring to the organization')
                                    }}
                                />
                            </FormControl>
                        )}
                    />
                    {renderRatingGroup('organizationBenefitsRating', 'Benefits Description Quality')}
                </Box>

                {/* Submit Button */}
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
    );
};

export default OrganizationalAssessmentForm;