
import React from 'react';
import { Box, Paper, Tab, Tabs, Typography, } from '@mui/material';
import { Building2, CalendarDays, FolderKanban, Globe, MessageSquare, UserRound, Users } from 'lucide-react';
import ProjectInformationForm from "@/app/lib/components/forms/projectInformation/projectInformation";
import TimelineAssessment from "@/app/lib/components/forms/timelineAssessment/timelineAssessment";
import ImpactedGroupsTable from "@/app/lib/components/tables/impactedGroupsTable";
import OrganizationalAssessmentForm from "@/app/lib/components/forms/organisationInfo/organisationInfoAssessment";
import LeadershipAssessment from "@/app/lib/components/forms/leadershipAssessment/leadershipAssessment";
import CommunicationToneAssessment from "@/app/lib/components/forms/communicationTone/communicationToneAssessment";
import CulturalFactorsAssessment from "@/app/lib/components/forms/culturalFactors/culturalFactorsAssessment";
import LeadershipStructureAssessment
    from "@/app/lib/components/forms/leadershipAssessment/leadershipStructureAssessment";

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
        icon: <Building2 size={20} color="#e85d45" />,
        description: 'Basic information about your organization and its core values',
        id: 'org-info'
    },
    {
        label: 'Project Information',
        icon: <FolderKanban size={20} color="#e85d45" />,
        description: 'Details about the project scope, objectives, and goals',
        id: 'project-info'
    },
    {
        label: 'Timeline',
        icon: <CalendarDays size={20} color="#e85d45" />,
        description: 'Project timeline and key milestones',
        id: 'timeline'
    },
    {
        label: 'Impacted Groups',
        icon: <Users size={20} color="#e85d45" />,
        description: 'Information about teams and individuals affected by the change',
        id: 'impacted-groups'
    },
    {
        label: 'Leadership',
        icon: <UserRound size={20} color="#e85d45" />,
        description: 'Leadership structure and stakeholder information',
        id: 'leadership'
    },
    {
        label: 'Communication Tone',
        icon: <MessageSquare size={20} color="#e85d45" />,
        description: 'Communication strategy and tone settings',
        id: 'communication'
    },
    {
        label: 'Cultural Factors',
        icon: <Globe size={20} color="#e85d45" />,
        description: 'Cultural considerations and organizational dynamics',
        id: 'cultural-factors'
    },
];

interface ModelCalibrationProps {
    activeTabIndex?: number;
    onTabChange?: (index: number) => void;
}

export default function ModelCalibration({ activeTabIndex = 0, onTabChange }: ModelCalibrationProps) {
    const [internalActiveTab, setInternalActiveTab] = React.useState(activeTabIndex);

    const activeTab = onTabChange ? activeTabIndex : internalActiveTab;

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {

        if (onTabChange) {
            onTabChange(newValue);
        } else {

            setInternalActiveTab(newValue);
        }
    };

    React.useEffect(() => {
        if (onTabChange && activeTabIndex !== internalActiveTab) {
            setInternalActiveTab(activeTabIndex);
        }
    }, [activeTabIndex, internalActiveTab, onTabChange]);

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
                    <Typography variant="h4">Project Information</Typography>
                    <br/>
                    <ProjectInformationForm/>
                </TabPanel>

                <TabPanel value={activeTab} index={2}>
                    <Typography variant="h4">Timeline</Typography>
                    <br/>
                    <TimelineAssessment/>
                </TabPanel>

                <TabPanel value={activeTab} index={3}>
                    <Typography variant="h4">Impacted Groups</Typography>
                    <br/>
                    <ImpactedGroupsTable/>
                </TabPanel>

                <TabPanel value={activeTab} index={4}>
                    <br/>
                    <LeadershipStructureAssessment/>
                    <br/>
                    <LeadershipAssessment/>
                </TabPanel>

                <TabPanel value={activeTab} index={5}>
                    <Typography variant="h4">Communication Tone</Typography>
                    <br/>
                    <CommunicationToneAssessment/>
                </TabPanel>

                <TabPanel value={activeTab} index={6}>
                    <Typography variant="h4">Cultural Factors</Typography>
                    <br/>
                    <CulturalFactorsAssessment/>
                </TabPanel>
            </Paper>
        </Box>
    );
}