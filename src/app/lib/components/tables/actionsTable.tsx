'use client';

import React, { useState } from 'react';
import { useQueries, useQuery } from '@tanstack/react-query';
import {
    Box,
    Button,
    Chip,
    IconButton,
    Skeleton,
    Stack,
    Tab,
    Tabs,
    TextField,
    Tooltip,
    Typography
} from '@mui/material';
import { Edit, Heart, RotateCcw, Shield, Shuffle, Trash2, Users } from 'lucide-react';
import { MRT_ColumnDef } from 'material-react-table';
import { format, isValid, isWithinInterval, parseISO } from 'date-fns';
import DataTable from '@/app/lib/components/tables/dataTable';
import { SectionLoader } from '@/app/lib/components/common/pageLoader';
import ActionService from '@/app/lib/api/services/actionService';
import { ImpactedGroupService } from '@/app/lib/api/services/impactedGroupService';
import GenerateActionsButton from '../forms/generateActionsButton';
import MOPService from "@/app/lib/api/services/mopService";
import SponsorService from "@/app/lib/api/services/sponsorService";
import { useToast } from '@/app/lib/hooks/useToast';
import EditActionDateDialog from "@/app/lib/components/forms/editActionDateDialog";
import ActionContentDialog from "@/app/lib/components/forms/actionContentDialog";
import AlternativeActionsModal from '../forms/alternativeActionsModal';

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
    actionId?: number;
    verb?: string;
    actionName?: string;
    slotId?: number;
    associatedEntityId?: number;
    whoReceiver?: string;
    whoSender?: string;
    stateTarget?: string;
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}


const DateRangeFilter: React.FC<{
    column: any;
    table: any;
}> = ({ column }) => {
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    const handleFilter = () => {
        if (startDate && endDate) {
            
            column.setFilterValue([startDate, endDate]);
        } else {
            column.setFilterValue(undefined);
        }
    };

    const handleClear = () => {
        setStartDate('');
        setEndDate('');
        column.setFilterValue(undefined);
    };

    return (
        <Stack spacing={1} sx={{ minWidth: 200, p: 1 }}>
            <TextField
                label="Start Date"
                type="date"
                size="small"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <TextField
                label="End Date"
                type="date"
                size="small"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <Stack direction="row" spacing={1}>
                <Button
                    size="small"
                    variant="contained"
                    onClick={handleFilter}
                    disabled={!startDate || !endDate}
                >
                    Apply
                </Button>
                <Button
                    size="small"
                    variant="outlined"
                    onClick={handleClear}
                >
                    Clear
                </Button>
            </Stack>
        </Stack>
    );
};

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
    const { showToast } = useToast();

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedActionForEdit, setSelectedActionForEdit] = useState<{
        id: number;
        slotId?: number;
        date: string;
        name: string;
        entityName?: string;
    } | null>(null);

    const [contentDialogOpen, setContentDialogOpen] = useState(false);
    const [selectedActionForContent, setSelectedActionForContent] = useState<{
        id: number;
        slotId?: number;
        name: string;
        actionName?: string;
        date: string;
        entityName?: string;
        entityType?: string;
        stateTarget?: string;
        status?: string;
    } | null>(null);

    const [alternativeActionsOpen, setAlternativeActionsOpen] = useState(false);
    const [selectedSlotForAlternatives, setSelectedSlotForAlternatives] = useState<{
        slotId: number;
        date: string;
        absupCategory: string;
        sender: string;
        receiver: string;
    } | null>(null);


    const handleEditAction = (actionId: number) => {
        const actionToEdit = enhancedGroupActions.find(action => action.id === actionId);

        if (!actionToEdit) {
            showToast('Action not found', 'error');
            return;
        }

        // Check if this action has a slot ID (required for editing)
        if (!actionToEdit.slotId) {
            showToast('This action cannot be edited - no slot ID available', 'warning');
            return;
        }

        setSelectedActionForEdit({
            id: actionToEdit.id,
            slotId: actionToEdit.slotId,
            date: actionToEdit.date,
            name: actionToEdit.actionName || actionToEdit.name,
            entityName: actionToEdit.entityName
        });
        setEditDialogOpen(true);
    };

    const handleCloseEditDialog = () => {
        setEditDialogOpen(false);
        setSelectedActionForEdit(null);
    };

    const handleActionClick = (actionId: number) => {
        const actionToView = enhancedGroupActions.find(action => action.id === actionId);

        if (!actionToView) {
            showToast('Action not found', 'error');
            return;
        }

        setSelectedActionForContent({
            id: actionToView.id,
            slotId: actionToView.slotId,
            name: actionToView.name,
            actionName: actionToView.actionName,
            date: actionToView.date,
            entityName: actionToView.entityName,
            entityType: actionToView.entityType,
            stateTarget: actionToView.stateTarget,
            status: actionToView.status
        });
        setContentDialogOpen(true);
    };

    const handleCloseContentDialog = () => {
        setContentDialogOpen(false);
        setSelectedActionForContent(null);
    };

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


    
    const { groupActions, hygieneActions, healthActions } = React.useMemo(() => {
        if (!actionPlan) return { groupActions: [], hygieneActions: [], healthActions: [] };

        const groupActions: FlattenedAction[] = [];
        const hygieneActions: FlattenedAction[] = [];
        const healthActions: FlattenedAction[] = [];

        
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
                            entityName: `Group ${groupId}`,
                            actionId: slot.actionId,
                            slotId: slot.id,
                            stateTarget: category
                        });
                    });
                });
            });
        }

        
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
                            entityName: `MOP ${mopId}`,
                            actionId: slot.actionId,
                            slotId: slot.id,
                            stateTarget: category
                        });
                    });
                });
            });
        }

        
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
                            entityName: `Sponsor ${sponsorId}`,
                            actionId: slot.actionId,
                            slotId: slot.id,
                            stateTarget: category
                        });
                    });
                });
            });
        }

        
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
                        entityName: 'Project Health',
                        actionId: slot.actionId
                    });
                });
            });
        }

        
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
                    entityName: 'Project Hygiene',
                    actionId: slot.actionId
                });
            });
        }

        
        const sortByDate = (a: FlattenedAction, b: FlattenedAction) =>
            new Date(a.date).getTime() - new Date(b.date).getTime();

        return {
            groupActions: groupActions.sort(sortByDate),
            hygieneActions: hygieneActions.sort(sortByDate),
            healthActions: healthActions.sort(sortByDate)
        };
    }, [actionPlan, actionService]);

    
    const groupActionSlotQueries = useQueries({
        queries: groupActions.map(action => ({
            queryKey: ['actionSlotDetails', action.slotId],
            queryFn: () => actionService.getActionPlanSlotById(action.slotId!),
            enabled: !!action.slotId && activeTab === 0,
            staleTime: 5 * 60 * 1000,
        })),
    });

    const groupActionQueries = useQueries({
        queries: groupActions.map(action => ({
            queryKey: ['actionDetails', action.actionId],
            queryFn: () => actionService.getActionById(action.actionId!),
            enabled: !!action.actionId && activeTab === 0,
            staleTime: 5 * 60 * 1000,
        })),
    });

    const groupEntityQueries = useQueries({
        queries: groupActions.map(action => ({
            queryKey: ['entityDetails', action.entityType, action.entityId],
            queryFn: async () => {
                const slotDetails = groupActionSlotQueries[groupActions.indexOf(action)]?.data;
                if (!slotDetails) return null;

                let entityId = null;
                let entityType = '';

                if (slotDetails.associatedImpactedGroupId) {
                    entityId = slotDetails.associatedImpactedGroupId;
                    entityType = 'impactedGroup';
                } else if (slotDetails.associatedMOPId) {
                    entityId = slotDetails.associatedMOPId;
                    entityType = 'mop';
                } else if (slotDetails.associatedSponsorId) {
                    entityId = slotDetails.associatedSponsorId;
                    entityType = 'sponsor';
                }

                if (!entityId) return null;

                const igService = ImpactedGroupService.getInstance();
                const mopService = MOPService.getInstance();
                const sponsorService = SponsorService.getInstance();

                try {
                    switch (entityType) {
                        case 'impactedGroup':
                            return { data: await igService.getImpactedGroupById(entityId), type: 'impactedGroup' };
                        case 'mop':
                            return { data: await mopService.getMOPById(entityId), type: 'mop' };
                        case 'sponsor':
                            return { data: await sponsorService.getSponsorById(entityId), type: 'sponsor' };
                        default:
                            return null;
                    }
                } catch (error) {
                    console.error(`Failed to fetch ${entityType} with ID ${entityId}:`, error);
                    return null;
                }
            },
            enabled: !!action.slotId && activeTab === 0 && !!groupActionSlotQueries[groupActions.indexOf(action)]?.data,
            staleTime: 5 * 60 * 1000,
        })),
    });

    const enhancedGroupActions = React.useMemo(() => {
        return groupActions.map((action, index) => {
            const slotDetails = groupActionSlotQueries[index]?.data;
            const actionDetails = groupActionQueries[index]?.data;
            const entityDetails = groupEntityQueries[index]?.data;

            const mapWhoCode = (code: string) => {
                const whoMapping: Record<string, string> = {
                    'E_IG': 'E_IG',
                    'E_MOP': 'E_MOP',
                    'E_SP': 'E_SP',
                    'E_CM': 'E_CM',
                    'MULTIPLE': 'MULTIPLE',
                    'AUTHOR': 'AUTHOR'
                };
                return whoMapping[code] || code;
            };

            const verb = actionDetails?.actionCore?.actionVerb?.verbName || ''

            return {
                ...action,
                entityName: entityDetails?.data?.anagraphicDataDTO?.entityName || action.entityName,
                actionName: `${verb} ${actionDetails?.actionCore?.actionName || action.name}`,
                whoReceiver: slotDetails ? mapWhoCode(slotDetails.whoReceiver) : action.receiver,
                whoSender: slotDetails ? slotDetails.whoSenderName : action.sender,
                stateTarget: slotDetails?.absuptargeted || action.absupCategory,
                entityType: entityDetails?.type || action.entityType
            };
        });
    }, [groupActions, groupActionSlotQueries, groupActionQueries, groupEntityQueries]);

    
    const hygieneActionQueries = useQueries({
        queries: hygieneActions.map(action => ({
            queryKey: ['actionDetails', action.actionId],
            queryFn: () => actionService.getActionById(action.actionId!),
            enabled: !!action.actionId && activeTab === 1,
            staleTime: 5 * 60 * 1000,
        })),
    });

    const enhancedHygieneActions = React.useMemo(() => {
        return hygieneActions.map((action, index) => {
            const actionDetails = hygieneActionQueries[index]?.data;
            return {
                ...action,
                verb: actionDetails?.actionCore?.actionVerb?.verbName || 'Loading...',
                actionName: actionDetails?.actionCore?.actionName || action.name,
            };
        });
    }, [hygieneActions, hygieneActionQueries]);

    const entityNameOptions = React.useMemo(() => {
        const uniqueNames = [...new Set(
            enhancedGroupActions
                .map(action => action.entityName)
                .filter(name => name && name !== 'N/A' && name !== 'Loading...')
        )].sort();

        return uniqueNames.map(name => ({
            label: name,
            value: name
        }));
    }, [enhancedGroupActions])


    const handleRerollContent = (action: FlattenedAction) => {
        if (!action.slotId) {
            showToast('Invalid slot ID', 'error');
            return;
        }

        setSelectedSlotForAlternatives({
            slotId: action.slotId,
            date: action.date,
            absupCategory: action.stateTarget || action.absupCategory,
            sender: action.whoSender || action.sender,
            receiver: action.whoReceiver || action.receiver
        });
        setAlternativeActionsOpen(true);
    };

    const handleCloseAlternativeActions = () => {
        setAlternativeActionsOpen(false);
        setSelectedSlotForAlternatives(null);
    };


    const renderRerollButton = (action: FlattenedAction) => {
        return (
            <Tooltip title="View Alternative Actions">
                <IconButton
                    onClick={() => handleRerollContent(action)}
                    disabled={!action.slotId}
                    size="small"
                >
                    <Shuffle size={16} />
                </IconButton>
            </Tooltip>
        );
    }

    
    const dateRangeFilterFn = (row: any, id: string, filterValue: any) => {
        if (!filterValue || !Array.isArray(filterValue) || filterValue.length !== 2) {
            return true;
        }

        const [startDate, endDate] = filterValue;
        const rowDate = row.getValue(id);

        if (!rowDate || !startDate || !endDate) {
            return true;
        }

        try {
            const actionDate = parseISO(rowDate);
            const start = parseISO(startDate);
            const end = parseISO(endDate);

            if (!isValid(actionDate) || !isValid(start) || !isValid(end)) {
                return true;
            }

            return isWithinInterval(actionDate, { start, end });
        } catch (error) {
            console.error('Error filtering date:', error);
            return true;
        }
    };

    
    const groupColumns: MRT_ColumnDef<FlattenedAction>[] = [
        {
            accessorKey: 'entityName',
            header: 'NAME',
            size: 150,
            enableColumnFilter: true,
            filterVariant: 'select',
            filterSelectOptions: entityNameOptions,
            Cell: ({ row }) => {
                const isLoading = groupEntityQueries.some(query => query.isLoading);
                return isLoading ? <Skeleton width={150} animation="wave" /> : (row.original.entityName || 'N/A');
            }
        },
        {
            accessorKey: 'entityType',
            header: 'TYPE',
            size: 150,
            enableColumnFilter: true,
            filterVariant: 'select',
            filterSelectOptions: [
                { label: 'Impacted Group', value: 'impactedGroup' },
                { label: 'MOP', value: 'mop' },
                { label: 'Sponsor', value: 'sponsor' }
            ],
            Cell: ({ row }) => {
                const typeMapping: Record<string, string> = {
                    'impactedGroup': 'Impacted Group',
                    'mop': 'MOP',
                    'sponsor': 'Sponsor'
                };
                return typeMapping[row.original.entityType || ''] || row.original.entityType;
            }
        },
        {
            accessorKey: 'actionName',
            header: 'ACTION',
            size: 400,
            enableColumnFilter: true,
            Cell: ({ row }) => {
                const isLoading = groupActionQueries.some(query => query.isLoading);
                const actionName = row.original.actionName || row.original.name;

                return isLoading ? <Skeleton width={150} animation="wave" /> : (
                    <Box
                        sx={{
                            cursor: 'pointer',
                            color: 'primary.main',
                            fontWeight:'bold',
                            '&:hover': {
                                color: 'primary.dark'
                            }
                        }}
                        onClick={() => handleActionClick(row.original.id)}
                    >
                        {actionName}
                    </Box>
                );
            }
        },
        {
            accessorKey: 'date',
            header: 'DATE',
            size: 150,
            Cell: ({ cell }) => formatDate(cell.getValue<string>()),
            enableColumnFilter: true,
            Filter: DateRangeFilter,
            filterFn: dateRangeFilterFn,
        },
        {
            accessorKey: 'status',
            header: 'STATUS',
            size: 120,
            Cell: ({ row }) => renderStatus(row.original.status, row.original.rawStatus),
            enableColumnFilter: true,
        },
        {
            accessorKey: 'whoSender',
            header: 'SENDER',
            size: 100,
            enableColumnFilter: true,
            Cell: ({ row }) => {
                const isLoading = groupActionSlotQueries.some(query => query.isLoading);
                return isLoading ? <Skeleton width={150} animation="wave" /> : (row.original.whoSender || 'N/A');
            }
        },
        {
            accessorKey: 'stateTarget',
            header: 'STATE TARGET',
            size: 120,
            enableColumnFilter: true,
            filterVariant: 'select',
            filterSelectOptions: [
                { label: 'AWARENESS', value: 'AWARENESS' },
                { label: 'BUYIN', value: 'BUYIN' },
                { label: 'SKILL', value: 'SKILL' },
                { label: 'USE', value: 'USE' },
                { label: 'PROFICIENCY', value: 'PROFICIENCY' }
            ],
            Cell: ({ row }) => renderAbsupCategory(row.original.stateTarget || row.original.absupCategory),
        },
        {
            id: 'actions',
            header: 'ACTIONS',
            size: 100,
            enableColumnFilter: false,
            Cell: ({ row }) => (
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {renderRerollButton(row.original)}
                    <Tooltip title="Edit">
                        <IconButton onClick={() => handleEditAction(row.original.id)} size="small">
                            <Edit size={16} />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        },

    ];

    const hygieneColumns: MRT_ColumnDef<FlattenedAction>[] = [
        {
            accessorKey: 'verb',
            header: 'VERB',
            size: 120,
            enableColumnFilter: true,
            Cell: ({ row }) => {
                const isLoading = hygieneActionQueries.some(query => query.isLoading);
                return isLoading ? <Skeleton width={150} animation="wave" /> : (row.original.verb || 'N/A');
            }
        },
        {
            accessorKey: 'actionName',
            header: 'ACTION',
            size: 400,
            enableColumnFilter: true,
            Cell: ({ row }) => {
                const isLoading = hygieneActionQueries.some(query => query.isLoading);
                return isLoading ? <Skeleton width={150} animation="wave" /> : (row.original.actionName || row.original.name);
            }
        },
        {
            accessorKey: 'date',
            header: 'DATE',
            size: 120,
            Cell: ({ cell }) => formatDate(cell.getValue<string>()),
            enableColumnFilter: true,
        },
    ];

    
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



    const handleDeleteAction = (actionId: number) => {
        console.log('Delete action', actionId);
    };

    const handleViewHistory = (actionId: number) => {
        console.log('View history for action', actionId);
    };

    
    const getTabCounts = () => ({
        groups: enhancedGroupActions.length,
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
                        Project Actions
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <GenerateActionsButton projectId={projectId} />
                </Box>
            </Box>

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={activeTab} onChange={handleTabChange} aria-label="action plan tabs" variant="scrollable">
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
                    data={enhancedGroupActions as unknown as Record<string, unknown>[]}
                    columns={groupColumns as unknown as MRT_ColumnDef<Record<string, unknown>, unknown>[]}
                    title="Group Actions"
                    subtitle="Actions targeting impacted groups, managers, and sponsors"
                    enablePagination={true}
                />

                <EditActionDateDialog
                    open={editDialogOpen}
                    onClose={handleCloseEditDialog}
                    action={selectedActionForEdit}
                    projectId={projectId}
                />

                <ActionContentDialog
                    open={contentDialogOpen}
                    onClose={handleCloseContentDialog}
                    action={selectedActionForContent}
                />
            </TabPanel>

            <TabPanel value={activeTab} index={1}>
                <DataTable
                    data={enhancedHygieneActions as unknown as Record<string, unknown>[]}
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
            <AlternativeActionsModal
                open={alternativeActionsOpen}
                onClose={handleCloseAlternativeActions}
                slotId={selectedSlotForAlternatives?.slotId || 0}
                currentAction={selectedSlotForAlternatives ? {
                    date: selectedSlotForAlternatives.date,
                    absupCategory: selectedSlotForAlternatives.absupCategory,
                    sender: selectedSlotForAlternatives.sender,
                    receiver: selectedSlotForAlternatives.receiver
                } : undefined}
                projectId={projectId}
            />
        </Box>

    );
};

export default ActionsTable;