// src/app/lib/components/calibration/ModelCalibration.tsx
import React, { useState } from 'react';
import {
    Box,
    Tab,
    Tabs,
    Paper,
    Typography,
} from '@mui/material';
import {
    Building2,
    FolderKanban,
    CalendarDays,
    Users,
    UserRound,
    MessageSquare,
    Globe
} from 'lucide-react';
import OrganizationalAssessmentForm from "@/app/lib/components/forms/organisationalAssessment";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`model-calibration-tabpanel-${index}`}
            aria-labelledby={`model-calibration-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const tabs = [
    {
        label: 'Organisational Information',
        icon: <Building2 size={20} />,
        description: 'Basic information about your organization and its core values'
    },
    {
        label: 'Project Information',
        icon: <FolderKanban size={20} />,
        description: 'Details about the project scope, objectives, and goals'
    },
    {
        label: 'Timeline',
        icon: <CalendarDays size={20} />,
        description: 'Project timeline and key milestones'
    },
    {
        label: 'Impacted Groups',
        icon: <Users size={20} />,
        description: 'Information about teams and individuals affected by the change'
    },
    {
        label: 'Leadership',
        icon: <UserRound size={20} />,
        description: 'Leadership structure and stakeholder information'
    },
    {
        label: 'Communication Tone',
        icon: <MessageSquare size={20} />,
        description: 'Communication strategy and tone settings'
    },
    {
        label: 'Cultural Factors',
        icon: <Globe size={20} />,
        description: 'Cultural considerations and organizational dynamics'
    },
];

export default function ModelCalibration() {
    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    return (
        <Box>
            {/* Navigation Tabs */}
            <Paper
                elevation={0}
                sx={{
                    mb: 3,
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                        '& .MuiTab-root': {
                            minHeight: 64,
                            textTransform: 'none',
                        }
                    }}
                >
                    {tabs.map((tab, index) => (
                        <Tab
                            key={index}
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {tab.icon}
                                    <span>{tab.label}</span>
                                </Box>
                            }
                        />
                    ))}
                </Tabs>
            </Paper>

            {/* Tab Panels */}
            <Paper
                elevation={0}
                sx={{
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <TabPanel value={activeTab} index={0}>
                    <Typography variant="h4">Organizational Information</Typography>
                    <br/>
                    <OrganizationalAssessmentForm/>
                </TabPanel>

                <TabPanel value={activeTab} index={1}>
                    <Typography variant="h6">Project Information</Typography>
                    <Typography>Project details form will be implemented here.</Typography>
                </TabPanel>

                <TabPanel value={activeTab} index={2}>
                    <Typography variant="h6">Timeline</Typography>
                    <Typography>Timeline configuration will be implemented here.</Typography>
                </TabPanel>

                <TabPanel value={activeTab} index={3}>
                    <Typography variant="h6">Impacted Groups</Typography>
                    <Typography>Impacted groups management interface will be implemented here.</Typography>
                </TabPanel>

                <TabPanel value={activeTab} index={4}>
                    <Typography variant="h6">Leadership</Typography>
                    <Typography>Leadership and stakeholder management will be implemented here.</Typography>
                </TabPanel>

                <TabPanel value={activeTab} index={5}>
                    <Typography variant="h6">Communication Tone</Typography>
                    <Typography>Communication tone settings will be implemented here.</Typography>
                </TabPanel>

                <TabPanel value={activeTab} index={6}>
                    <Typography variant="h6">Cultural Factors</Typography>
                    <Typography>Cultural factors assessment will be implemented here.</Typography>
                </TabPanel>
            </Paper>
        </Box>
    );
}