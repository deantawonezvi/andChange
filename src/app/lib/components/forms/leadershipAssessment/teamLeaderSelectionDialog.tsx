import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemIcon,
    Typography,
    Box,
    IconButton,
    Chip
} from '@mui/material';
import { X as Close, Users, Plus, Edit } from 'lucide-react';
import { EManagerOfPeopleDTO } from '@/app/lib/api/services/mopService';

interface TeamLeaderSelectionDialogProps {
    open: boolean;
    onClose: () => void;
    teamLeaders: EManagerOfPeopleDTO[];
    impactedGroupName: string;
    onSelectTeamLeader: (teamLeader: EManagerOfPeopleDTO) => void;
    onCreateNew: () => void;
}

const TeamLeaderSelectionDialog: React.FC<TeamLeaderSelectionDialogProps> = ({
                                                                                 open,
                                                                                 onClose,
                                                                                 teamLeaders,
                                                                                 impactedGroupName,
                                                                                 onSelectTeamLeader,
                                                                                 onCreateNew
                                                                             }) => {
    const calculateABSUPAverage = (teamLeader: EManagerOfPeopleDTO): number => {
        const absup = teamLeader.groupProjectABSUPDTO;
        if (!absup) return 0;

        return (
            absup.absupAwareness +
            absup.absupBuyin +
            absup.absupSkill +
            absup.absupUse +
            absup.absupProficiency
        ) / 5;
    };

    const getABSUPLevel = (average: number): { label: string; color: string } => {
        if (average >= 4) return { label: 'High', color: '#4caf50' };
        if (average >= 3) return { label: 'Medium', color: '#ff9800' };
        if (average >= 2) return { label: 'Low', color: '#f44336' };
        return { label: 'Very Low', color: '#d32f2f' };
    };

    const getResistanceLevel = (teamLeader: EManagerOfPeopleDTO): { label: string; color: string } => {
        const resistance = teamLeader.resistanceAssessment?.anticipatedResistanceLevel || 0;
        if (resistance >= 4) return { label: 'High', color: '#f44336' };
        if (resistance >= 3) return { label: 'Medium', color: '#ff9800' };
        return { label: 'Low', color: '#4caf50' };
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    maxHeight: '80vh'
                }
            }}
        >
            <DialogTitle sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #e0e0e0',
                pb: 2
            }}>
                <Box>
                    <Typography variant="h6" component="div">
                        Select Team Leader to Edit
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {impactedGroupName} • {teamLeaders.length} team leader{teamLeaders.length !== 1 ? 's' : ''}
                    </Typography>
                </Box>
                <IconButton
                    onClick={onClose}
                    size="small"
                    sx={{ color: 'grey.500' }}
                >
                    <Close />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ pt: 2, pb: 1 }}>
                {/* Create New Team Leader Option */}
                <Box sx={{ mb: 2 }}>
                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={onCreateNew}
                            sx={{
                                border: '2px dashed #4caf50',
                                borderRadius: 2,
                                mb: 1,
                                '&:hover': {
                                    backgroundColor: '#e8f5e8',
                                    borderColor: '#2e7d32'
                                }
                            }}
                        >
                            <ListItemIcon>
                                <Plus />
                            </ListItemIcon>
                            <ListItemText
                                primary="Create New Team Leader"
                                secondary="Add a new team leader assessment for this group"
                                primaryTypographyProps={{
                                    fontWeight: 600,
                                    color: '#2e7d32'
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                </Box>

                {/* Existing Team Leaders List */}
                <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                    Existing Team Leaders:
                </Typography>

                <List sx={{ pt: 0 }}>
                    {teamLeaders.map((teamLeader) => {
                        const absupAverage = calculateABSUPAverage(teamLeader);
                        const absupLevel = getABSUPLevel(absupAverage);
                        const resistanceLevel = getResistanceLevel(teamLeader);

                        return (
                            <ListItem key={teamLeader.id} disablePadding sx={{ mb: 1 }}>
                                <ListItemButton
                                    onClick={() => onSelectTeamLeader(teamLeader)}
                                    sx={{
                                        border: '1px solid #e0e0e0',
                                        borderRadius: 2,
                                        '&:hover': {
                                            backgroundColor: '#f5f5f5',
                                            borderColor: '#2196f3'
                                        }
                                    }}
                                >
                                    <ListItemIcon>
                                        <Users />
                                    </ListItemIcon>

                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                    {teamLeader.anagraphicDataDTO.entityName}
                                                </Typography>
                                                <Edit />
                                            </Box>
                                        }
                                        secondary={
                                            <Box sx={{ mt: 1 }}>
                                                <Box sx={{ display: 'flex', gap: 1, mb: 0.5 }}>
                                                    <Chip
                                                        label={`ABSUP: ${absupLevel.label} (${absupAverage.toFixed(1)})`}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: `${absupLevel.color}20`,
                                                            color: absupLevel.color,
                                                            fontSize: '0.7rem'
                                                        }}
                                                    />
                                                    <Chip
                                                        label={`Resistance: ${resistanceLevel.label}`}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: `${resistanceLevel.color}20`,
                                                            color: resistanceLevel.color,
                                                            fontSize: '0.7rem'
                                                        }}
                                                    />
                                                </Box>

                                                {teamLeader.anagraphicDataDTO.roleDefinition && (
                                                    <Typography variant="caption" color="text.secondary">
                                                        {teamLeader.anagraphicDataDTO.roleDefinition}
                                                    </Typography>
                                                )}
                                            </Box>
                                        }
                                    />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </DialogContent>

            <DialogActions sx={{
                px: 3,
                py: 2,
                borderTop: '1px solid #e0e0e0'
            }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    sx={{ minWidth: 100 }}
                >
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TeamLeaderSelectionDialog;