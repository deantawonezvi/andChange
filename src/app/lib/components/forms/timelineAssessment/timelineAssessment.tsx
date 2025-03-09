import React, { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert, Box, Button, Divider, Grid, Paper, Stack, Typography } from '@mui/material';
import { Save } from 'lucide-react';
import { ModelService, ModelTimelineAssessmentDTO, ModelChangeCharacteristicsDTO, ModelVariablesDTO } from "@/app/lib/api/services/modelService";
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

// Define timeline assessment fields
const timelineFields = [
    {
        fieldName: 'entryPointOfCM',
        label: 'Entry point of Change Management',
        tooltip: 'When will/did Change Management start to be practised in this project',
        type: 'date',
        required: true,
        order: 1
    },
    {
        fieldName: 'timeframeAdequacyForChange',
        label: 'Adequacy of the timeframe for change',
        tooltip: 'How adequate is the timeframe for implementing this change',
        type: 'slider',
        min: 1,
        max: 5,
        marks: [
            { value: 1, label: 'There is lots of time' },
            { value: 3, label: 'Timeframe is tight but trade-offs possible' },
            { value: 5, label: 'Timeframe is tight and little option to trade-off' }
        ],
        required: true,
        order: 2
    },
    {
        fieldName: 'kickoff',
        label: 'Kick-Off',
        tooltip: 'The official start of the project, aligning objectives, stakeholders, and timelines.',
        type: 'date',
        required: true,
        order: 3
    },
    {
        fieldName: 'designDefined',
        label: 'Design',
        tooltip: 'Planning the solution and architecture, engaging prototype users, and preparing leaders for their roles in change.',
        type: 'date',
        required: true,
        order: 4
    },
    {
        fieldName: 'develop',
        label: 'Develop',
        tooltip: 'Building project deliverables, communicating progress, and ensuring leaders socialize the change.',
        type: 'date',
        required: true,
        order: 5
    },
    {
        fieldName: 'test',
        label: 'Testing',
        tooltip: 'Examining project deliverables, involving users in testing, and building confidence in the new system.',
        type: 'date',
        required: true,
        order: 6
    },
    {
        fieldName: 'deploy',
        label: 'Go-Live / Deploy',
        tooltip: 'Releasing the project into the live environment, ensuring user support and a smooth transition.',
        type: 'date',
        required: true,
        order: 7
    },
    {
        fieldName: 'outcomes',
        label: 'Outcomes',
        tooltip: 'Evaluating project success by measuring adoption rates and user satisfaction.',
        type: 'date',
        required: true,
        order: 8
    },
    {
        fieldName: 'releases',
        label: 'Release Start',
        tooltip: 'When the first release is planned to start',
        type: 'date',
        required: true,
        order: 9
    },
    {
        fieldName: 'isProjectAgile',
        label: 'Is this an Agile Project with predefined sprint intervals?',
        tooltip: 'Select Yes if this is an Agile project with defined sprint intervals',
        type: 'boolean',
        required: true,
        order: 10
    }
];

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
        return {
            // Timeline assessment fields
            kickoff: model.timelineAssessment?.kickoff || '',
            designDefined: model.timelineAssessment?.designDefined || '',
            develop: model.timelineAssessment?.develop || '',
            test: model.timelineAssessment?.test || '',
            deploy: model.timelineAssessment?.deploy || '',
            outcomes: model.timelineAssessment?.outcomes || '',
            releases: model.timelineAssessment?.releases || '',
            impactedGroupPeopleMilestones: model.timelineAssessment?.impactedGroupPeopleMilestones || '',

            // Change characteristics fields
            entryPointOfCM: model.changeCharacteristics?.entryPointOfCM || '',
            timeframeAdequacyForChange: model.changeCharacteristics?.timeframeAdequacyForChange || 3,

            // Anagraphic data field
            isProjectAgile: model.anagraphicData?.isProjectAgile || false
        };
    };

    React.useEffect(() => {
        if (modelData) {
            const formData = mapModelToFormData(modelData);
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
            .filter(event => !!event.date) // Only include events with dates
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
            <form>
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
                                <Timeline position="alternate" sx={{ minWidth: timelineEvents.length * 250 }}>
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
                                        min={field.min}
                                        max={field.max}
                                        marks={field.marks}
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