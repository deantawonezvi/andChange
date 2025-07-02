import React, { useMemo } from 'react';
import { Box } from '@mui/material';
import { MRT_ColumnDef } from 'material-react-table';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import DataTable from '@/app/lib/components/tables/dataTable';
import { ProjectService, SProjectDTO } from '@/app/lib/api/services/projectService';
import { SectionLoader } from '@/app/lib/components/common/pageLoader';
import { OrganizationService } from '@/app/lib/api/services/organisationService';

interface ProjectTableProps {
    data?: SProjectDTO[];
    isLoading?: boolean;
    error?: string;
    organizationId?: number;
    standalone?: boolean;
}

interface ProjectTableData extends Record<string, unknown> {
    id: number;
    projectName: string;
    organizationId: number;
    organizationName: string;
}

const ProjectsTable: React.FC<ProjectTableProps> = ({
                                                        data: propData,
                                                        isLoading: propIsLoading,
                                                        error: propError,
                                                        organizationId,
                                                        standalone = false
                                                    }) => {
    const router = useRouter();
    const projectService = ProjectService.getInstance();
    const organizationService = OrganizationService.getInstance();

    const {
        data: fetchedProjects,
        isLoading: isLoadingFetchedProjects,
        error: fetchedProjectsError
    } = useQuery({
        queryKey: ['projects'],
        queryFn: () => projectService.getAllProjects(),
        enabled: standalone
    });

    const {
        data: organizations,
        isLoading: isLoadingOrgs
    } = useQuery({
        queryKey: ['organizations'],
        queryFn: () => organizationService.getAllOrganizations(),
    });

    const projects = useMemo(() => {
        if (!standalone && propData) {
            return propData;
        }

        if (standalone && fetchedProjects) {
            if (organizationId) {
                return fetchedProjects.filter(project => project.organizationId === organizationId);
            }

            return fetchedProjects;
        }

        return [];
    }, [standalone, propData, fetchedProjects, organizationId]);

    const isLoading = standalone ? isLoadingFetchedProjects : propIsLoading;
    const error = standalone ? fetchedProjectsError : propError;

    const handleViewProject = (id: number) => {
        router.push(`/projects/${id}?tab=model-calibration`);
    };

    const columns: MRT_ColumnDef<ProjectTableData>[] = [
        {
            accessorKey: 'id',
            header: 'ID',
            size: 80,
        },
        {
            accessorKey: 'projectName',
            header: 'Project Name',
            size: 200,
        },
        {
            accessorKey: 'organizationName',
            header: 'Organization',
            size: 200,
        },
    ];

    if (isLoading || isLoadingOrgs) {
        return <SectionLoader message="Loading projects..." />;
    }

    if (error) {
        return <div>Error: {error instanceof Error ? error.message : String(error)}</div>;
    }

    const transformedData: ProjectTableData[] = projects
        .map(project => {
            const organization = organizations?.find(org => org.id === project.organizationId);
            return {
                id: project.id ?? 0,
                projectName: project.projectName,
                organizationId: project.organizationId,
                organizationName: organization?.organizationName ?? 'Unknown Organization'
            };
        })
        .sort((a, b) => a.projectName.localeCompare(b.projectName));

    return (
        <Box sx={{ width: '100%' }}>
            <DataTable
                data={transformedData}
                columns={columns}
                title={"Projects"}
                subtitle={"Overview of all projects"}
                enablePagination={true}
                muiTableBodyRowProps={({ row }: { row: any }) => ({
                    onClick: () => handleViewProject(row.original.id),
                    sx: {
                        cursor: 'pointer',
                        '&:hover': {
                            backgroundColor: 'action.hover',
                        },
                    },
                })}
            />
        </Box>
    );
};

export default ProjectsTable;