import React, {useState} from 'react';
import {
    Box,
    Button,
    FormControl,
    FormControlLabel,
    FormHelperText,
    FormLabel,
    IconButton,
    Radio,
    RadioGroup,
    Slider,
    TextField,
    Tooltip,
    Typography
} from '@mui/material';
import {Controller, useForm} from 'react-hook-form';
import {HelpCircle, Upload} from 'lucide-react';

interface ProjectInformationForm {
    projectCharter?: File;
    changeProjectName: string;
    changeProjectObjectives: string;
    changeProjectObjectivesRating: number;
    projectAlignmentToOrgValues: string;
    projectAlignmentToOrgValuesRating: number;
    whyNowValueStatement: string;
    whyNowValueStatementRating: number;
    ifNotValueStatement: string;
    ifNotValueStatementRating: number;
    projectAlignmentToOrgStrategy: string;
    projectAlignmentToOrgStrategyRating: number;
    sufficiencyOfBudget: number;
}

const marks = [
    { value: 1, label: 'Not aligned to' },
    { value: 3, label: 'Somewhat aligned to' },
    { value: 5, label: 'Highly aligned to' }
];

const ProjectInformationForm = () => {
    const [file, setFile] = useState<File | null>(null);
    const { control, formState: { errors } } = useForm<ProjectInformationForm>({
        defaultValues: {
            changeProjectName: '',
            changeProjectObjectives: '',
            changeProjectObjectivesRating: 0,
            projectAlignmentToOrgValues: '',
            projectAlignmentToOrgValuesRating: 0,
            whyNowValueStatement: '',
            whyNowValueStatementRating: 0,
            ifNotValueStatement: '',
            ifNotValueStatementRating: 0,
            projectAlignmentToOrgStrategy: '',
            projectAlignmentToOrgStrategyRating: 0,
            sufficiencyOfBudget: 3,
        }
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
        }
    };

    const renderHelpIcon = (tooltip: string) => (
        <Tooltip title={tooltip}>
            <IconButton size="small" sx={{ ml: 1 }}>
                <HelpCircle size={16} />
            </IconButton>
        </Tooltip>
    );

    const renderRatingGroup = (
        name: keyof ProjectInformationForm & string,
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
                {/* Project Charter Upload */}
                <Box>
                    <FormLabel>1. If there is a project charter or similar document, please upload it to answer some of the questions for you?</FormLabel>
                    <Box sx={{ mt: 1 }}>
                        <Button
                            variant="outlined"
                            component="label"
                            startIcon={<Upload />}
                        >
                            Choose file
                            <input
                                type="file"
                                hidden
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx"
                            />
                        </Button>
                        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                            {file ? file.name : 'No file chosen'}
                        </Typography>
                    </Box>
                </Box>

                {/* Project Name */}
                <Box>
                    <FormLabel>2. Project Name</FormLabel>
                    <Controller
                        name="changeProjectName"
                        control={control}
                        rules={{ required: 'Project name is required' }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                error={!!errors.changeProjectName}
                                helperText={errors.changeProjectName?.message}
                                sx={{ mt: 1 }}
                            />
                        )}
                    />
                </Box>

                {/* Project Objectives */}
                <Box>
                    <FormLabel>3. What are the specific Project Objectives?</FormLabel>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <Controller
                            name="changeProjectObjectives"
                            control={control}
                            rules={{ required: 'Project objectives are required' }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    multiline
                                    rows={4}
                                    error={!!errors.changeProjectObjectives}
                                    helperText={errors.changeProjectObjectives?.message}
                                />
                            )}
                        />
                        {renderRatingGroup('changeProjectObjectivesRating', '')}
                    </Box>
                </Box>

                {/* Organizational Values Alignment */}
                <Box>
                    <FormLabel>4. How does the project fit in with the organisational values?</FormLabel>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <Controller
                            name="projectAlignmentToOrgValues"
                            control={control}
                            rules={{ required: 'This field is required' }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    multiline
                                    rows={4}
                                    error={!!errors.projectAlignmentToOrgValues}
                                    helperText={errors.projectAlignmentToOrgValues?.message}
                                />
                            )}
                        />
                        {renderRatingGroup('projectAlignmentToOrgValuesRating', '')}
                    </Box>
                </Box>

                {/* Why Now */}
                <Box>
                    <FormLabel>5. Why is the change happening now?</FormLabel>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <Controller
                            name="whyNowValueStatement"
                            control={control}
                            rules={{ required: 'This field is required' }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    multiline
                                    rows={4}
                                    error={!!errors.whyNowValueStatement}
                                    helperText={errors.whyNowValueStatement?.message}
                                />
                            )}
                        />
                        {renderRatingGroup('whyNowValueStatementRating', '')}
                    </Box>
                </Box>

                {/* Consequences of Not Changing */}
                <Box>
                    <FormLabel>6. What are the consequences of not changing?</FormLabel>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <Controller
                            name="ifNotValueStatement"
                            control={control}
                            rules={{ required: 'This field is required' }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    multiline
                                    rows={4}
                                    error={!!errors.ifNotValueStatement}
                                    helperText={errors.ifNotValueStatement?.message}
                                />
                            )}
                        />
                        {renderRatingGroup('ifNotValueStatementRating', '')}
                    </Box>
                </Box>

                {/* Strategy Alignment */}
                <Box>
                    <FormLabel>7. How does the project align with the organisation&#39;s strategy?</FormLabel>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <Controller
                            name="projectAlignmentToOrgStrategy"
                            control={control}
                            rules={{ required: 'This field is required' }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    multiline
                                    rows={4}
                                    error={!!errors.projectAlignmentToOrgStrategy}
                                    helperText={errors.projectAlignmentToOrgStrategy?.message}
                                />
                            )}
                        />
                        {renderRatingGroup('projectAlignmentToOrgStrategyRating', '')}
                    </Box>
                </Box>

                {/* Budget Sufficiency */}
                <Box>
                    <FormLabel>
                        8. Sufficiency of budget allocated to building adoption and usage of the change.
                        {renderHelpIcon('Rate how sufficient the allocated budget is')}
                    </FormLabel>
                    <Box sx={{ px: 2, mt: 3 }}>
                        <Controller
                            name="sufficiencyOfBudget"
                            control={control}
                            render={({ field }) => (
                                <Slider
                                    {...field}
                                    min={1}
                                    max={5}
                                    step={1}
                                    marks={marks}
                                    valueLabelDisplay="auto"
                                />
                            )}
                        />
                    </Box>
                </Box>
            </Box>
        </>
    );
};

export default ProjectInformationForm;