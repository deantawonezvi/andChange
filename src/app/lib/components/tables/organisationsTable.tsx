import React from 'react';
import {Box} from '@mui/material';
import {MRT_ColumnDef} from 'material-react-table';
import DataTable from '@/app/lib/components/tables/dataTable';
import {SectionLoader} from '@/app/lib/components/common/pageLoader';
import {SOrganizationDTO} from "@/app/lib/api/services/organisationService";

interface OrganizationTableProps {
    data: SOrganizationDTO[];
    isLoading: boolean;
    error?: string;
}

interface OrganizationTableData extends Record<string, unknown> {
    id: number;
    organizationName: string;
    industry: string;
    language: string;
}

const OrganizationsTable: React.FC<OrganizationTableProps> = ({ data, isLoading, error }) => {
    const columns: MRT_ColumnDef<OrganizationTableData>[] = [
        {
            accessorKey: 'id',
            header: 'ID',
            size: 100,
        },
        {
            accessorKey: 'organizationName',
            header: 'Organization Name',
            size: 250,
        },
        {
            accessorKey: 'industry',
            header: 'Industry',
            size: 200,
        },
        {
            accessorKey: 'language',
            header: 'Language',
            size: 150,
            Cell: ({ cell }) => cell.getValue<string>()?.toUpperCase(),
        },
    ];

    if (isLoading) {
        return <SectionLoader message="Loading organizations..." />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const transformedData: OrganizationTableData[] = data.map(org => ({
        id: org.id ?? 0,
        organizationName: org.organizationName,
        industry: org.industry,
        language: org.language,
    }));

    return (
        <Box sx={{ width: '100%' }}>
            <DataTable
                data={transformedData}
                columns={columns}
                title="Organizations"
                subtitle="Overview of all organizations"
                enablePagination={true}
            />
        </Box>
    );
};

export default OrganizationsTable;