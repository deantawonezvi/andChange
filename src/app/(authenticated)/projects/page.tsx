// Modified src/app/(authenticated)/projects/page.tsx
'use client'
import React, { useState, useEffect } from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { ProjectService } from '@/app/lib/api/services/projectService';
import { OrganizationService } from '@/app/lib/api/services/organisationService';
import ProjectsTable from "@/app/lib/components/tables/projectsTable";
import CreateProjectModal from "@/app/lib/components/forms/createProjectModal";
import { useToast } from '@/app/lib/hooks/useToast';

const ProjectsPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrganizationId, setSelectedOrganizationId] = useState<number | 'all'>('all');
    const projectService = ProjectService.getInstance();
    const organizationService = OrganizationService.getInstance();
    const { showToast } = useToast();

    // Fetch all organizations
    const {
        data: organizations,
        isLoading: isLoadingOrgs,
        error: orgsError
    } = useQuery({
        queryKey: ['organizations'],
        queryFn: () => organizationService.getAllOrganizations()
    });

    // Fetch projects, filtered by organization if selected
    const {
        data: projects,
        isLoading: isLoadingProjects,
        error: projectsError
    } = useQuery({
        queryKey: ['projects', selectedOrganizationId],
        queryFn: () => {
            if (selectedOrganizationId === 'all') {
                return projectService.getAllProjects();
            } else {
                return projectService.getProjectsByOrganization(selectedOrganizationId as number);
            }
        }
    });

    // Show errors in toast
    useEffect(() => {
        if (orgsError) {
            showToast(`Error loading organizations: ${orgsError instanceof Error ? orgsError.message : 'Unknown error'}`, 'error');
        }
        if (projectsError) {
            showToast(`Error loading projects: ${projectsError instanceof Error ? projectsError.message : 'Unknown error'}`, 'error');
        }
    }, [orgsError, projectsError, showToast]);

    return (
        <Box>
            {/* Organization filter */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <FormControl sx={{ minWidth: 240 }}>
                    <InputLabel>Organization</InputLabel>
                    <Select
                        value={selectedOrganizationId}
                        onChange={(e) => setSelectedOrganizationId(e.target.value as number | 'all')}
                        label="Organization"
                    >
                        <MenuItem value="all">All Organizations</MenuItem>
                        {organizations?.map((org) => (
                            <MenuItem key={org.id} value={org.id}>
                                {org.organizationName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Button
                    variant="contained"
                    startIcon={<Plus size={20} />}
                    onClick={() => setIsModalOpen(true)}
                >
                    Create Project
                </Button>
            </Box>

            <ProjectsTable
                data={projects || []}
                isLoading={isLoadingProjects || isLoadingOrgs}
                error={(projectsError || orgsError) instanceof Error
                    ? (projectsError || orgsError)?.message
                    : undefined}
            />

            <CreateProjectModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                preselectedOrganizationId={selectedOrganizationId !== 'all' ? selectedOrganizationId : undefined}
            />
        </Box>
    );
};

export default ProjectsPage;