// src/app/lib/components/tables/actionsTable.tsx
'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Box, Button, Chip, IconButton, Tooltip, Typography } from '@mui/material';
import { Edit, RotateCcw, Trash2 } from 'lucide-react';
import { MRT_ColumnDef } from 'material-react-table';
import { format } from 'date-fns';
import DataTable from '@/app/lib/components/tables/dataTable';
import { SectionLoader } from '@/app/lib/components/common/pageLoader';
import ActionService from '@/app/lib/api/services/actionService';
import GenerateActionsButton from '../forms/generateActionsButton';

interface ActionsTableProps {
    projectId: number;
}

interface FlattenedAction {
    id: number;
    name: string;
    date: string;
    absupCategory: string;
    receiver: string;
    sender: string;
    status: string;
    rawStatus: string;
    entityId?: number;
    entityType?: string;
}

const ActionsTable: React.FC<ActionsTableProps> = ({ projectId }) => {
    const actionService = ActionService.getInstance();

    const { data: actionPlan, isLoading, error, refetch } = useQuery({
        queryKey: ['actionPlan', projectId],
        queryFn: async () => {
            try {
                return await actionService.getActionPlanByProjectId(projectId);
            } catch (err) {
                console.log(err)
            }
        },
        enabled: !!projectId,
    });

    // Transform the action plan data into a flattened array for the table
    const transformedData: FlattenedAction[] = React.useMemo(() => {
        if (!actionPlan) return [];

        const flattenedActions: FlattenedAction[] = [];

        // Process impacted group actions
        if (actionPlan.impactGroupActionPlanSlotManifest) {
            Object.entries(actionPlan.impactGroupActionPlanSlotManifest).forEach(([groupId, absupCategories]) => {
                Object.entries(absupCategories).forEach(([category, slots]) => {
                    slots.forEach(slot => {
                        flattenedActions.push({
                            id: slot.id || 0,
                            name: slot.aoID,
                            date: slot.slotDate,
                            absupCategory: category,
                            receiver: 'Impacted Group',
                            sender: 'Change Manager',
                            status: actionService.getStatusInfo(slot.slotState).label,
                            rawStatus: slot.slotState,
                            entityId: parseInt(groupId),
                            entityType: 'impactedGroup'
                        });
                    });
                });
            });
        }

        // Process manager of people actions
        if (actionPlan.mopActionPlanSlotManifest) {
            Object.entries(actionPlan.mopActionPlanSlotManifest).forEach(([mopId, absupCategories]) => {
                Object.entries(absupCategories).forEach(([category, slots]) => {
                    slots.forEach(slot => {
                        flattenedActions.push({
                            id: slot.id || 0,
                            name: slot.aoID,
                            date: slot.slotDate,
                            absupCategory: category,
                            receiver: 'Manager of People',
                            sender: 'Change Manager',
                            status: actionService.getStatusInfo(slot.slotState).label,
                            rawStatus: slot.slotState,
                            entityId: parseInt(mopId),
                            entityType: 'mop'
                        });
                    });
                });
            });
        }

        // Process sponsor actions
        if (actionPlan.sponsorActionPlanSlotManifest) {
            Object.entries(actionPlan.sponsorActionPlanSlotManifest).forEach(([sponsorId, absupCategories]) => {
                Object.entries(absupCategories).forEach(([category, slots]) => {
                    slots.forEach(slot => {
                        flattenedActions.push({
                            id: slot.id || 0,
                            name: slot.aoID,
                            date: slot.slotDate,
                            absupCategory: category,
                            receiver: 'Sponsor',
                            sender: 'Change Manager',
                            status: actionService.getStatusInfo(slot.slotState).label,
                            rawStatus: slot.slotState,
                            entityId: parseInt(sponsorId),
                            entityType: 'sponsor'
                        });
                    });
                });
            });
        }

        // Process health actions
        if (actionPlan.pctHealthActionPlanSlotManifest) {
            Object.entries(actionPlan.pctHealthActionPlanSlotManifest).forEach(([category, slots]) => {
                slots.forEach(slot => {
                    flattenedActions.push({
                        id: slot.id || 0,
                        name: slot.aoID,
                        date: slot.slotDate,
                        absupCategory: category,
                        receiver: 'Project',
                        sender: 'Change Manager',
                        status: actionService.getStatusInfo(slot.slotState).label,
                        rawStatus: slot.slotState,
                        entityType: 'project'
                    });
                });
            });
        }

        // Process hygiene actions
        if (actionPlan.hygieneActions) {
            actionPlan.hygieneActions.forEach(slot => {
                flattenedActions.push({
                    id: slot.id || 0,
                    name: slot.aoID,
                    date: slot.slotDate,
                    absupCategory: 'Hygiene',
                    receiver: 'Project',
                    sender: 'Change Manager',
                    status: actionService.getStatusInfo(slot.slotState).label,
                    rawStatus: slot.slotState,
                    entityType: 'hygiene'
                });
            });
        }

        // Sort by date
        return flattenedActions.sort((a, b) => {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
    }, [actionPlan]);


    // Define table columns
    const columns: MRT_ColumnDef<FlattenedAction>[] = [
        {
            accessorKey: 'date',
            header: 'Start Date',
            size: 120,
            Cell: ({ cell }) => formatDate(cell.getValue<string>()),
            enableColumnFilter: true,
        },
        {
            accessorKey: 'absupCategory',
            header: 'ABSUP Category',
            size: 150,
            Cell: ({ cell }) => renderAbsupCategory(cell.getValue<string>()),
            enableColumnFilter: true,
        },
        {
            accessorKey: 'receiver',
            header: 'Receiver',
            size: 150,
            enableColumnFilter: true,
        },
        {
            accessorKey: 'sender',
            header: 'Sender',
            size: 150,
            enableColumnFilter: true,
        },
        {
            accessorKey: 'status',
            header: 'Status',
            size: 150,
            Cell: ({ row }) => renderStatus(row.original.status, row.original.rawStatus),
            enableColumnFilter: true,
        },
        {
            id: 'actions',
            header: 'Actions',
            size: 120,
            enableColumnFilter: false,
            Cell: ({ row }) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Edit">
                        <IconButton onClick={() => handleEditAction(row.original.id)}>
                            <Edit size={18} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton onClick={() => handleDeleteAction(row.original.id)}>
                            <Trash2 size={18} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="View History">
                        <IconButton onClick={() => handleViewHistory(row.original.id)}>
                            <RotateCcw size={18} />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        },
    ];

    // Helper functions
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return format(date, 'yyyy-MM-dd');
    };

    const renderAbsupCategory = (category: string) => {
        const categoryColors: Record<string, string> = {
            'AWARENESS': '#2196f3',
            'BUYIN': '#ff9800',
            'SKILL': '#4caf50',
            'USE': '#9c27b0',
            'PROFICIENCY': '#f44336',
            'Hygiene': '#795548',
        };

        return (
            <Chip
                label={category}
                size="small"
                sx={{
                    backgroundColor: categoryColors[category] || '#9e9e9e',
                    color: 'white'
                }}
            />
        );
    };

    const renderStatus = (status: string, rawStatus: string) => {
        const statusInfo = actionService.getStatusInfo(rawStatus);
        return (
            <Chip
                label={status}
                size="small"
                sx={{
                    backgroundColor: statusInfo.color,
                    color: 'white'
                }}
            />
        );
    };


    const handleEditAction = (actionId: number) => {
        // Placeholder for edit functionality
        console.log('Edit action', actionId);
    };

    const handleDeleteAction = (actionId: number) => {
        // Placeholder for delete functionality
        console.log('Delete action', actionId);
    };

    const handleViewHistory = (actionId: number) => {
        // Placeholder for view history functionality
        console.log('View history for action', actionId);
    };


    if (isLoading) {
        return <SectionLoader message="Loading actions..." />;
    }

    if (error) {
        return (
            <Box sx={{
                p: 4,
                border: '1px solid #ffe0e0',
                borderRadius: 2,
                bgcolor: '#fff5f5',
                textAlign: 'center',
                my: 2
            }}>
                <Typography variant="h6" color="error" gutterBottom>
                    Error Loading Action Plan
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                    {error instanceof Error
                        ? error.message
                        : 'There was a problem retrieving the action plan. Please try again.'}
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => refetch()}
                    startIcon={<RotateCcw size={18} />}
                    sx={{ mt: 1 }}
                >
                    Retry
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <GenerateActionsButton
                        projectId={projectId}
                    />
                </Box>
            </Box>

            {(!actionPlan || !actionPlan.id) ? (
                <Box sx={{ textAlign: 'center', my: 4 }}>
                    <Typography variant="h6" gutterBottom>No action plan exists yet for this project</Typography>
                    <GenerateActionsButton
                        projectId={projectId}
                    />
                </Box>
            ) : (
                <DataTable
                    data={transformedData as unknown as Record<string, unknown>[]}
                    columns={columns as unknown as MRT_ColumnDef<Record<string, unknown>, unknown>[]}
                    title="Project Actions"
                    subtitle="All planned and scheduled actions for this project"
                    enablePagination={true}
                />
            )}
        </Box>
    );
};

export default ActionsTable;