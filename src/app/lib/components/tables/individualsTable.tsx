import React from 'react';
import { useRouter } from 'next/navigation';
import { Box, IconButton, Tooltip } from '@mui/material';
import { Edit, Trash2, UserCog } from 'lucide-react';
import { MRT_ColumnDef } from 'material-react-table';
import { EIndividualDTO } from '@/app/lib/api/services/individualService';
import DataTable from '@/app/lib/components/tables/dataTable';

interface IndividualsTableProps {
    data: EIndividualDTO[];
    isLoading: boolean;
    organizationId: number;
}

interface IndividualTableData extends Record<string, unknown> {
    id: number;
    fullName: string;
    firstName: string;
    lastName: string;
    actions: React.ReactNode;
}

const IndividualsTable: React.FC<IndividualsTableProps> = ({
                                                               data,
                                                               isLoading,
                                                               organizationId
                                                           }) => {
    const router = useRouter();

    // Map the data to the format expected by the DataTable component
    const tableData: IndividualTableData[] = data.map((individual) => ({
        id: individual.id || 0,
        fullName: `${individual.firstName} ${individual.lastName}`,
        firstName: individual.firstName,
        lastName: individual.lastName,
        actions: (
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Tooltip title="Edit individual">
                    <IconButton size="small" onClick={() => handleEditIndividual(individual.id || 0)}>
                        <Edit size={18} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Manage roles">
                    <IconButton size="small" onClick={() => handleManageRoles(individual.id || 0)}>
                        <UserCog size={18} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete individual">
                    <IconButton size="small" color="error" onClick={() => handleDeleteIndividual(individual.id || 0)}>
                        <Trash2 size={18} />
                    </IconButton>
                </Tooltip>
            </Box>
        ),
    }));

    // Define the columns for the DataTable
    const columns: MRT_ColumnDef<IndividualTableData>[] = [
        {
            accessorKey: 'id',
            header: 'ID',
            size: 80,
        },
        {
            accessorKey: 'fullName',
            header: 'Name',
            size: 200,
            Cell: ({ row }) => (
                <span style={{ fontWeight: 500 }}>{row.original.fullName}</span>
            ),
        },
        {
            accessorKey: 'firstName',
            header: 'First Name',
            size: 150,
        },
        {
            accessorKey: 'lastName',
            header: 'Last Name',
            size: 150,
        },
        {
            accessorKey: 'actions',
            header: 'Actions',
            size: 150,
            Cell: ({ row }) => row.original.actions,
        },
    ];

    // Handle functions for individual actions
    const handleEditIndividual = (id: number) => {
        // Navigate to edit individual page or open edit modal
        console.log(`Edit individual with ID: ${id}`);
        // Example: router.push(`/organisations/${organizationId}/individuals/${id}/edit`);
    };

    const handleManageRoles = (id: number) => {
        // Navigate to manage roles page or open roles modal
        console.log(`Manage roles for individual with ID: ${id}`);
        // Example: router.push(`/organisations/${organizationId}/individuals/${id}/roles`);
    };

    const handleDeleteIndividual = (id: number) => {
        // Show confirmation dialog and delete if confirmed
        if (window.confirm('Are you sure you want to delete this individual?')) {
            console.log(`Delete individual with ID: ${id}`);
            // Actually implement deletion logic
        }
    };

    return (
        <DataTable
            data={tableData}
            columns={columns}
            enablePagination={true}
        />
    );
};

export default IndividualsTable;