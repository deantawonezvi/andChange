import React from 'react';
import {
    Box,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    FormControlLabel,
    Radio,
    RadioGroup,
    FormLabel,
    FormHelperText,
    Paper,
    Typography,
    IconButton,
    Tooltip
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { HelpCircle } from 'lucide-react';

interface OrganizationalAssessmentForm {
    organizationName: string;
    industry: string;
    definitionOfSuccess: string;
    definitionOfSuccessRating: number;
    organizationBenefits: string;
    organizationBenefitsRating: number;
}

const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Manufacturing',
    'Retail',
    'Education',
    'Government',
    'Non-profit',
    'Other'
];

const OrganizationalAssessmentForm = () => {
    const { control, formState: { errors } } = useForm<OrganizationalAssessmentForm>({
        defaultValues: {
            organizationName: '',
            industry: '',
            definitionOfSuccess: '',
            definitionOfSuccessRating: 0,
            organizationBenefits: '',
            organizationBenefitsRating: 0
        }
    });

    const renderHelpIcon = (tooltip: string) => (
        <Tooltip title={tooltip}>
            <IconButton size="small" sx={{ ml: 1 }}>
                <HelpCircle size={16} />
            </IconButton>
        </Tooltip>
    );

    const renderRatingGroup = (
        name: 'definitionOfSuccessRating' | 'organizationBenefitsRating',
        label: string
    ) => (
        <Controller
            name={name}
            control={control}
            rules={{ required: 'Please select a rating' }}
            render={({ field }) => (
                <FormControl component="fieldset" error={!!errors[name]}>
                    <FormLabel component="legend">{label}</FormLabel>
                    <RadioGroup
                        row
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                    >
                        <FormControlLabel value={3} control={<Radio />} label="Complete" />
                        <FormControlLabel value={2} control={<Radio />} label="Adequate" />
                        <FormControlLabel value={1} control={<Radio />} label="Inadequate" />
                    </RadioGroup>
                    {errors[name] && (
                        <FormHelperText>{errors[name]?.message}</FormHelperText>
                    )}
                </FormControl>
            )}
        />
    );

    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Organization Name */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Controller
                        name="organizationName"
                        control={control}
                        rules={{ required: 'Organization name is required' }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Name of the Organisation"
                                fullWidth
                                error={!!errors.organizationName}
                                helperText={errors.organizationName?.message}
                            />
                        )}
                    />
                    {renderHelpIcon('Enter the full legal name of your organization')}
                </Box>

                {/* Industry */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Controller
                        name="industry"
                        control={control}
                        rules={{ required: 'Industry is required' }}
                        render={({ field }) => (
                            <FormControl fullWidth error={!!errors.industry}>
                                <InputLabel>Industry</InputLabel>
                                <Select {...field} label="Industry">
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
                    {renderHelpIcon('Select the primary industry of your organization')}
                </Box>

                {/* Definition of Success */}
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Controller
                            name="definitionOfSuccess"
                            control={control}
                            rules={{ required: 'Definition of success is required' }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="The Definition of Success"
                                    fullWidth
                                    multiline
                                    rows={4}
                                    error={!!errors.definitionOfSuccess}
                                    helperText={errors.definitionOfSuccess?.message}
                                />
                            )}
                        />
                        {renderHelpIcon('Describe what success looks like for your organization')}
                    </Box>
                    {renderRatingGroup('definitionOfSuccessRating', 'Definition Quality')}
                </Box>

                {/* Organizational Benefits */}
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Controller
                            name="organizationBenefits"
                            control={control}
                            rules={{ required: 'Organizational benefits are required' }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="The Organisational Benefits of the Change"
                                    fullWidth
                                    multiline
                                    rows={4}
                                    error={!!errors.organizationBenefits}
                                    helperText={errors.organizationBenefits?.message}
                                />
                            )}
                        />
                        {renderHelpIcon('Describe the benefits this change will bring to your organization')}
                    </Box>
                    {renderRatingGroup('organizationBenefitsRating', 'Benefits Description Quality')}
                </Box>
            </Box>
        </>
    );
};

export default OrganizationalAssessmentForm;