import React from 'react';
import {
    Box,
    FormControl,
    FormControlLabel,
    IconButton,
    MenuItem,
    Paper,
    Radio,
    RadioGroup,
    Select,
    Slider,
    Switch,
    TextField,
    Tooltip,
    Typography
} from '@mui/material';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { HelpCircle } from 'lucide-react';
import { CustomDatePicker } from "@/app/lib/components/common/datePicker";

export interface QuestionWithTooltipProps {
    label: string;
    tooltip: string;
    error?: string;
    required?: boolean;
    children: React.ReactNode;
}

export const QuestionWithTooltip: React.FC<QuestionWithTooltipProps> = ({
                                                                            label, tooltip, error, required, children
                                                                        }) => (
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

export interface AdequacyRatingProps {
    value: number;
    onChange: (value: number) => void;
    error?: string;
}

export const AdequacyRating: React.FC<AdequacyRatingProps> = ({ value, onChange, error }) => (
    <Box>
        <RadioGroup
            row
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
        >
            {['Inadequate', 'Adequate', 'Complete'].map((label, idx) => (
                <FormControlLabel
                    key={idx + 1}
                    value={idx + 1}
                    control={<Radio size="small" />}
                    label={label}
                    sx={{ mr: 1 }}
                />
            ))}
        </RadioGroup>
        {error && <Typography variant="caption" color="error">{error}</Typography>}
    </Box>
);

export interface SliderRatingProps {
    value: number;
    onChange: (value: number) => void;
    min: number;
    max: number;
    marks: { value: number; label: string }[];
    error?: string;
}

export const SliderRating: React.FC<SliderRatingProps> = ({
                                                              value, onChange, min, max, marks, error
                                                          }) => (
    <Box sx={{ mt: 2, px: 2 }}>
        {/* Display the marks as a legend above the slider for better readability */}
        <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mb: 1,
            px: 2 // Add padding to align with the slider ends
        }}>
            {marks.filter(mark => [min, Math.floor((min+max)/2), max].includes(mark.value)).map((mark) => (
                <Typography
                    key={mark.value}
                    variant="caption"
                    sx={{
                        fontSize: '0.7rem',
                        maxWidth: mark.value === min ? '33%' : mark.value === max ? '33%' : '34%',
                        textAlign: mark.value === min ? 'left' : mark.value === max ? 'right' : 'center'
                    }}
                >
                    {mark.label}
                </Typography>
            ))}
        </Box>

        <Slider
            value={value === null ? (min || 1) : value}
            onChange={(_, newValue) => onChange(newValue as number)}
            min={min}
            max={max}
            step={1}
            marks={marks.map(mark => ({
                ...mark,
                label: '' // Remove labels from the actual slider component
            }))}
            valueLabelDisplay="auto"
        />
        {error && <Typography variant="caption" color="error">{error}</Typography>}
    </Box>
);

export interface BooleanToggleProps {
    value: boolean;
    onChange: (value: boolean) => void;
    label?: string;
    error?: string;
}

export const BooleanToggle: React.FC<BooleanToggleProps> = ({
                                                                value, onChange, label, error
                                                            }) => (
    <Box>
        <FormControlLabel
            control={
                <Switch
                    checked={value}
                    onChange={(e) => onChange(e.target.checked)}
                />
            }
            label={label || ''}
        />
        {error && <Typography variant="caption" color="error">{error}</Typography>}
    </Box>
);

export interface SelectOption {
    value: string | number;
    label: string;
}

export interface QuestionWithRatingProps {
    label: string;
    tooltip: string;
    control: Control<any>;
    fieldName: string;
    ratingFieldName?: string;
    required?: boolean;
    multiline?: boolean;
    type?: string;
    options?: string[] | SelectOption[];
    optionLabelKey?: string;
    optionValueKey?: string;
    min?: number;
    max?: number;
    marks?: { value: number; label: string }[];
    errors: FieldErrors<any>;
    children?: React.ReactNode;
    orientation?: 'horizontal' | 'vertical';
}

export interface RadioButtonsProps {
    value: string | number;
    onChange: (value: string | number) => void;
    options: { value: string | number; label: string }[];
    orientation?: 'horizontal' | 'vertical';
    error?: string;
}

export const RadioButtons: React.FC<RadioButtonsProps> = ({
                                                              value, onChange, options, orientation = 'horizontal', error
                                                          }) => (
    <Box>
        <RadioGroup
            row={orientation === 'horizontal'}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            sx={{
                display: 'flex',
                flexDirection: orientation === 'vertical' ? 'column' : 'row',
                gap: orientation === 'vertical' ? 1 : 2
            }}
        >
            {options.map((option) => (
                <FormControlLabel
                    key={String(option.value)}
                    value={option.value}
                    control={<Radio size="small" />}
                    label={
                        <Typography variant="body2">
                            {option.label}
                        </Typography>
                    }
                    sx={{
                        mr: orientation === 'horizontal' ? 2 : 0,
                        alignItems: 'flex-start',
                        '.MuiFormControlLabel-label': {
                            pt: 0.5 // Align label with radio button
                        }
                    }}
                />
            ))}
        </RadioGroup>
        {error && <Typography variant="caption" color="error">{error}</Typography>}
    </Box>
);

export const QuestionWithRating: React.FC<QuestionWithRatingProps> = ({
                                                                          label, tooltip, control, fieldName, ratingFieldName, required,
                                                                          multiline, type, options, optionLabelKey = 'label', optionValueKey = 'value',
                                                                          min, max, marks, errors, children, orientation
                                                                      }) => {
    // Determine if multiline should be used based on field type
    const useMultiline = type !== 'select' && type !== 'slider' && type !== 'boolean' &&
        type !== 'date' && type !== 'radio' && multiline === true;

    return (
        <Paper elevation={0} sx={{ p: 1, borderRadius: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Controller
                    name={fieldName}
                    control={control}
                    rules={{ required: required ? 'This field is required' : false }}
                    render={({ field }) => (
                        <QuestionWithTooltip
                            label={label}
                            tooltip={tooltip}
                            error={errors[fieldName]?.message as string}
                            required={required}
                        >
                            {children || (
                                <>
                                    {(!type || type === 'text') && (
                                        <TextField
                                            {...field}
                                            value={field.value === null ? '' : field.value}
                                            fullWidth
                                            multiline={useMultiline}
                                            rows={useMultiline ? 4 : 1}
                                            error={!!errors[fieldName]}
                                        />
                                    )}

                                    {type === 'date' && (
                                        <TextField
                                            {...field}
                                            value={field.value === null ? '' : field.value}
                                            fullWidth
                                            multiline={useMultiline}
                                            type="date"
                                            rows={useMultiline ? 4 : 1}
                                            error={!!errors[fieldName]}
                                        />
                                    )}

                                    {type === 'select' && options && (
                                        <FormControl fullWidth error={!!errors[fieldName]}>
                                            <Select
                                                {...field}
                                                value={field.value === null ? '' : field.value}
                                            >
                                                {options.map((option) => {
                                                    if (typeof option === 'string') {
                                                        return (
                                                            <MenuItem key={option} value={option}>
                                                                {option}
                                                            </MenuItem>
                                                        );
                                                    } else {
                                                        const value = option[optionValueKey as keyof typeof option];
                                                        const label = option[optionLabelKey as keyof typeof option];
                                                        return (
                                                            <MenuItem key={String(value)} value={value}>
                                                                {label}
                                                            </MenuItem>
                                                        );
                                                    }
                                                })}
                                            </Select>
                                        </FormControl>
                                    )}

                                    {type === 'radio' && options && (
                                        <RadioButtons
                                            value={field.value === null ? '' : field.value}
                                            onChange={field.onChange}
                                            options={
                                                Array.isArray(options)
                                                    ? options.map((opt) => {
                                                        if (typeof opt === 'string') {
                                                            return { value: opt, label: opt };
                                                        } else if (typeof opt === 'object' && opt !== null) {
                                                            return {
                                                                value: opt[optionValueKey as keyof typeof opt] as string | number,
                                                                label: opt[optionLabelKey as keyof typeof opt] as string
                                                            };
                                                        }
                                                        return { value: '', label: '' };
                                                    })
                                                    : []
                                            }
                                            orientation={orientation}
                                            error={errors[fieldName]?.message as string}
                                        />
                                    )}

                                    {type === 'slider' && (
                                        <SliderRating
                                            value={field.value === null ? (min || 1) : field.value}
                                            onChange={field.onChange}
                                            min={min || 1}
                                            max={max || 5}
                                            marks={marks || []}
                                            error={errors[fieldName]?.message as string}
                                        />
                                    )}

                                    {type === 'boolean' && (
                                        <BooleanToggle
                                            value={field.value === null ? false : field.value}
                                            onChange={field.onChange}
                                            error={errors[fieldName]?.message as string}
                                        />
                                    )}
                                </>
                            )}
                        </QuestionWithTooltip>
                    )}
                />

                {/* Only show AdequacyRating if ratingFieldName exists */}
                {ratingFieldName && (
                    <Box>
                        <Controller
                            name={ratingFieldName}
                            control={control}
                            rules={{ required: 'Rating is required' }}
                            render={({ field }) => (
                                <AdequacyRating
                                    value={field.value === null ? 1 : Number(field.value)}
                                    onChange={field.onChange}
                                    error={errors[ratingFieldName]?.message as string}
                                />
                            )}
                        />
                    </Box>
                )}
            </Box>
        </Paper>
    );
};