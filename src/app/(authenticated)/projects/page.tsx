'use client'
import React, {useState} from 'react';
import {Box, Button} from '@mui/material';
import {useQuery} from '@tanstack/react-query';
import {Plus} from 'lucide-react';
import {ProjectService} from '@/app/lib/api/services/projectService';
import ProjectsTable from "@/app/lib/components/tables/projectsTable";
import CreateProjectModal from "@/app/lib/components/forms/createProjectModal";

const ProjectsPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const projectService = ProjectService.getInstance();

    const { data, isLoading, error } = useQuery({
        queryKey: ['projects'],
        queryFn: () => projectService.getAllProjects()
    });

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                <Button
                    variant="contained"
                    startIcon={<Plus size={20} />}
                    onClick={() => setIsModalOpen(true)}
                >
                    Create Project
                </Button>
            </Box>

            <ProjectsTable
                data={data || []}
                isLoading={isLoading}
                error={error instanceof Error ? error.message : undefined}
            />

            <CreateProjectModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </Box>
    );
};

export default ProjectsPage;