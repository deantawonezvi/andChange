'use client'
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert, Box, Button, Divider, Paper, Tab, Tabs, Typography } from '@mui/material';
import { Plus, Users } from 'lucide-react';
import { OrganizationService } from "@/app/lib/api/services/organisationService";
import IndividualService from "@/app/lib/api/services/individualService";
import { SectionLoader } from '@/app/lib/components/common/pageLoader';
import ProjectsTable from '@/app/lib/components/tables/projectsTable';
import { useToast } from '@/app/lib/hooks/useToast';
import IndividualsTable from "@/app/lib/components/tables/individualsTable";
import CreateIndividualModal from "@/app/lib/components/forms/createIndividualModel";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

// TabPanel component for tab content
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

// Organization Details Page component
export default function OrganizationDetailsPage() {
    const params = useParams();
    const organizationId = typeof params.id === 'string' ? parseInt(params.id) : 0;
    const [activeTab, setActiveTab] = useState(0);
    const [isCreateIndividualModalOpen, setIsCreateIndividualModalOpen] = useState(false);
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    // Query to fetch organization details
    const {
        data: organization,
        isLoading: isLoadingOrganization,
        error: organizationError
    } = useQuery({
        queryKey: ['organization', organizationId],
        queryFn: () => OrganizationService.getInstance().getOrganizationById(organizationId),
        enabled: !!organizationId
    });

    // Query to fetch individuals for this organization
    const {
        data: individuals,
        isLoading: isLoadingIndividuals,
        error: individualsError
    } = useQuery({
        queryKey: ['individuals', organizationId],
        queryFn: () => IndividualService.getInstance().getIndividualsByOrganization(organizationId),
        enabled: !!organizationId
    });


    // Handle tab change
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    // Handle opening the create individual modal
    const handleOpenCreateIndividualModal = () => {
        setIsCreateIndividualModalOpen(true);
    };

    // Handle closing the create individual modal
    const handleCloseCreateIndividualModal = () => {
        setIsCreateIndividualModalOpen(false);
    };

    // Handle successful individual creation
    const handleIndividualCreated = () => {
        showToast('Individual created successfully', 'success');
        queryClient.invalidateQueries({ queryKey: ['individuals', organizationId] });
        setIsCreateIndividualModalOpen(false);
    };

    // If loading, show loader
    if (isLoadingOrganization) {
        return <SectionLoader />;
    }

    // If error, show error message
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
            <Paper sx={{ p: 3, mb: 3 }}>
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
                        <Tab label="Individuals" icon={<Users size={16} />} iconPosition="start" />
                        <Tab label="Projects" />
                    </Tabs>
                </Box>

                {/* Individuals Tab */}
                <TabPanel value={activeTab} index={0}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6">Organization Members</Typography>
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

                {/* Projects Tab */}
                <TabPanel value={activeTab} index={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6">Organization Projects</Typography>
                        <Button
                            variant="contained"
                            startIcon={<Plus size={16} />}
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
            </Paper>

            {/* Create Individual Modal */}
            <CreateIndividualModal
                open={isCreateIndividualModalOpen}
                onClose={handleCloseCreateIndividualModal}
                organizationId={organizationId}
                onSuccess={handleIndividualCreated}
            />
        </Box>
    );
}