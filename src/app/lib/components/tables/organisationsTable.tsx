import React from 'react';
import { Box } from '@mui/material';
import { MRT_ColumnDef } from 'material-react-table';
import { useRouter } from 'next/navigation';
import DataTable from '@/app/lib/components/tables/dataTable';
import { SectionLoader } from '@/app/lib/components/common/pageLoader';
import { SOrganizationDTO } from "@/app/lib/api/services/organisationService";

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
    const router = useRouter();

    const handleViewOrganization = (id: number) => {
        router.push(`/organisations/${id}`);
    };

    const columns: MRT_ColumnDef<OrganizationTableData>[] = [
        {
            accessorKey: 'id',
            header: 'ID',
            size: 80,
        },
        {
            accessorKey: 'organizationName',
            header: 'Organization Name',
            size: 250,
            Cell: ({ row }) => (
                <span
                    style={{
                        fontWeight: 500,
                        cursor: 'pointer',
                        textDecoration: 'underline'
                    }}
                    onClick={() => handleViewOrganization(row.original.id)}
                >
                    {row.original.organizationName}
                </span>
            ),
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

    const transformedData: OrganizationTableData[] = data
        .map(org => ({
            id: org.id ?? 0,
            organizationName: org.organizationName,
            industry: org.industry,
            language: org.language,
        }))
        .sort((a, b) => a.organizationName.localeCompare(b.organizationName));

    return (
        <Box sx={{ width: '100%' }}>
            <DataTable
                data={transformedData}
                columns={columns}
                title="Organizations"
                subtitle="Overview of all organizations"
                enablePagination={true}
                muiTableBodyRowProps={({ row }: { row: any }) => ({
                    onClick: () => handleViewOrganization(row.original.id),
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

export default OrganizationsTable;