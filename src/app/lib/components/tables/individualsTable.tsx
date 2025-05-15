import React from 'react';
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
}

const IndividualsTable: React.FC<IndividualsTableProps> = ({
                                                               data
                                                           }) => {

    const tableData: IndividualTableData[] = data.map((individual) => ({
        id: individual.id || 0,
        fullName: `${individual.firstName} ${individual.lastName}`,
        firstName: individual.firstName,
        lastName: individual.lastName,

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
    ];

    return (
        <DataTable
            data={tableData}
            columns={columns}
            enablePagination={true}
        />
    );
};

export default IndividualsTable;