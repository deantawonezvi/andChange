'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Box, Button } from '@mui/material';
import { Plus } from 'lucide-react';
import { MRT_ColumnDef } from 'material-react-table';
import { ImpactedGroupService } from '@/app/lib/api/services/impactedGroupService';
import DataTable from '@/app/lib/components/tables/dataTable';
import { SectionLoader } from '@/app/lib/components/common/pageLoader';


const ImpactedGroupsTable: React.FC = () => {
    const params = useParams();
    const projectId = typeof params.id === 'string' ? parseInt(params.id) : 0;
    const impactedGroupService = ImpactedGroupService.getInstance();

    // Fetch impacted groups for this project
    const { data, isLoading, error } = useQuery({
        queryKey: ['impactedGroups', projectId],
        queryFn: () => impactedGroupService.getImpactedGroupsByProject(projectId),
        enabled: !!projectId,
    });

    // Calculate the overall impact percentage for each group
    const calculateImpactStrength = (group: any) => {
        if (!group.changeImpactAssessment) return 0;
        return impactedGroupService.calculateChangeImpactStrength(group.changeImpactAssessment);
    };

    // Define columns for the table with the correct type
    const columns: MRT_ColumnDef<Record<string, unknown>>[] = [
        {
            accessorKey: 'name',
            header: 'Impacted Group',
            size: 200,
        },
        {
            accessorKey: 'roleDefinition',
            header: 'Role Definition',
            size: 200,
        },
        {
            accessorKey: 'overallImpact',
            header: 'Change Impact %',
            size: 150,
            Cell: ({ cell }) => `${cell.getValue<number>()}%`,
        },
        {
            accessorKey: 'awareness',
            header: 'Awareness',
            size: 120,
            Cell: ({ cell }) => renderMetricCell(cell.getValue<number>()),
        },
        {
            accessorKey: 'buyIn',
            header: 'Buy-in',
            size: 120,
            Cell: ({ cell }) => renderMetricCell(cell.getValue<number>()),
        },
        {
            accessorKey: 'skill',
            header: 'Skill',
            size: 120,
            Cell: ({ cell }) => renderMetricCell(cell.getValue<number>()),
        },
        {
            accessorKey: 'usage',
            header: 'Usage',
            size: 120,
            Cell: ({ cell }) => renderMetricCell(cell.getValue<number>()),
        },
        {
            accessorKey: 'proficiency',
            header: 'Proficiency',
            size: 120,
            Cell: ({ cell }) => renderMetricCell(cell.getValue<number>()),
        },
    ];

    // Helper to render color-coded metric cells
    const renderMetricCell = (value: number) => {
        const getMetricColor = (val: number) => {
            if (val >= 4) return 'rgb(74, 222, 128)'; // green
            if (val === 3) return 'rgb(250, 204, 21)'; // yellow
            return 'rgb(248, 113, 113)'; // red
        };

        return (
            <Box
                sx={{
                    backgroundColor: getMetricColor(value),
                    width: '30px',
                    height: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '4px',
                    margin: 'auto',
                    color: value >= 4 ? 'black' : 'white',
                    fontWeight: 'bold',
                }}
            >
                {value}
            </Box>
        );
    };

    // Transform API data for the table
    const transformedData: Record<string, unknown>[] = React.useMemo(() => {
        if (!data) return [];

        return data.map(group => ({
            id: group.id || 0,
            name: group.anagraphicDataDTO?.entityName || 'Unnamed Group',
            roleDefinition: group.anagraphicDataDTO?.roleDefinition || '',
            overallImpact: calculateImpactStrength(group),
            awareness: group.groupProjectABSUPDTO?.absupAwareness || 0,
            buyIn: group.groupProjectABSUPDTO?.absupBuyin || 0,
            skill: group.groupProjectABSUPDTO?.absupSkill || 0,
            usage: group.groupProjectABSUPDTO?.absupUse || 0,
            proficiency: group.groupProjectABSUPDTO?.absupProficiency || 0,
        }));
    }, [data]);

    if (isLoading) {
        return <SectionLoader message="Loading impacted groups..." />;
    }

    if (error) {
        return <div>Error: {error instanceof Error ? error.message : 'Unknown error loading groups'}</div>;
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                <Button
                    variant="contained"
                    startIcon={<Plus size={20} />}
                    href={`/projects/${projectId}/impacted-groups/new`}
                >
                    Create Impacted Group
                </Button>
            </Box>

            <DataTable
                data={transformedData}
                columns={columns}
                title="Impacted Groups"
                subtitle="Groups affected by this change project"
                enablePagination={true}
                muiTableBodyRowProps={({ row }: { row: any }) => ({
                    onClick: () => window.location.href = `/projects/${projectId}/impacted-groups/${row.original.id}`,
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

export default ImpactedGroupsTable;