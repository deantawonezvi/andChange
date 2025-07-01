'use client'
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert, Box, Button, Divider, Paper, Tab, Tabs, Typography } from '@mui/material';
import { FolderKanban, Plus, Users } from 'lucide-react';
import { OrganizationService } from "@/app/lib/api/services/organisationService";
import IndividualService from "@/app/lib/api/services/individualService";
import { SectionLoader } from '@/app/lib/components/common/pageLoader';
import ProjectsTable from '@/app/lib/components/tables/projectsTable';
import { useToast } from '@/app/lib/hooks/useToast';
import IndividualsTable from "@/app/lib/components/tables/individualsTable";
import CreateIndividualModal from "@/app/lib/components/forms/createIndividualModel";
import CreateProjectModal from "@/app/lib/components/forms/createProjectModal";

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
            id={`organization-tabpanel-${index}`}
            aria-labelledby={`organization-tab-${index}`}
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


export default function OrganizationDetailsPage() {
    const params = useParams();
    const organizationId = typeof params.id === 'string' ? parseInt(params.id) : 0;
    const [activeTab, setActiveTab] = useState(0);
    const [isCreateIndividualModalOpen, setIsCreateIndividualModalOpen] = useState(false);
    const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    const {
        data: organization,
        isLoading: isLoadingOrganization,
        error: organizationError
    } = useQuery({
        queryKey: ['organization', organizationId],
        queryFn: () => OrganizationService.getInstance().getOrganizationById(organizationId),
        enabled: !!organizationId
    });

    const {
        data: individuals,
        isLoading: isLoadingIndividuals,
        error: individualsError
    } = useQuery({
        queryKey: ['individuals', organizationId],
        queryFn: () => IndividualService.getInstance().getIndividualsByOrganization(organizationId),
        enabled: !!organizationId
    });

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const handleOpenCreateIndividualModal = () => {
        setIsCreateIndividualModalOpen(true);
    };

    const handleOpenCreateProjectModal = () => {
        setIsCreateProjectModalOpen(true);
    };

    const handleCloseCreateIndividualModal = () => {
        setIsCreateIndividualModalOpen(false);
    };

    const handleIndividualCreated = () => {
        showToast('Individual created successfully', 'success');
        queryClient.invalidateQueries({ queryKey: ['individuals', organizationId] });
        setIsCreateIndividualModalOpen(false);
    };

    if (isLoadingOrganization) {
        return <SectionLoader />;
    }

    if (organizationError) {
        return (
            <Alert severity="error">
                Error loading organization details. Please try again later.
            </Alert>
        );
    }

    return (
        <Box sx={{ width: '100%' }}>
            {/* Organization header */}
            <Paper sx={{ p: 3, mb: 3, border: '3px solid #e85d45', borderRadius: 4 }}>
                <Typography variant="h4" gutterBottom>
                    {organization?.organizationName}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Industry: {organization?.industry}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Language: {organization?.language}
                </Typography>
            </Paper>

            {/* Tabs for organization sections */}
            <Paper sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={activeTab} onChange={handleTabChange} aria-label="organization tabs">
                        <Tab label="Projects" icon={<FolderKanban size={20} color="#e85d45" />} iconPosition="start" />
                        <Tab label="Individuals" icon={<Users size={20} color="#e85d45"  />} iconPosition="start" />
                    </Tabs>
                </Box>
                {/* Projects Tab */}
                <TabPanel value={activeTab} index={0}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6">Organization Projects</Typography>
                        <Button
                            variant="contained"
                            startIcon={<Plus size={16} />}
                            onClick={handleOpenCreateProjectModal}
                        >
                            Create Project
                        </Button>
                    </Box>
                    <Divider sx={{ mb: 2 }} />

                    <ProjectsTable
                        standalone={true}
                        organizationId={organizationId}
                    />
                </TabPanel>

                {/* Individuals Tab */}
                <TabPanel value={activeTab} index={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6">Organization Individuals</Typography>
                        <Button
                            variant="contained"
                            startIcon={<Plus size={16} />}
                            onClick={handleOpenCreateIndividualModal}
                        >
                            Add Individual
                        </Button>
                    </Box>
                    <Divider sx={{ mb: 2 }} />

                    {isLoadingIndividuals ? (
                        <SectionLoader />
                    ) : individualsError ? (
                        <Alert severity="error">
                            Error loading individuals. Please try again later.
                        </Alert>
                    ) : (
                        <IndividualsTable
                            data={individuals || []}
                            isLoading={isLoadingIndividuals}
                            organizationId={organizationId}
                        />
                    )}
                </TabPanel>


            </Paper>

            {/* Create Individual Modal */}
            <CreateIndividualModal
                open={isCreateIndividualModalOpen}
                onClose={handleCloseCreateIndividualModal}
                organizationId={organizationId}
                onSuccess={handleIndividualCreated}
            />

            <CreateProjectModal
                open={isCreateProjectModalOpen}
                onClose={() => setIsCreateProjectModalOpen(false)}
                preselectedOrganizationId={organizationId}
                organisationSelectEnabled={false}
            />
        </Box>
    );
}