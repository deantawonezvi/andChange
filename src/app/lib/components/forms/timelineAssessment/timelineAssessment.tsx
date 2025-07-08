import React, { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert, Box, Button, Divider, Grid, Paper, Stack, Typography } from '@mui/material';
import { Save } from 'lucide-react';
import {
    ModelChangeCharacteristicsDTO,
    ModelService,
    ModelTimelineAssessmentDTO,
    ModelVariablesDTO
} from "@/app/lib/api/services/modelService";
import { QuestionWithRating } from "@/app/lib/components/forms/formComponents";
import { useToast } from '@/app/lib/hooks/useToast';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import { format, isValid, isAfter, parseISO } from 'date-fns';
import { timelineFields } from "@/app/lib/components/forms/timelineAssessment/types";

interface TimelineFormData {
    kickoff: string;
    designDefined: string;
    develop: string;
    test: string;
    deploy: string;
    outcomes: string;
    releases: string;
    impactedGroupPeopleMilestones: string;
    entryPointOfCM: string;
    timeframeAdequacyForChange: number;
    isProjectAgile: boolean;
}


const CHRONOLOGICAL_ORDER = [
    'kickoff',
    'designDefined',
    'develop',
    'test',
    'deploy',
    'outcomes',
    'releases'
];

const TimelineAssessment: React.FC = () => {
    const params = useParams();
    const projectId = typeof params.id === 'string' ? parseInt(params.id) : 0;
    const queryClient = useQueryClient();
    const modelService = ModelService.getInstance();
    const { showToast } = useToast();

    const { control, handleSubmit, reset, watch, formState: { errors, isDirty } } = useForm<TimelineFormData>({
        defaultValues: {
            kickoff: '',
            designDefined: '',
            develop: '',
            test: '',
            deploy: '',
            outcomes: '',
            releases: '',
            impactedGroupPeopleMilestones: '',
            entryPointOfCM: '',
            timeframeAdequacyForChange: 3,
            isProjectAgile: false
        }
    });

    
    const watchedValues = watch();

    const { data: modelData, isLoading, error } = useQuery({
        queryKey: ['model', projectId],
        queryFn: () => modelService.getModelVariables(projectId),
        enabled: projectId > 0,
    });

    
    const getDateValidationRules = (fieldName: string) => {
        return {
            required: timelineFields.find(f => f.fieldName === fieldName)?.required ?
                `${timelineFields.find(f => f.fieldName === fieldName)?.label} is required` : false,
            validate: (value: string) => {
                if (!value) return true; 

                
                const currentDate = parseISO(value);
                if (!isValid(currentDate)) {
                    return 'Please enter a valid date';
                }

                
                const currentIndex = CHRONOLOGICAL_ORDER.indexOf(fieldName);

                
                if (currentIndex > 0) {
                    const previousField = CHRONOLOGICAL_ORDER[currentIndex - 1];
                    const previousValue = watchedValues[previousField as keyof TimelineFormData] as string;

                    if (previousValue) {
                        const previousDate = parseISO(previousValue);
                        if (isValid(previousDate) && isAfter(previousDate, currentDate)) {
                            const previousLabel = timelineFields.find(f => f.fieldName === previousField)?.label || previousField;
                            const currentLabel = timelineFields.find(f => f.fieldName === fieldName)?.label || fieldName;
                            return `${currentLabel} cannot be before ${previousLabel}`;
                        }
                    }
                }

                
                if (fieldName === 'entryPointOfCM') {
                    const kickoffValue = watchedValues.kickoff;
                    if (kickoffValue) {
                        const kickoffDate = parseISO(kickoffValue);
                        if (isValid(kickoffDate) && isAfter(currentDate, kickoffDate)) {
                            return 'Change Management entry point should be before or at the same time as project kickoff';
                        }
                    }
                }

                return true;
            }
        };
    };

    const mapModelToFormData = (model: ModelVariablesDTO): TimelineFormData => {
        const formatDateForForm = (dateString: string | null | undefined): string => {
            if (!dateString) return '';

            try {
                const date = new Date(dateString);
                if (isValid(date)) {
                    return date.toISOString().split('T')[0]; 
                }
            } catch (e) {
                console.error('Error parsing date:', dateString, e);
            }
            return '';
        };

        return {
            kickoff: formatDateForForm(model.timelineAssessment?.kickoff),
            designDefined: formatDateForForm(model.timelineAssessment?.designDefined),
            develop: formatDateForForm(model.timelineAssessment?.develop),
            test: formatDateForForm(model.timelineAssessment?.test),
            deploy: formatDateForForm(model.timelineAssessment?.deploy),
            outcomes: formatDateForForm(model.timelineAssessment?.outcomes),
            releases: formatDateForForm(model.timelineAssessment?.releases),
            impactedGroupPeopleMilestones: formatDateForForm(model.timelineAssessment?.impactedGroupPeopleMilestones),
            entryPointOfCM: formatDateForForm(model.changeCharacteristics?.entryPointOfCM),
            timeframeAdequacyForChange: model.changeCharacteristics?.timeframeAdequacyForChange || 3,
            isProjectAgile: model.anagraphicData?.isProjectAgile || false
        };
    };

    React.useEffect(() => {
        if (modelData) {
            const formData = mapModelToFormData(modelData);
            console.log("Form data being set:", formData);
            reset(formData);
        }
    }, [modelData, reset]);

    const updateTimelineAssessmentMutation = useMutation({
        mutationFn: (data: ModelTimelineAssessmentDTO) => modelService.updateTimelineAssessment(data),
        onSuccess: () => {
            showToast('Timeline assessment updated successfully', 'success');
            queryClient.invalidateQueries({ queryKey: ['model', projectId] });
        },
        onError: (error) => {
            showToast(`Error updating timeline assessment: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
        }
    });

    const updateChangeCharacteristicsMutation = useMutation({
        mutationFn: (data: ModelChangeCharacteristicsDTO) => modelService.updateChangeCharacteristics(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['model', projectId] });
        },
        onError: (error) => {
            showToast(`Error updating change characteristics: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
        }
    });

    const updateAnagraphicDataMutation = useMutation({
        mutationFn: (data: any) => modelService.updateAnagraphicData(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['model', projectId] });
        },
        onError: (error) => {
            showToast(`Error updating project information: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
        }
    });

    const timelineEvents = useMemo(() => {
        if (!modelData) return [];

        const events = [
            { id: 'kickoff', name: 'Kick-Off', date: modelData.timelineAssessment?.kickoff, color: 'primary.main' },
            { id: 'designDefined', name: 'Design', date: modelData.timelineAssessment?.designDefined, color: 'info.main' },
            { id: 'develop', name: 'Development', date: modelData.timelineAssessment?.develop, color: 'warning.light' },
            { id: 'test', name: 'Testing', date: modelData.timelineAssessment?.test, color: 'secondary.main' },
            { id: 'deploy', name: 'Deployment', date: modelData.timelineAssessment?.deploy, color: 'success.main' },
            { id: 'outcomes', name: 'Outcomes', date: modelData.timelineAssessment?.outcomes, color: 'primary.dark' },
            { id: 'releases', name: 'Release Start', date: modelData.timelineAssessment?.releases, color: 'error.light' },
            { id: 'entryPointOfCM', name: 'CM Entry Point', date: modelData.changeCharacteristics?.entryPointOfCM, color: 'secondary.dark' },
        ];

        return events
            .filter(event => !!event.date)
            .sort((a, b) => {
                if (!a.date) return 1;
                if (!b.date) return -1;
                return new Date(a.date).getTime() - new Date(b.date).getTime();
            });
    }, [modelData]);

    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return isValid(date) ? format(date, 'MMM d, yyyy') : '';
    };

    const onSubmit = async (formData: TimelineFormData) => {
        if (!modelData) return;

        try {
            const timelineData: ModelTimelineAssessmentDTO = {
                modelId: projectId,
                kickoff: formData.kickoff,
                designDefined: formData.designDefined,
                develop: formData.develop,
                test: formData.test,
                deploy: formData.deploy,
                outcomes: formData.outcomes,
                releases: formData.releases,
                impactedGroupPeopleMilestones: formData.impactedGroupPeopleMilestones
            };
            await updateTimelineAssessmentMutation.mutateAsync(timelineData);

            const changeCharacteristicsData: ModelChangeCharacteristicsDTO = {
                modelId: projectId,
                entryPointOfCM: formData.entryPointOfCM,
                timeframeAdequacyForChange: formData.timeframeAdequacyForChange,
                scopeOfChange: modelData.changeCharacteristics?.scopeOfChange || 1,
                amountOfOverallChange: modelData.changeCharacteristics?.amountOfOverallChange || 1,
                degreeOfConfidentialityRequired: modelData.changeCharacteristics?.degreeOfConfidentialityRequired || 1,
                degreeOfExternalStakeholderImpact: modelData.changeCharacteristics?.degreeOfExternalStakeholderImpact || 1
            };
            await updateChangeCharacteristicsMutation.mutateAsync(changeCharacteristicsData);

            if (modelData.anagraphicData) {
                const anagraphicData = {
                    ...modelData.anagraphicData,
                    modelId: projectId,
                    isProjectAgile: formData.isProjectAgile
                };
                await updateAnagraphicDataMutation.mutateAsync(anagraphicData);
            }

            showToast('Timeline information updated successfully', 'success');
        } catch (error) {
            console.log('Error submitting form:', error);
            showToast('An error occurred while saving timeline information', 'error');
        }
    };

    if (projectId === 0) {
        return <Alert severity="error">Invalid project ID</Alert>;
    }

    if (isLoading) {
        return <Typography sx={{ p: 4, textAlign: 'center' }}>Loading timeline data...</Typography>;
    }

    if (error) {
        return <Alert severity="error">Error loading timeline data</Alert>;
    }

    const sortedFields = [...timelineFields].sort((a, b) =>
        (a.order || 100) - (b.order || 100)
    );

    
    const hasValidationErrors = Object.keys(errors).length > 0;

    return (
        <Box sx={{ mx: 'auto' }}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={3}>
                    {(updateTimelineAssessmentMutation.isError ||
                        updateChangeCharacteristicsMutation.isError ||
                        updateAnagraphicDataMutation.isError) && (
                        <Alert severity="error">
                            Error updating timeline information. Please try again.
                        </Alert>
                    )}

                    {hasValidationErrors && (
                        <Alert severity="warning">
                            Please ensure all dates follow the correct chronological order.
                        </Alert>
                    )}

                    {/* Visual Timeline Display */}
                    {timelineEvents.length > 0 && (
                        <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" gutterBottom>Project Timeline Visualization</Typography>
                            <Box sx={{
                                maxWidth: '100%',
                                overflowX: 'auto',
                                '&::-webkit-scrollbar': {
                                    height: '8px',
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    backgroundColor: 'rgba(0,0,0,0.2)',
                                    borderRadius: '4px',
                                },
                            }}>
                                <Timeline position="right" sx={{ minWidth: timelineEvents.length * 25 }}>
                                    {timelineEvents.map((event, index) => (
                                        <TimelineItem key={event.id}>
                                            <TimelineOppositeContent color="text.secondary">
                                                {formatDate(event.date)}
                                            </TimelineOppositeContent>
                                            <TimelineSeparator>
                                                <TimelineDot sx={{ bgcolor: event.color }} />
                                                {index < timelineEvents.length - 1 && <TimelineConnector />}
                                            </TimelineSeparator>
                                            <TimelineContent>
                                                <Paper elevation={2} sx={{ p: 2, bgcolor: 'background.paper' }}>
                                                    <Typography variant="h6" component="span">
                                                        {event.name}
                                                    </Typography>
                                                </Paper>
                                            </TimelineContent>
                                        </TimelineItem>
                                    ))}
                                </Timeline>
                            </Box>
                        </Paper>
                    )}

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h6" gutterBottom>Timeline Milestones</Typography>
                    <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
                        <Grid container spacing={3}>
                            {sortedFields.map((field) => (
                                <Grid item xs={12} md={6} key={field.fieldName}>
                                    <QuestionWithRating
                                        label={field.label}
                                        tooltip={field.tooltip}
                                        fieldName={field.fieldName}
                                        required={field.required}
                                        type={field.type}
                                        control={control}
                                        errors={errors}
                                        marks={field.type === 'slider' ? field.marks : undefined}
                                        validationRules={field.type === 'date' ? getDateValidationRules(field.fieldName) : undefined}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={!isDirty ||
                                hasValidationErrors ||
                                updateTimelineAssessmentMutation.isPending ||
                                updateChangeCharacteristicsMutation.isPending ||
                                updateAnagraphicDataMutation.isPending}
                            startIcon={<Save />}
                        >
                            Save Timeline Information
                        </Button>
                    </Box>
                </Stack>
            </form>
        </Box>
    );
};

export default TimelineAssessment;