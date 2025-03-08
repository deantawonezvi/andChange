'use client';
import React, { useState } from 'react';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    FormControl,
    IconButton,
    MenuItem,
    Paper,
    Select,
    Snackbar,
    Typography,
} from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import CalendarService from "@/app/lib/api/services/calendarService";
import { ProjectService } from "@/app/lib/api/services/projectService";
import { ImpactedGroupService } from "@/app/lib/api/services/impactedGroupService";
import { useQuery } from "@tanstack/react-query";
import { endOfMonth, format, startOfMonth } from 'date-fns';
import { useToast } from "@/app/lib/hooks/useToast";

// Helper to generate calendar data
const generateCalendarDays = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    // Get Monday as first day (1) to Sunday (7)
    const firstDayOfWeek = firstDay.getDay() || 7;

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayOfWeek - 1; i > 0; i--) {
        days.push({
            day: prevMonthLastDay - i + 1,
            isCurrentMonth: false
        });
    }

    // Current month days
    for (let day = 1; day <= lastDay.getDate(); day++) {
        days.push({
            day,
            isCurrentMonth: true
        });
    }

    // Next month days
    const remainingDays = 42 - days.length; // 6 rows * 7 days = 42
    for (let day = 1; day <= remainingDays; day++) {
        days.push({
            day,
            isCurrentMonth: false
        });
    }

    return days;
};

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

interface Event {
    date: string;
    type: string;
    title: string;
    groupName: string;
}

interface ErrorState {
    message: string;
    open: boolean;
}


const CalendarPage = () => {
    const [selectedProject, setSelectedProject] = useState<string>('all');
    const [selectedGroup, setSelectedGroup] = useState<string>('all');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [error, setError] = useState<ErrorState>({ message: '', open: false });
    const { showToast } = useToast();

    const calendarService = CalendarService.getInstance();
    const projectService = ProjectService.getInstance();
    const impactedGroupService = ImpactedGroupService.getInstance();

    const handleCloseError = () => {
        setError({ ...error, open: false });
    };


    const { data: projects, isLoading: isLoadingProjects, error: projectsError } = useQuery({
        queryKey: ['projects'],
        queryFn: () => projectService.getAllProjects(),
    });

    const { data: impactedGroups, isLoading: isLoadingGroups, error: groupsError } = useQuery({
        queryKey: ['impactedGroups', selectedProject],
        queryFn: () => {
            const projectId = parseInt(selectedProject);
            if (projectId && !isNaN(projectId)) {
                return impactedGroupService.getImpactedGroupsByProject(projectId);
            }
            return [];
        },
        enabled: selectedProject !== 'all'
    });

    const { data: calendarData, isLoading: isLoadingCalendar, error: calendarError } = useQuery({
        queryKey: ['calendar', selectedProject, selectedGroup, currentDate],
        queryFn: async () => {
            const projectId = parseInt(selectedProject);
            if (isNaN(projectId) || selectedProject === 'all') {
                return { calendarSummary: {} };
            }

            const startDate = format(startOfMonth(currentDate), 'yyyy-MM-dd');
            const endDate = format(endOfMonth(currentDate), 'yyyy-MM-dd');


            const params: { startDate: string; endDate: string; impactedGroupIds?: number[] } = {
                startDate,
                endDate
            };

            if (selectedGroup !== 'all') {
                params.impactedGroupIds = [parseInt(selectedGroup)];
            }

            return calendarService.getCalendarSummary(projectId, params);
        },
        enabled: selectedProject !== 'all'
    });

    React.useEffect(() => {
        if (projectsError) {
            showToast('Failed to load projects: ' + projectsError.message, 'error');
        } else if (groupsError) {
            showToast('Failed to load impacted groups: ' + groupsError.message, 'error');
        } else if (calendarError) {
            showToast('Failed to load calendar data: ' + calendarError.message, 'error');
        }
    }, [projectsError, groupsError, calendarError, showToast]);

    const events = React.useMemo(() => {
        if (!calendarData) return [];


        const transformedEvents: Event[] = [];
        Object.entries(calendarData.calendarSummary).forEach(([date, summaries]) => {
            summaries.forEach(summary => {
                transformedEvents.push({
                    date,
                    type: summary.actionSummaryDTO.actionCore.externalActionIdentifier,
                    title: summary.actionSummaryDTO.actionCore.actionName,
                    groupName: summary.impactedGroupDTO.anagraphicDataDTO.entityName
                });
            });
        });

        return transformedEvents;
    }, [calendarData]);

    if (isLoadingProjects || isLoadingCalendar || isLoadingGroups) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <CircularProgress />
            </Box>
        );
    }


    const getActivitiesForSelectedDate = (events: Event[], selectedDate: Date) => {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        return events
            .filter(event => event.date === dateStr)
            .map(event => ({
                title: event.title,
                time: '09:00', // Note: Add time if it's available in the API response
                groupName: event.groupName
            }));
    };

    const renderEventDot = (type: string) => {

        const colors = {
            'CRM': '#ff4444',
            'CULTURE': '#4CAF50',
            'DIGITAL': '#2196F3',
            'default': '#757575'
        };


        return (
            <Box
                component="span"
                sx={{
                    display: 'inline-block',
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: colors[type as keyof typeof colors] || colors.default,
                    mx: 0.5
                }}
            />
        );
    };

    const days = generateCalendarDays(
        currentDate.getFullYear(),
        currentDate.getMonth()
    );

    const handleMonthClick = (monthIndex: number) => {
        setCurrentDate(new Date(currentDate.getFullYear(), monthIndex));
    };

    return (
        <Box sx={{ p: 4 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ mr: 8 }}>Calendar</Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>FILTER BY</Typography>

                    <FormControl size="small" sx={{ minWidth: 200 }}>
                        <Select
                            value={selectedProject}
                            onChange={(e) => setSelectedProject(e.target.value)}
                        >
                            <MenuItem value="all">All Projects</MenuItem>
                            {projects?.map(project => (
                                <MenuItem key={project.id} value={project.id?.toString()}>
                                    {project.projectName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 200 }}>
                        <Select
                            value={selectedGroup}
                            onChange={(e) => setSelectedGroup(e.target.value)}
                            disabled={!impactedGroups?.length}
                        >
                            <MenuItem value="all">All Groups</MenuItem>
                            {impactedGroups?.map(group => (
                                <MenuItem
                                    key={group.id}
                                    value={group.id?.toString()}
                                >
                                    {group.anagraphicDataDTO.entityName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Button
                        variant="contained"
                        onClick={() => {
                            setSelectedProject('all');
                            setSelectedGroup('all');
                        }}
                        sx={{
                            bgcolor: 'black',
                            '&:hover': { bgcolor: 'grey.900' }
                        }}
                    >
                        Clear
                    </Button>
                </Box>
            </Box>

            {/* Year */}
            <Paper sx={{ bgcolor: 'black', color: 'white', p: 2, mb: 4 }}>
                <Typography variant="h4" align="center">
                    {currentDate.getFullYear()}
                </Typography>
            </Paper>


            {/* Month Navigation */}
            <Box sx={{ display: 'flex', gap: 2, mb: 4, color: 'grey.500' }}>
                {months.map((month, index) => (
                    <Typography
                        key={month}
                        variant="h6"
                        onClick={() => handleMonthClick(index)}
                        sx={{
                            cursor: 'pointer',
                            color: index === currentDate.getMonth() ? 'black' : 'inherit',
                            borderBottom: index === currentDate.getMonth() ? '2px solid red' : 'none'
                        }}
                    >
                        {month}
                    </Typography>
                ))}
            </Box>

            <Box sx={{ display: 'flex', gap: 4 }}>
                {/* Calendar Grid */}
                <Paper sx={{ p: 2, flex: 2 }}>
                    {/* Weekday Headers */}
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        mb: 2
                    }}>
                        {['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'].map(day => (
                            <Typography
                                key={day}
                                sx={{
                                    textAlign: 'center',
                                    color: day === 'Wed' ? 'black' : 'grey.500',
                                    fontWeight: day === 'Wed' ? 500 : 400
                                }}
                            >
                                {day}
                            </Typography>
                        ))}
                    </Box>

                    {/* Calendar Days */}
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        gap: 1
                    }}>
                        {days.map((day, index) => {
                            const dateStr = `2024-01-${String(day.day).padStart(2, '0')}`;
                            const dayEvents = events.filter(event => event.date === dateStr);

                            return (
                                <Box
                                    key={index}
                                    sx={{
                                        p: 1,
                                        textAlign: 'center',
                                        color: day.isCurrentMonth ? 'black' : 'grey.400',
                                        position: 'relative',
                                        minHeight: '60px'
                                    }}
                                >
                                    <Typography>{day.day}</Typography>
                                    <Box sx={{ mt: 1 }}>
                                        {dayEvents.map((event, i) => (
                                            <React.Fragment key={i}>
                                                {renderEventDot(event.type)}
                                            </React.Fragment>
                                        ))}
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>
                </Paper>

                {/* Activities */}
                {/* Activities Sidebar */}
                <Box sx={{ flex: 1 }}>
                    {getActivitiesForSelectedDate(events, currentDate).map((activity, index) => (
                        <Paper
                            key={index}
                            sx={{
                                p: 2,
                                mb: 2,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            <Box>
                                <Typography variant="h6">{activity.title}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {activity.groupName}
                                </Typography>
                                <Typography variant="body1">{activity.time}</Typography>
                            </Box>
                            <IconButton>
                                <MoreVert />
                            </IconButton>
                        </Paper>
                    ))}
                    {getActivitiesForSelectedDate(events, currentDate).length === 0 && (
                        <Typography color="text.secondary" align="center">
                            No activities for this date
                        </Typography>
                    )}
                </Box>
            </Box>

            <Snackbar
                open={error.open}
                autoHideDuration={6000}
                onClose={handleCloseError}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseError}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {error.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default CalendarPage;