'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Alert, Box, Paper, Tab, Tabs, Typography } from '@mui/material';
import { BarChart3, LineChart, PlayCircle, Settings } from 'lucide-react';
import { ProjectService } from '@/app/lib/api/services/projectService';
import { SectionLoader } from '@/app/lib/components/common/pageLoader';
import ModelCalibration from "@/app/lib/components/projects/modelCalibration";
import ActionsTable from "@/app/lib/components/tables/actionsTable";

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


const primaryTabs = [
    { label: 'Dashboard', icon: <BarChart3 size={20} color="#e85d45" />, id: 'dashboard' },
    { label: 'Model Calibration', icon: <Settings size={20} color="#e85d45" />, id: 'model-calibration' },
    { label: 'Plan Actions', icon: <PlayCircle size={20} color="#e85d45" />, id: 'plan-actions' },
    { label: 'Track Progress', icon: <LineChart size={20} color="#e85d45" />, id: 'track-progress' },
];


const modelCalibrationTabs = [
    { label: 'Organisation Info', id: 'org-info' },
    { label: 'Project Info', id: 'project-info' },
    { label: 'Timeline', id: 'timeline' },
    { label: 'Impacted Groups', id: 'impacted-groups' },
    { label: 'Leadership', id: 'leadership' },
    { label: 'Communication', id: 'communication' },
    { label: 'Cultural Factors', id: 'cultural-factors' },
];


const planActionsTabs = [
    { label: 'Action List', id: 'action-list' },
    { label: 'New Action', id: 'new-action' },
    { label: 'Calendar View', id: 'calendar-view' },
];

export default function ProjectPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const params = useParams();
    const projectId = typeof params.id === 'string' ? parseInt(params.id) : 0;

    const tabParam = searchParams.get('tab');
    const subtabParam = searchParams.get('subtab');

    const [invalidParam, setInvalidParam] = useState<string | null>(null);

    const [activeTab, setActiveTab] = useState(0);
    const [activeSubtab, setActiveSubtab] = useState(0);

    const getSubtabsForPrimaryTab = (primaryTabId: string) => {
        switch (primaryTabId) {
            case 'model-calibration':
                return modelCalibrationTabs;
            case 'plan-actions':
                return planActionsTabs;
            default:
                return [];
        }
    };

    useEffect(() => {
        setInvalidParam(null);

        if (tabParam) {
            const tabIndex = primaryTabs.findIndex(tab => tab.id === tabParam);
            if (tabIndex >= 0) {
                setActiveTab(tabIndex);

                const currentSubtabs = getSubtabsForPrimaryTab(tabParam);

                if (subtabParam && currentSubtabs.length > 0) {
                    const subtabIndex = currentSubtabs.findIndex(tab => tab.id === subtabParam);
                    if (subtabIndex >= 0) {
                        setActiveSubtab(subtabIndex);
                    } else {

                        setInvalidParam(`Invalid subtab: "${subtabParam}"`);
                        setActiveSubtab(0);

                        if (tabParam) {
                            const correctSubtabId = currentSubtabs[0].id;
                            router.replace(`/projects/${projectId}?tab=${tabParam}&subtab=${correctSubtabId}`);
                        }
                    }
                } else {
                    setActiveSubtab(0);
                }
            } else {
                setInvalidParam(`Invalid tab: "${tabParam}"`);
                setActiveTab(0);

                router.replace(`/projects/${projectId}`);
            }
        }
    }, [tabParam, subtabParam, projectId, router]);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
        const tabId = primaryTabs[newValue].id;

        const subtabs = getSubtabsForPrimaryTab(tabId);
        if (subtabs.length > 0) {
            const firstSubtabId = subtabs[0].id;
            router.replace(`/projects/${projectId}?tab=${tabId}&subtab=${firstSubtabId}`);
            setActiveSubtab(0);
        } else {
            router.replace(`/projects/${projectId}?tab=${tabId}`);
        }
    };

    const handleSubtabChange = (subtabIndex: number) => {
        setActiveSubtab(subtabIndex);

        const primaryTabId = primaryTabs[activeTab].id;
        const subtabs = getSubtabsForPrimaryTab(primaryTabId);

        if (subtabs.length > 0 && subtabIndex < subtabs.length) {
            const subtabId = subtabs[subtabIndex].id;
            router.replace(`/projects/${projectId}?tab=${primaryTabId}&subtab=${subtabId}`);
        }
    };

    const projectService = ProjectService.getInstance();
    const { data: project, isLoading } = useQuery({
        queryKey: ['project', projectId],
        queryFn: () => projectService.getProjectById(projectId),
        enabled: !!projectId
    });

    if (isLoading) {
        return <SectionLoader message="Loading project details..." />;
    }

    return (
        <Box sx={{ width: '100%' }}>
            {/* Project Title */}
            <Typography variant="h4" component="h1" gutterBottom>
                {project?.projectName}
            </Typography>
            <br/>

            {/* Show error message if invalid parameter was detected */}
            {invalidParam && (
                <Alert severity="warning" sx={{ mb: 3 }}>
                    {invalidParam} - Redirected to a valid tab.
                </Alert>
            )}

            {/* Primary Tabs */}
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
                    {primaryTabs.map((tab, index) => (
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
                <ModelCalibration
                    activeTabIndex={activeSubtab}
                    onTabChange={handleSubtabChange}
                />
            </TabPanel>

            <TabPanel value={activeTab} index={2}>
                <Typography variant="h4">Plan Actions</Typography>
                <br/>
                <ActionsTable projectId={projectId} />
            </TabPanel>

            <TabPanel value={activeTab} index={3}>
                <Typography variant="h6">Track Progress</Typography>
                <Typography>Progress tracking and analytics will be shown here.</Typography>
            </TabPanel>
        </Box>
    );
}