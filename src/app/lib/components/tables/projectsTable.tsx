import React from 'react';
import { Box } from '@mui/material';
import { MRT_ColumnDef } from 'material-react-table';
import DataTable from '@/app/lib/components/tables/dataTable';
import { SProjectDTO } from '@/app/lib/api/services/projectService';
import { SectionLoader } from '@/app/lib/components/common/pageLoader';

interface ProjectTableProps {
    data: SProjectDTO[];
    isLoading: boolean;
    error?: string;
}

interface ProjectTableData extends Record<string, unknown> {
    id: number;
    projectName: string;
    organizationId: number;
}

const ProjectsTable: React.FC<ProjectTableProps> = ({ data, isLoading, error }) => {
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
            accessorKey: 'organizationId',
            header: 'Organization ID',
            size: 150,
        },
    ];

    if (isLoading) {
        return <SectionLoader message="Loading projects..." />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const transformedData: ProjectTableData[] = data.map(project => ({
        id: project.id ?? 0,
        projectName: project.projectName,
        organizationId: project.organizationId,
    }));

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