'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Box, Button, Chip, IconButton, Tab, Tabs, Tooltip, Typography } from '@mui/material';
import { Edit, RotateCcw, Trash2, Users, Shield, Heart } from 'lucide-react';
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
    entityName?: string;
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`actions-tabpanel-${index}`}
            aria-labelledby={`actions-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ py: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
};

const ActionsTable: React.FC<ActionsTableProps> = ({ projectId }) => {
    const [activeTab, setActiveTab] = useState(0);
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

    // Transform data into separate categories
    const { groupActions, hygieneActions, healthActions } = React.useMemo(() => {
        if (!actionPlan) return { groupActions: [], hygieneActions: [], healthActions: [] };

        const groupActions: FlattenedAction[] = [];
        const hygieneActions: FlattenedAction[] = [];
        const healthActions: FlattenedAction[] = [];

        // Process Impacted Group Actions
        if (actionPlan.impactGroupActionPlanSlotManifest) {
            Object.entries(actionPlan.impactGroupActionPlanSlotManifest).forEach(([groupId, absupCategories]) => {
                Object.entries(absupCategories).forEach(([category, slots]) => {
                    slots.forEach(slot => {
                        groupActions.push({
                            id: slot.id || 0,
                            name: slot.aoID,
                            date: slot.slotDate,
                            absupCategory: category,
                            receiver: 'Impacted Group',
                            sender: 'Change Manager',
                            status: actionService.getStatusInfo(slot.slotState).label,
                            rawStatus: slot.slotState,
                            entityId: parseInt(groupId),
                            entityType: 'impactedGroup',
                            entityName: `Group ${groupId}`
                        });
                    });
                });
            });
        }

        // Process Manager of People Actions
        if (actionPlan.mopActionPlanSlotManifest) {
            Object.entries(actionPlan.mopActionPlanSlotManifest).forEach(([mopId, absupCategories]) => {
                Object.entries(absupCategories).forEach(([category, slots]) => {
                    slots.forEach(slot => {
                        groupActions.push({
                            id: slot.id || 0,
                            name: slot.aoID,
                            date: slot.slotDate,
                            absupCategory: category,
                            receiver: 'Manager of People',
                            sender: 'Change Manager',
                            status: actionService.getStatusInfo(slot.slotState).label,
                            rawStatus: slot.slotState,
                            entityId: parseInt(mopId),
                            entityType: 'mop',
                            entityName: `MOP ${mopId}`
                        });
                    });
                });
            });
        }

        // Process Sponsor Actions
        if (actionPlan.sponsorActionPlanSlotManifest) {
            Object.entries(actionPlan.sponsorActionPlanSlotManifest).forEach(([sponsorId, absupCategories]) => {
                Object.entries(absupCategories).forEach(([category, slots]) => {
                    slots.forEach(slot => {
                        groupActions.push({
                            id: slot.id || 0,
                            name: slot.aoID,
                            date: slot.slotDate,
                            absupCategory: category,
                            receiver: 'Sponsor',
                            sender: 'Change Manager',
                            status: actionService.getStatusInfo(slot.slotState).label,
                            rawStatus: slot.slotState,
                            entityId: parseInt(sponsorId),
                            entityType: 'sponsor',
                            entityName: `Sponsor ${sponsorId}`
                        });
                    });
                });
            });
        }

        // Process PCT Health Actions
        if (actionPlan.pctHealthActionPlanSlotManifest) {
            Object.entries(actionPlan.pctHealthActionPlanSlotManifest).forEach(([category, slots]) => {
                slots.forEach(slot => {
                    healthActions.push({
                        id: slot.id || 0,
                        name: slot.aoID,
                        date: slot.slotDate,
                        absupCategory: category,
                        receiver: 'Project Team',
                        sender: 'Change Manager',
                        status: actionService.getStatusInfo(slot.slotState).label,
                        rawStatus: slot.slotState,
                        entityType: 'project',
                        entityName: 'Project Health'
                    });
                });
            });
        }

        // Process Hygiene Actions
        if (actionPlan.hygieneActions) {
            actionPlan.hygieneActions.forEach(slot => {
                hygieneActions.push({
                    id: slot.id || 0,
                    name: slot.aoID,
                    date: slot.slotDate,
                    absupCategory: 'Hygiene',
                    receiver: 'Project Team',
                    sender: 'Change Manager',
                    status: actionService.getStatusInfo(slot.slotState).label,
                    rawStatus: slot.slotState,
                    entityType: 'hygiene',
                    entityName: 'Project Hygiene'
                });
            });
        }

        // Sort all arrays by date
        const sortByDate = (a: FlattenedAction, b: FlattenedAction) =>
            new Date(a.date).getTime() - new Date(b.date).getTime();

        return {
            groupActions: groupActions.sort(sortByDate),
            hygieneActions: hygieneActions.sort(sortByDate),
            healthActions: healthActions.sort(sortByDate)
        };
    }, [actionPlan, actionService]);

    // Common column definitions for Groups table
    const groupColumns: MRT_ColumnDef<FlattenedAction>[] = [
        {
            accessorKey: 'date',
            header: 'Start Date',
            size: 120,
            Cell: ({ cell }) => formatDate(cell.getValue<string>()),
            enableColumnFilter: true,
        },
        {
            accessorKey: 'entityName',
            header: 'Target Group',
            size: 150,
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
            Cell: ({ row }) => renderActionButtons(row.original.id),
        },
    ];

    // Column definitions for Hygiene table
    const hygieneColumns: MRT_ColumnDef<FlattenedAction>[] = [
        {
            accessorKey: 'verb',
            header: 'Verb',
            size: 150,
            enableColumnFilter: true,
        },
        {
            accessorKey: 'action',
            header: 'Action',
            size: 200,
            enableColumnFilter: true,
        },
        {
            accessorKey: 'date',
            header: 'Date',
            size: 120,
            Cell: ({ cell }) => formatDate(cell.getValue<string>()),
            enableColumnFilter: true,
        },

    ];

    // Column definitions for Health table
    const healthColumns: MRT_ColumnDef<FlattenedAction>[] = [
        {
            accessorKey: 'date',
            header: 'Start Date',
            size: 120,
            Cell: ({ cell }) => formatDate(cell.getValue<string>()),
            enableColumnFilter: true,
        },
        {
            accessorKey: 'name',
            header: 'Health Check',
            size: 200,
            enableColumnFilter: true,
        },
        {
            accessorKey: 'absupCategory',
            header: 'Category',
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
            Cell: ({ row }) => renderActionButtons(row.original.id),
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

    const renderActionButtons = (actionId: number) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Edit">
                <IconButton onClick={() => handleEditAction(actionId)}>
                    <Edit size={18} />
                </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
                <IconButton onClick={() => handleDeleteAction(actionId)}>
                    <Trash2 size={18} />
                </IconButton>
            </Tooltip>
            <Tooltip title="View History">
                <IconButton onClick={() => handleViewHistory(actionId)}>
                    <RotateCcw size={18} />
                </IconButton>
            </Tooltip>
        </Box>
    );

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const handleEditAction = (actionId: number) => {
        console.log('Edit action', actionId);
    };

    const handleDeleteAction = (actionId: number) => {
        console.log('Delete action', actionId);
    };

    const handleViewHistory = (actionId: number) => {
        console.log('View history for action', actionId);
    };

    // Get counts for tab labels
    const getTabCounts = () => ({
        groups: groupActions.length,
        hygiene: hygieneActions.length,
        health: healthActions.length
    });

    const tabCounts = getTabCounts();

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

    if (!actionPlan || !actionPlan.id) {
        return (
            <Box sx={{ textAlign: 'center', my: 4 }}>
                <Typography variant="h6" gutterBottom>
                    No action plan exists yet for this project
                </Typography>
                <GenerateActionsButton projectId={projectId} />
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%' }}>
            {/* Header with Generate Actions Button */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Typography variant="h5" component="h2">
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <GenerateActionsButton projectId={projectId} />
                </Box>
            </Box>

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={activeTab} onChange={handleTabChange} aria-label="action plan tabs"   variant="scrollable"
                >
                    <Tab
                        id="actions-tab-0"
                        aria-controls="actions-tabpanel-0"

                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {<Users size={20} color="#e85d45" />}
                                {`Groups (${tabCounts.groups})`}
                            </Box>
                        }
                    />
                    <Tab
                        id="actions-tab-1"
                        aria-controls="actions-tabpanel-1"
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {<Shield size={20} color="#e85d45" />}
                                {`Hygiene (${tabCounts.hygiene})`}
                            </Box>
                        }
                    />
                    <Tab
                        id="actions-tab-2"
                        aria-controls="actions-tabpanel-2"
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {<Heart size={20} color="#e85d45" />}
                                {`Health (${tabCounts.health})`}
                            </Box>
                        }
                    />
                </Tabs>
            </Box>

            {/* Tab Panels */}
            <TabPanel value={activeTab} index={0}>
                <DataTable
                    data={groupActions as unknown as Record<string, unknown>[]}
                    columns={groupColumns as unknown as MRT_ColumnDef<Record<string, unknown>, unknown>[]}
                    title="Group Actions"
                    subtitle="Actions targeting impacted groups, managers, and sponsors"
                    enablePagination={true}
                />
            </TabPanel>

            <TabPanel value={activeTab} index={1}>
                <DataTable
                    data={hygieneActions as unknown as Record<string, unknown>[]}
                    columns={hygieneColumns as unknown as MRT_ColumnDef<Record<string, unknown>, unknown>[]}
                    title="Hygiene Actions"
                    subtitle="General maintenance and hygiene activities"
                    enablePagination={true}
                />
            </TabPanel>

            <TabPanel value={activeTab} index={2}>
                <DataTable
                    data={healthActions as unknown as Record<string, unknown>[]}
                    columns={healthColumns as unknown as MRT_ColumnDef<Record<string, unknown>, unknown>[]}
                    title="Health Actions"
                    subtitle="Project health checks and assessments"
                    enablePagination={true}
                />
            </TabPanel>
        </Box>
    );
};

export default ActionsTable;