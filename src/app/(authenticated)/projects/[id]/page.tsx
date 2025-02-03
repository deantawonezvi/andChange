// src/app/(authenticated)/projects/[id]/page.tsx
'use client';

import React, {useState} from 'react';
import {useParams, useRouter} from 'next/navigation';
import {useQuery} from '@tanstack/react-query';
import {Box, Breadcrumbs, Paper, Tab, Tabs, Typography,} from '@mui/material';
import {BarChart3, LineChart, PlayCircle, Settings} from 'lucide-react';
import {ProjectService} from '@/app/lib/api/services/projectService';
import {SectionLoader} from '@/app/lib/components/common/pageLoader';
import ModelCalibration from "@/app/lib/components/projects/modelCalibration";

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
            id={`project-tabpanel-${index}`}
            aria-labelledby={`project-tab-${index}`}
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
    { label: 'Dashboard', icon: <BarChart3 size={20} /> },
    { label: 'Model Calibration', icon: <Settings size={20} /> },
    { label: 'Plan Actions', icon: <PlayCircle size={20} /> },
    { label: 'Track Progress', icon: <LineChart size={20} /> },
];

export default function ProjectPage() {
    const [activeTab, setActiveTab] = useState(0);
    const params = useParams();
    const router = useRouter();
    const projectId = typeof params.id === 'string' ? parseInt(params.id) : 0;

    const projectService = ProjectService.getInstance();
    const { data: project, isLoading } = useQuery({
        queryKey: ['project', projectId],
        queryFn: () => projectService.getProjectById(projectId),
        enabled: !!projectId
    });

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    if (isLoading) {
        return <SectionLoader message="Loading project details..." />;
    }

    return (
        <Box sx={{ width: '100%' }}>
            {/* Breadcrumbs */}
            <Breadcrumbs sx={{ mb: 3 }}>
                <Typography
                    sx={{
                        cursor: 'pointer',
                        '&:hover': {
                            textDecoration: 'underline'
                        }
                    }}
                    color="primary"
                    onClick={() => router.push('/projects')}
                >
                    Projects
                </Typography>
                <Typography color="text.primary">{project?.projectName}</Typography>
            </Breadcrumbs>

            {/* Project Title */}
            <Typography variant="h4" component="h1" gutterBottom>
                {project?.projectName}
            </Typography>
            <br/>

            {/* Tabs */}
            <Paper elevation={0} sx={{ mb: 3, borderRadius: 1 }}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                        borderBottom: 1,
                        borderColor: 'divider',
                        '& .MuiTab-root': {
                            minHeight: 64,
                            textTransform: 'none'
                        }
                    }}
                >
                    {tabs.map((tab, index) => (
                        <Tab
                            key={index}
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {tab.icon}
                                    {tab.label}
                                </Box>
                            }
                        />
                    ))}
                </Tabs>
            </Paper>

            {/* Tab Panels */}
            <TabPanel value={activeTab} index={0}>
                <Typography variant="h6">Project Dashboard</Typography>
                <Typography>Project overview and key metrics will be displayed here.</Typography>
            </TabPanel>

            <TabPanel value={activeTab} index={1}>
                <Typography variant="h4">Model Calibration</Typography>
                <br/>
                <ModelCalibration/>
            </TabPanel>

            <TabPanel value={activeTab} index={2}>
                <Typography variant="h6">Plan Actions</Typography>
                <Typography>Action planning and management interface will be implemented here.</Typography>
            </TabPanel>

            <TabPanel value={activeTab} index={3}>
                <Typography variant="h6">Track Progress</Typography>
                <Typography>Progress tracking and analytics will be shown here.</Typography>
            </TabPanel>
        </Box>
    );
}