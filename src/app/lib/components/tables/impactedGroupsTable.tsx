import React, { useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Info, Plus } from 'lucide-react';

interface ImpactedGroup {
    id: number;
    name: string;
    overallChange: number;
    awareness: number;
    buyIn: number;
    skills: number;
    usage: number;
    proficiency: number;
}

const getMetricColor = (value: number) => {
    if (value >= 4) return 'rgb(74, 222, 128)'; // green
    if (value === 3) return 'rgb(250, 204, 21)'; // yellow
    return 'rgb(248, 113, 113)'; // red
};

const MetricCell = ({ value }: { value: number }) => (
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

const ImpactedGroupsTable = () => {
    const [groups, setGroups] = useState<ImpactedGroup[]>([
        {
            id: 1,
            name: 'Marketing Team',
            overallChange: 75,
            awareness: 4,
            buyIn: 3,
            skills: 2,
            usage: 4,
            proficiency: 3,
        },
        {
            id: 2,
            name: 'IT Department',
            overallChange: 90,
            awareness: 5,
            buyIn: 4,
            skills: 5,
            usage: 3,
            proficiency: 4,
        },
    ]);
    const [openDialog, setOpenDialog] = useState(false);
    const [newGroup, setNewGroup] = useState({
        name: '',
        overallChange: 0,
    });

    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: 'Impacted Group',
            flex: 2,
            renderHeader: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {params.colDef.headerName}
                    <Tooltip title="Groups affected by the change">
                        <IconButton size="small">
                            <Info size={16} />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        },
        {
            field: 'overallChange',
            headerName: 'Overall Change %',
            flex: 1,
            renderCell: (params) => (
                <Typography>
                    {params.value}%
                </Typography>
            ),
        },
        {
            field: 'awareness',
            headerName: 'Awareness',
            flex: 1,
            renderHeader: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {params.colDef.headerName}
                    <Tooltip title="Level of awareness about the change">
                        <IconButton size="small">
                            <Info size={16} />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
            renderCell: (params) => <MetricCell value={params.value} />,
        },
        {
            field: 'buyIn',
            headerName: 'Buy-in',
            flex: 1,
            renderHeader: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {params.colDef.headerName}
                    <Tooltip title="Level of support for the change">
                        <IconButton size="small">
                            <Info size={16} />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
            renderCell: (params) => <MetricCell value={params.value} />,
        },
        {
            field: 'skills',
            headerName: 'Skills',
            flex: 1,
            renderHeader: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {params.colDef.headerName}
                    <Tooltip title="Required skills level">
                        <IconButton size="small">
                            <Info size={16} />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
            renderCell: (params) => <MetricCell value={params.value} />,
        },
        {
            field: 'usage',
            headerName: 'Usage',
            flex: 1,
            renderHeader: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {params.colDef.headerName}
                    <Tooltip title="Actual usage of new processes/systems">
                        <IconButton size="small">
                            <Info size={16} />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
            renderCell: (params) => <MetricCell value={params.value} />,
        },
        {
            field: 'proficiency',
            headerName: 'Proficiency',
            flex: 1,
            renderHeader: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {params.colDef.headerName}
                    <Tooltip title="Level of expertise in new processes/systems">
                        <IconButton size="small">
                            <Info size={16} />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
            renderCell: (params) => <MetricCell value={params.value} />,
        },
    ];

    const handleAddGroup = () => {
        const newId = Math.max(...groups.map(g => g.id)) + 1;
        setGroups([...groups, {
            id: newId,
            name: newGroup.name,
            overallChange: newGroup.overallChange,
            awareness: 1,
            buyIn: 1,
            skills: 1,
            usage: 1,
            proficiency: 1,
        }]);
        setOpenDialog(false);
        setNewGroup({ name: '', overallChange: 0 });
    };

    return (
        <Box sx={{ height: 400, width: '100%' }}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">
                    Impacted Group List
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Plus />}
                    onClick={() => setOpenDialog(true)}
                >
                    Create New Impacted Group
                </Button>
            </Box>

            <Paper elevation={0} sx={{ height: '100%', width: '100%' }}>
                <DataGrid
                    rows={groups}
                    columns={columns}
                    sx={{
                        border: 'none',
                        '& .MuiDataGrid-cell': {
                            borderColor: 'divider',
                        },
                    }}
                />
            </Paper>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Create New Impacted Group</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Group Name"
                            value={newGroup.name}
                            onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Overall Change %"
                            type="number"
                            value={newGroup.overallChange}
                            onChange={(e) => setNewGroup({ ...newGroup, overallChange: parseInt(e.target.value) || 0 })}
                            fullWidth
                            inputProps={{ min: 0, max: 100 }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleAddGroup} variant="contained" disabled={!newGroup.name}>
                        Create Group
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ImpactedGroupsTable;