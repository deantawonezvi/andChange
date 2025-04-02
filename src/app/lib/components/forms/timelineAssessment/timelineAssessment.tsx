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
import { format, isValid } from 'date-fns';
import { timelineFields } from "@/app/lib/components/forms/timelineAssessment/types";

interface TimelineFormData {
    // Timeline assessment fields from ModelTimelineAssessmentDTO
    kickoff: string;
    designDefined: string;
    develop: string;
    test: string;
    deploy: string;
    outcomes: string;
    releases: string;
    impactedGroupPeopleMilestones: string;

    // Change characteristics fields
    entryPointOfCM: string;
    timeframeAdequacyForChange: number;

    // Anagraphic data field
    isProjectAgile: boolean;
}

const TimelineAssessment: React.FC = () => {
    const params = useParams();
    const projectId = typeof params.id === 'string' ? parseInt(params.id) : 0;
    const queryClient = useQueryClient();
    const modelService = ModelService.getInstance();
    const { showToast } = useToast();

    const { control, handleSubmit, reset, formState: { errors, isDirty } } = useForm<TimelineFormData>({
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

    const { data: modelData, isLoading, error } = useQuery({
        queryKey: ['model', projectId],
        queryFn: () => modelService.getModelVariables(projectId),
        enabled: projectId > 0,
    });

    // Map API model to form data
    const mapModelToFormData = (model: ModelVariablesDTO): TimelineFormData => {

        const formatDateForForm = (dateString: string | null | undefined): string => {
            if (!dateString) return '';

            // Try to parse the date and format it appropriately
            try {
                const date = new Date(dateString);
                if (isValid(date)) {
                    // Format date to match what your form component expects
                    // If your form expects ISO format:
                    return date.toISOString().split('T')[0]; // YYYY-MM-DD
                    // If your form expects another format, adjust accordingly
                }
            } catch (e) {
                console.error('Error parsing date:', dateString, e);
            }
            return '';
        };

        return {
// Timeline assessment fields
            kickoff: formatDateForForm(model.timelineAssessment?.kickoff),
            designDefined: formatDateForForm(model.timelineAssessment?.designDefined),
            develop: formatDateForForm(model.timelineAssessment?.develop),
            test: formatDateForForm(model.timelineAssessment?.test),
            deploy: formatDateForForm(model.timelineAssessment?.deploy),
            outcomes: formatDateForForm(model.timelineAssessment?.outcomes),
            releases: formatDateForForm(model.timelineAssessment?.releases),
            impactedGroupPeopleMilestones: formatDateForForm(model.timelineAssessment?.impactedGroupPeopleMilestones),

            // Change characteristics fields
            entryPointOfCM: formatDateForForm(model.changeCharacteristics?.entryPointOfCM),
            timeframeAdequacyForChange: model.changeCharacteristics?.timeframeAdequacyForChange || 3,

            // Anagraphic data field
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

    // Mutations for updating the different parts of the model
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

    // Sort timeline dates and create timeline display data
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

    // Add the onSubmit handler to process and submit the form data
    const onSubmit = async (formData: TimelineFormData) => {
        if (!modelData) return;

        try {
            // Update timeline assessment
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

            // Update change characteristics - only the fields we manage in this form
            const changeCharacteristicsData: ModelChangeCharacteristicsDTO = {
                modelId: projectId,
                entryPointOfCM: formData.entryPointOfCM,
                timeframeAdequacyForChange: formData.timeframeAdequacyForChange,
                // Preserve other fields from the existing model
                scopeOfChange: modelData.changeCharacteristics?.scopeOfChange || 1,
                amountOfOverallChange: modelData.changeCharacteristics?.amountOfOverallChange || 1,
                degreeOfConfidentialityRequired: modelData.changeCharacteristics?.degreeOfConfidentialityRequired || 1,
                degreeOfExternalStakeholderImpact: modelData.changeCharacteristics?.degreeOfExternalStakeholderImpact || 1
            };
            await updateChangeCharacteristicsMutation.mutateAsync(changeCharacteristicsData);

            // Update anagraphic data - only the isProjectAgile field
            if (modelData.anagraphicData) {
                const anagraphicData = {
                    ...modelData.anagraphicData, // Keep all existing data
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

    // Sort fields by order property
    const sortedFields = [...timelineFields].sort((a, b) =>
        (a.order || 100) - (b.order || 100)
    );

    return (
        <Box sx={{ mx: 'auto', p: 3 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={3}>
                    {(updateTimelineAssessmentMutation.isError ||
                        updateChangeCharacteristicsMutation.isError ||
                        updateAnagraphicDataMutation.isError) && (
                        <Alert severity="error">
                            Error updating timeline information. Please try again.
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