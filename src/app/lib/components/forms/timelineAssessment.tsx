import React, {useMemo, useState} from 'react';
import {
    Alert,
    AlertTitle,
    Box,
    Button,
    IconButton,
    Paper,
    Stack,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Tooltip,
    Typography,
} from '@mui/material';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import {Info as InfoIcon, PlusCircle, Save,} from 'lucide-react';

interface Milestone {
    name: string;
    date: string;
    description: string;
}

interface Release {
    name: string;
    date: string;
}

type MethodologyType = 'Sequential' | 'Hybrid' | 'Iterative';

const TimelineAssessment = () => {
    const [methodology, setMethodology] = useState<MethodologyType>('Sequential');
    const [milestones, setMilestones] = useState<Milestone[]>([
        {
            name: 'Kick-Off',
            date: '',
            description: 'The official start of the project, where objectives, stakeholders, and timelines are introduced.'
        },
        {
            name: 'Design',
            date: '',
            description: 'The phase where the project solution and architecture are planned.'
        },
        {
            name: 'Develop',
            date: '',
            description: 'The actual creation and construction of the project deliverables.'
        },
        {
            name: 'Testing',
            date: '',
            description: 'The phase where the project deliverables are rigorously examined.'
        },
        {
            name: 'Go-Live / Deploy',
            date: '',
            description: 'The milestone where the project solution is released for use.'
        },
        {
            name: 'Outcomes',
            date: '',
            description: 'The final results of the project evaluation.'
        },
    ]);
    const [releases, setReleases] = useState<Release[]>([{ name: 'Release 1', date: '' }]);
    const [warning, setWarning] = useState<string | null>(null);

    const handleMethodologyChange = (
        event: React.MouseEvent<HTMLElement>,
        newMethodology: MethodologyType,
    ) => {
        if (newMethodology !== null) {
            setMethodology(newMethodology);
        }
    };

    const handleDateChange = (index: number, date: string) => {
        const newMilestones = [...milestones];

        if (methodology !== 'Iterative') {
            if (index > 0 && date && (!newMilestones[index - 1].date ||
                new Date(date) < new Date(newMilestones[index - 1].date))) {
                setWarning(`Please ensure dates are in sequential order.`);
                return;
            }
        }

        newMilestones[index].date = date;
        setMilestones(newMilestones);
        setWarning(null);
    };

    const handleReleaseDateChange = (index: number, date: string) => {
        const newReleases = [...releases];
        const outcomesDate = milestones.find(m => m.name === 'Outcomes')?.date;

        if (outcomesDate && new Date(date) > new Date(outcomesDate)) {
            setWarning(`Release dates must be before the Outcomes date.`);
            return;
        }

        newReleases[index].date = date;
        setReleases(newReleases);
        setWarning(null);
    };

    const addRelease = () => {
        setReleases([...releases, { name: `Release ${releases.length + 1}`, date: '' }]);
    };

    const sortedMilestones = useMemo(() =>
            [...milestones].filter(m => m.date).sort((a, b) =>
                new Date(a.date).getTime() - new Date(b.date).getTime()
            ),
        [milestones]
    );

    const visibleMilestones = methodology === 'Iterative'
        ? milestones.filter(m => !['Design', 'Develop', 'Testing'].includes(m.name))
        : milestones;

    const renderTimeline = () => (
        <Timeline position="alternate" sx={{ mb: 4 }}>
            {sortedMilestones.map((milestone, index) => (
                <TimelineItem key={milestone.name}>
                    <TimelineSeparator>
                        <TimelineDot color="primary" />
                        {index < sortedMilestones.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent>
                        <Paper elevation={3} sx={{ p: 2, backgroundColor: 'background.paper' }}>
                            <Typography variant="h6" component="h3">
                                {milestone.name}
                            </Typography>
                            <Typography>{new Date(milestone.date).toLocaleDateString()}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {milestone.description}
                            </Typography>
                        </Paper>
                    </TimelineContent>
                </TimelineItem>
            ))}
        </Timeline>
    );

    return (
        <Box>
            <Paper sx={{ p: 2, mb: 4 }}>
                <ToggleButtonGroup
                    color="primary"
                    value={methodology}
                    exclusive
                    onChange={handleMethodologyChange}
                    aria-label="methodology"
                    sx={{ width: '100%', mb: 2 }}
                >
                    <ToggleButton value="Sequential" sx={{ flex: 1 }}>Sequential</ToggleButton>
                    <ToggleButton value="Hybrid" sx={{ flex: 1 }}>Hybrid</ToggleButton>
                    <ToggleButton value="Iterative" sx={{ flex: 1 }}>Iterative</ToggleButton>
                </ToggleButtonGroup>

                {warning && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        <AlertTitle>Warning</AlertTitle>
                        {warning}
                    </Alert>
                )}

                <Typography variant="h6" gutterBottom>
                    {methodology === 'Iterative' ? 'Epic Milestones' : 'Sequential Project Milestones'}
                </Typography>

                <Stack spacing={2}>
                    {visibleMilestones.map((milestone, index) => (
                        <Box key={milestone.name}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Typography variant="subtitle1">
                                    {index + 1}. {milestone.name}
                                </Typography>
                                <Tooltip title={milestone.description}>
                                    <IconButton size="small">
                                        <InfoIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <TextField
                                type="date"
                                fullWidth
                                value={milestone.date}
                                onChange={(e) => handleDateChange(index, e.target.value)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Box>
                    ))}
                </Stack>
            </Paper>

            {renderTimeline()}

            {methodology !== 'Sequential' && (
                <Paper sx={{ p: 2, mb: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Iterative Milestones
                    </Typography>
                    <Stack spacing={2}>
                        {releases.map((release, index) => (
                            <Box key={release.name}>
                                <Typography variant="subtitle1" gutterBottom>
                                    {release.name}
                                </Typography>
                                <TextField
                                    type="date"
                                    fullWidth
                                    value={release.date}
                                    onChange={(e) => handleReleaseDateChange(index, e.target.value)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Box>
                        ))}
                        <Button
                            startIcon={<PlusCircle />}
                            variant="outlined"
                            onClick={addRelease}
                        >
                            Add Release
                        </Button>
                    </Stack>
                </Paper>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={() => console.log('Saving timeline...')}
                >
                    Save Timeline
                </Button>
            </Box>
        </Box>
    );
};

export default TimelineAssessment;