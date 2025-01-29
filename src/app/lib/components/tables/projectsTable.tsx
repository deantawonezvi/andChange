import React from 'react';
import { Box } from '@mui/material';
import { MRT_ColumnDef } from 'material-react-table';
import { useQuery } from '@tanstack/react-query';
import DataTable from '@/app/lib/components/tables/dataTable';
import { SProjectDTO } from '@/app/lib/api/services/projectService';
import { SectionLoader } from '@/app/lib/components/common/pageLoader';
import { OrganizationService } from '@/app/lib/api/services/organisationService';

interface ProjectTableProps {
    data: SProjectDTO[];
    isLoading: boolean;
    error?: string;
}

interface ProjectTableData extends Record<string, unknown> {
    id: number;
    projectName: string;
    organizationId: number;
    organizationName: string;
}

const ProjectsTable: React.FC<ProjectTableProps> = ({ data, isLoading: isLoadingProjects, error }) => {
    const organizationService = OrganizationService.getInstance();

    const { data: organizations, isLoading: isLoadingOrgs } = useQuery({
        queryKey: ['organizations'],
        queryFn: () => organizationService.getAllOrganizations(),
    });

    const columns: MRT_ColumnDef<ProjectTableData>[] = [
        {
            accessorKey: 'id',
            header: 'ID',
            size: 100,
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

    if (isLoadingProjects || isLoadingOrgs) {
        return <SectionLoader message="Loading projects..." />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const transformedData: ProjectTableData[] = data.map(project => {
        const organization = organizations?.find(org => org.id === project.organizationId);
        return {
            id: project.id ?? 0,
            projectName: project.projectName,
            organizationId: project.organizationId,
            organizationName: organization?.organizationName ?? 'Unknown Organization'
        };
    });

    return (
        <Box sx={{ width: '100%' }}>
            <DataTable
                data={transformedData}
                columns={columns}
                title="Projects"
                subtitle="Overview of all projects"
                enablePagination={true}
            />
        </Box>
    );
};

export default ProjectsTable;