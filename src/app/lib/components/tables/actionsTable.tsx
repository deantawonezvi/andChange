// src/app/lib/components/tables/actionsTable.tsx
'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Box, Button, Chip, IconButton, TextField, Tooltip, Typography } from '@mui/material';
import { Calendar, Edit, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { MRT_ColumnDef } from 'material-react-table';
import { format } from 'date-fns';
import DataTable from '@/app/lib/components/tables/dataTable';
import { SectionLoader } from '@/app/lib/components/common/pageLoader';
import ActionService from '@/app/lib/api/services/actionService';
import { useToast } from '@/app/lib/hooks/useToast';

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
    const { showToast } = useToast();
    const [nameFilter, setNameFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');

    // Fetch action plan data for the project
    const { data: actionPlan, isLoading, error, refetch } = useQuery({
        queryKey: ['actionPlan', projectId],
        queryFn: async () => {
            try {
                return await actionService.getActionPlanById(projectId);
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
                            name: slot.aoID, // We'll need to fetch the actual action name
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

    // Apply filters to the data
    const filteredData = React.useMemo(() => {
        return transformedData.filter(action => {
            const matchesName = action.name.toLowerCase().includes(nameFilter.toLowerCase());
            const matchesDate = !dateFilter || action.date.includes(dateFilter);
            return matchesName && matchesDate;
        });
    }, [transformedData, nameFilter, dateFilter]);

    // Define table columns
    const columns: MRT_ColumnDef<FlattenedAction>[] = [
        {
            accessorKey: 'name',
            header: 'Name',
            size: 200,
        },
        {
            accessorKey: 'date',
            header: 'Start Date',
            size: 120,
            Cell: ({ cell }) => formatDate(cell.getValue<string>())
        },
        {
            accessorKey: 'absupCategory',
            header: 'ABSUP Category',
            size: 150,
            Cell: ({ cell }) => renderAbsupCategory(cell.getValue<string>())
        },
        {
            accessorKey: 'receiver',
            header: 'Receiver',
            size: 150,
        },
        {
            accessorKey: 'sender',
            header: 'Sender',
            size: 150,
        },
        {
            accessorKey: 'status',
            header: 'Status',
            size: 150,
            Cell: ({ row }) => renderStatus(row.original.status, row.original.rawStatus)
        },
        {
            id: 'actions',
            header: 'Actions',
            size: 120,
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

    // Action handlers
    const handleCreateActionPlan = async () => {
        try {
            await actionService.createActionPlan({
                projectId,
                additiveProcess: false,
            });
            showToast('Action plan created successfully', 'success');
            refetch();
        } catch (err) {
            console.log(err)
            showToast('Failed to create action plan', 'error');
        }
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

    const handleGenerateActions = () => {
        // Placeholder for generate actions functionality
        console.log('Generate actions');
    };

    if (isLoading) {
        return <SectionLoader message="Loading actions..." />;
    }

    if (error) {
        return <div>Error: {error instanceof Error ? error.message : 'Unknown error loading actions'}</div>;
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                        placeholder="Filter by name"
                        size="small"
                        value={nameFilter}
                        onChange={(e) => setNameFilter(e.target.value)}
                    />
                    <TextField
                        placeholder="Filter by date (YYYY-MM-DD)"
                        size="small"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                    />
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={<Calendar size={20} />}
                        onClick={() => window.location.href = `/calendar?projectId=${projectId}`}
                    >
                        View Calendar
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<Plus size={20} />}
                        onClick={handleGenerateActions}
                    >
                        Generate Actions
                    </Button>
                </Box>
            </Box>

            {(!actionPlan || !actionPlan.id) ? (
                <Box sx={{ textAlign: 'center', my: 4 }}>
                    <Typography variant="h6" gutterBottom>No action plan exists yet for this project</Typography>
                    <Button
                        variant="contained"
                        onClick={handleCreateActionPlan}
                        sx={{ mt: 2 }}
                    >
                        Create Action Plan
                    </Button>
                </Box>
            ) : (

                <DataTable
                    data={filteredData as unknown as Record<string, unknown>[]}
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