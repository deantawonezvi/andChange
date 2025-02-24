'use client';
import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Select,
    MenuItem,
    Button,
    IconButton,
    FormControl,
} from '@mui/material';
import { MoreVert } from '@mui/icons-material';

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
    type: 'crm-implementation' | 'project-culture' | 'digital-assistant';
}

interface Activity {
    title: string;
    time: string;
}

const CalendarPage = () => {
    const [selectedProject, setSelectedProject] = useState('All');
    const [selectedGroup, setSelectedGroup] = useState('All');

    // Demo events data
    const events: Event[] = [
        { date: '2024-01-01', type: 'project-culture' },
        { date: '2024-01-03', type: 'project-culture' },
        { date: '2024-01-03', type: 'digital-assistant' },
        { date: '2024-01-07', type: 'crm-implementation' },
        { date: '2024-01-09', type: 'digital-assistant' },
        { date: '2024-01-16', type: 'crm-implementation' },
        { date: '2024-01-20', type: 'digital-assistant' },
        { date: '2024-01-24', type: 'project-culture' },
        { date: '2024-01-24', type: 'crm-implementation' },
        { date: '2024-01-28', type: 'digital-assistant' }
    ];

    // Demo calendar activities
    const activities: Activity[] = [
        { title: 'Adoption Assessment', time: '09:00' },
        { title: 'Impact Assessment', time: '11:00' },
        { title: 'Project Assessment', time: '14:30' }
    ];

    const renderEventDot = (type: Event['type']) => {
        const colors = {
            'crm-implementation': '#ff4444',
            'project-culture': '#4CAF50',
            'digital-assistant': '#2196F3'
        };

        return (
            <Box
                component="span"
                sx={{
                    display: 'inline-block',
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: colors[type],
                    mx: 0.5
                }}
            />
        );
    };

    const days = generateCalendarDays(2024, 0); // January 2024

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
                            <MenuItem value="All">All Projects</MenuItem>
                            <MenuItem value="CRM">CRM Implementation</MenuItem>
                            <MenuItem value="Culture">Project Culture</MenuItem>
                            <MenuItem value="Digital">Digital Assistant</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 200 }}>
                        <Select
                            value={selectedGroup}
                            onChange={(e) => setSelectedGroup(e.target.value)}
                        >
                            <MenuItem value="All">All Groups</MenuItem>
                            <MenuItem value="Group1">Group 1</MenuItem>
                            <MenuItem value="Group2">Group 2</MenuItem>
                        </Select>
                    </FormControl>

                    <Button
                        variant="contained"
                        onClick={() => {
                            setSelectedProject('All');
                            setSelectedGroup('All');
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
                <Typography variant="h4" align="center">2024</Typography>
            </Paper>

            {/* Month Navigation */}
            <Box sx={{ display: 'flex', gap: 2, mb: 4, color: 'grey.500', overflow: 'auto' }}>
                {months.map((month, index) => (
                    <Typography
                        key={month}
                        variant="h6"
                        sx={{
                            cursor: 'pointer',
                            color: index === 0 ? 'black' : 'inherit',
                            borderBottom: index === 0 ? '2px solid red' : 'none',
                            whiteSpace: 'nowrap'
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
                <Box sx={{ flex: 1 }}>
                    {activities.map((activity, index) => (
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
                                <Typography variant="body1">{activity.time}</Typography>
                            </Box>
                            <IconButton>
                                <MoreVert />
                            </IconButton>
                        </Paper>
                    ))}
                </Box>
            </Box>

            {/* Legend */}
            <Box sx={{ mt: 4 }}>
                <Typography
                    variant="body2"
                    sx={{ color: 'grey.500', mb: 2 }}
                >
                    LEGEND
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {renderEventDot('crm-implementation')}
                        <Typography>CRM Implementation</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {renderEventDot('project-culture')}
                        <Typography>Project Culture</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {renderEventDot('digital-assistant')}
                        <Typography>Digital Assistant</Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default CalendarPage;