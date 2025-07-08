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
import { Control, Controller, FieldErrors, RegisterOptions } from 'react-hook-form';
import { HelpCircle } from 'lucide-react';
import theme from "@/app/lib/theme";

export interface QuestionWithTooltipProps {
    label: string;
    tooltip: string;
    error?: string;
    required?: boolean;
    children: React.ReactNode;
}

export const QuestionWithTooltip: React.FC<QuestionWithTooltipProps> = ({
                                                                            label, tooltip, error, children
                                                                        }) => (
    <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle1" sx={{ flex: 1, color: error ? 'error.main' : 'text.primary', fontWeight: 'bold' }}>
                {label}
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
                    control={<Radio size="small" sx={{
                        '&.Mui-checked': {
                            color: theme.palette.secondary.main,
                        },
                    }}  />}
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
        <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mb: 1,
            px: 2
        }}>
            {(() => {
                const sortedMarks = [...marks].sort((a, b) => a.value - b.value);

                if (sortedMarks.length <= 3) {
                    return sortedMarks;
                }

                const first = sortedMarks[0];
                const last = sortedMarks[sortedMarks.length - 1];
                const middleIndex = Math.floor((sortedMarks.length - 1) / 2);
                const middle = sortedMarks[middleIndex];

                return [first, middle, last];
            })().map((mark, index, array) => (
                <Typography
                    key={mark.value}
                    variant="caption"
                    sx={{
                        fontSize: '0.7rem',
                        maxWidth: '33%',
                        textAlign: index === 0 ? 'left' : index === array.length - 1 ? 'right' : 'center'
                    }}
                >
                    {mark.label}
                </Typography>
            ))}
        </Box>

        <Slider
            value={value === null || value === undefined ? (min ?? 1) : value}
            onChange={(_, newValue) => onChange(newValue as number)}
            min={min}
            max={max}
            step={1}
            marks={marks.map(mark => ({
                ...mark,
                label: ''
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
    description?: string; 
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
    optionDescriptionKey?: string; 
    min?: number;
    max?: number;
    marks?: { value: number; label: string }[];
    errors: FieldErrors<any>;
    children?: React.ReactNode;
    orientation?: 'horizontal' | 'vertical';
    descriptions?: string[];
    validationRules?: any;
}

export interface RadioButtonsProps {
    value: string | number;
    onChange: (value: string | number) => void;
    options: { value: string | number; label: string; description?: string }[];
    orientation?: 'horizontal' | 'vertical';
    error?: string;
    descriptions?: string[]; 
}

export const RadioButtons: React.FC<RadioButtonsProps> = ({
                                                              value, onChange, options, orientation = 'horizontal', error, descriptions
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
            {options.map((option, index) => (
                <Box
                    key={String(option.value)}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        mb: orientation === 'vertical' ? 2 : 0,
                        mr: orientation === 'horizontal' ? 2 : 0
                    }}
                >
                    <FormControlLabel
                        value={option.value}
                        control={<Radio size="medium" sx={{
                            '&.Mui-checked': {
                                color: theme.palette.secondary.main,
                            },
                        }} />}
                        label={
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {option.label}
                            </Typography>
                        }
                        sx={{
                            alignItems: 'flex-start',
                            mb: 0.5
                        }}
                    />
                    {(option.description || (descriptions && descriptions[index])) && (
                        <Box sx={{ ml: 4, mb: 1 }}>
                            <Typography
                                variant="body2"
                                sx={{
                                    fontStyle: 'italic',
                                    color: 'text.secondary',
                                    lineHeight: 1.4,
                                    maxWidth: orientation === 'horizontal' ? '200px' : '100%'
                                }}
                            >
                                {option.description || descriptions?.[index]}
                            </Typography>
                        </Box>
                    )}
                </Box>
            ))}
        </RadioGroup>
        {error && <Typography variant="caption" color="error">{error}</Typography>}
    </Box>
);

export const QuestionWithRating: React.FC<QuestionWithRatingProps> = ({
                                                                          label, tooltip, control, fieldName, ratingFieldName, required,
                                                                          multiline, type, options, optionLabelKey = 'label', optionValueKey = 'value',
                                                                          optionDescriptionKey = 'description', min, max, marks, errors, children,
                                                                          orientation, descriptions, validationRules
                                                                      }) => {
    const useMultiline = type !== 'select' && type !== 'slider' && type !== 'boolean' &&
        type !== 'date' && type !== 'radio' && multiline === true;

    const getValidationRules = (): RegisterOptions => {
        if (type === 'boolean' && required) {
            return {
                validate: (value) => {

                    return value !== null && value !== undefined ? true : 'This field is required'
                }
            };
        }
        return { required: required ? 'This field is required' : false };
    };

    return (
        <Paper elevation={0} sx={{ p: 1, borderRadius: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Controller
                    name={fieldName}
                    control={control}
                    rules={validationRules || getValidationRules()}
                    render={({ field }) => (
                        <QuestionWithTooltip
                            label={label}
                            tooltip={tooltip}
                            error={errors[fieldName]?.message as string}
                            required={required}
                        >
                            {children || (
                                <>
                                    {(!type || type === 'text' || type === 'number') && (
                                        <TextField
                                            {...field}
                                            value={field.value === null ? '' : field.value}
                                            fullWidth
                                            multiline={useMultiline}
                                            rows={useMultiline ? 4 : 1}
                                            error={!!errors[fieldName]}
                                            type={type || 'text'}
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
                                                    ? options.map((opt, index) => {
                                                        if (typeof opt === 'string') {
                                                            return {
                                                                value: opt,
                                                                label: opt,
                                                                description: descriptions?.[index]
                                                            };
                                                        } else if (typeof opt === 'object' && opt !== null) {
                                                            return {
                                                                value: opt[optionValueKey as keyof typeof opt] as string | number,
                                                                label: opt[optionLabelKey as keyof typeof opt] as string,
                                                                description: opt[optionDescriptionKey as keyof typeof opt] as string || descriptions?.[index]
                                                            };
                                                        }
                                                        return { value: '', label: '', description: '' };
                                                    })
                                                    : []
                                            }
                                            orientation={orientation}
                                            error={errors[fieldName]?.message as string}
                                            descriptions={descriptions}
                                        />
                                    )}

                                    {type === 'slider' && (
                                        <SliderRating
                                            value={field.value === null || field.value === undefined ? (min ?? 0) : field.value}
                                            onChange={field.onChange}
                                            min={min ?? 0}
                                            max={max ?? 5}
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