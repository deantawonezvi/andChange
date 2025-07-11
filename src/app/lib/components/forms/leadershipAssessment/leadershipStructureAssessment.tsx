import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert, Box, Button, Card, CardContent, Chip, Divider, Grid, Paper, Typography } from '@mui/material';
import { Building2, User, Users, Edit } from 'lucide-react';
import { EImpactedGroupDTO, ImpactedGroupService } from '@/app/lib/api/services/impactedGroupService';
import { ESponsorDTO, SponsorService } from '@/app/lib/api/services/sponsorService';
import { EManagerOfPeopleDTO, MOPService } from '@/app/lib/api/services/mopService';
import { ProjectService } from '@/app/lib/api/services/projectService';
import { SectionLoader } from '@/app/lib/components/common/pageLoader';
import TeamLeaderAssessmentPopup from './teamLeaderAssessmentPopup';
import SponsorAssessmentPopup from "@/app/lib/components/forms/leadershipAssessment/sponsorAssessmentPopup";

interface LeadershipStructureData {
    impactedGroup: EImpactedGroupDTO;
    sponsors: ESponsorDTO[];
    teamLeaders: EManagerOfPeopleDTO[];
}

const LeadershipStructureAssessment: React.FC = () => {
    const params = useParams();
    const queryClient = useQueryClient();
    const projectId = typeof params.id === 'string' ? parseInt(params.id) : 0;

    const [popupOpen, setPopupOpen] = useState(false);
    const [sponsorPopup, setSponsorPopupOpen] = useState(false);
    const [selectedImpactedGroup, setSelectedImpactedGroup] = useState<EImpactedGroupDTO | null>(null);
    const [selectedSponsor, setSelectedSponsor] = useState<ESponsorDTO | null>(null);
    const [selectedTeamLeader, setSelectedTeamLeader] = useState<EManagerOfPeopleDTO | null>(null);
    const [organizationId, setOrganizationId] = useState<number | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);

    const {
        data: impactedGroups,
        isLoading: loadingGroups,
        error: groupsError
    } = useQuery({
        queryKey: ['impacted-groups', projectId],
        queryFn: () => ImpactedGroupService.getInstance().getImpactedGroupsByProject(projectId),
        enabled: !!projectId
    });

    const { data: projectData } = useQuery({
        queryKey: ['project', projectId],
        queryFn: () => ProjectService.getInstance().getProjectById(projectId),
        enabled: !!projectId
    });

    useEffect(() => {
        if (projectData?.organizationId) {
            setOrganizationId(projectData.organizationId);
        }
    }, [projectData]);

    const leadershipQueries = useQuery({
        queryKey: ['leadership-structure', projectId, impactedGroups],
        queryFn: async (): Promise<LeadershipStructureData[]> => {
            if (!impactedGroups?.length) return [];

            const sponsorService = SponsorService.getInstance();
            const mopService = MOPService.getInstance();

            return await Promise.all(
                impactedGroups.map(async (group) => {
                    const sponsors = await Promise.all(
                        (group.sponsors || []).map(sponsorId =>
                            sponsorService.getSponsorById(sponsorId)
                        )
                    );

                    const teamLeaders = await Promise.all(
                        (group.managersOfPeople || []).map(mopId =>
                            mopService.getMOPById(mopId)
                        )
                    );

                    return {
                        impactedGroup: group,
                        sponsors,
                        teamLeaders
                    };
                })
            );
        },
        enabled: !!impactedGroups?.length
    });

    const handleCreateTeamLeader = (impactedGroup: EImpactedGroupDTO) => {
        setSelectedImpactedGroup(impactedGroup);
        setSelectedTeamLeader(null);
        setIsEditMode(false);
        setPopupOpen(true);
    };

    const handleEditTeamLeader = (impactedGroup: EImpactedGroupDTO, teamLeader: EManagerOfPeopleDTO) => {
        setSelectedImpactedGroup(impactedGroup);
        setSelectedTeamLeader(teamLeader);
        setIsEditMode(true);
        setPopupOpen(true);
    };

    const handleCreateSponsor = (impactedGroup: EImpactedGroupDTO) => {
        setSelectedImpactedGroup(impactedGroup);
        setSelectedSponsor(null);
        setIsEditMode(false);
        setSponsorPopupOpen(true);
    };

    const handleEditSponsor = (impactedGroup: EImpactedGroupDTO, sponsor: ESponsorDTO) => {
        setSelectedImpactedGroup(impactedGroup);
        setSelectedSponsor(sponsor);
        setIsEditMode(true);
        setSponsorPopupOpen(true);
    };

    const handleCloseTeamLeaderAssessment = () => {
        setPopupOpen(false);
        setSelectedImpactedGroup(null);
        setSelectedTeamLeader(null);
        setIsEditMode(false);
    };

    const handleCloseSponsorAssessment = () => {
        setSponsorPopupOpen(false);
        setSelectedImpactedGroup(null);
        setSelectedSponsor(null);
        setIsEditMode(false);
    };

    const handleAssessmentSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ['leadership-structure', projectId] });
        queryClient.invalidateQueries({ queryKey: ['impacted-groups', projectId] });
    };

    if (loadingGroups || leadershipQueries.isLoading) {
        return <SectionLoader message="Loading leadership structure..." />;
    }

    if (groupsError || leadershipQueries.error) {
        return (
            <Alert severity="error">
                Failed to load leadership structure data. Please try again.
            </Alert>
        );
    }

    const leadershipData = leadershipQueries.data || [];

    if (leadershipData.length === 0) {
        return (
            <Alert severity="info">
                No impacted groups found for this project. Please create impacted groups first.
            </Alert>
        );
    }

    const renderLeadershipCard = (data: LeadershipStructureData) => {
        const { impactedGroup, sponsors, teamLeaders } = data;

        return (
            <Card
                key={impactedGroup.id}
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    border: '1px solid #e0e0e0',
                    borderRadius: 2
                }}
            >
                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                    {/* Executive/Sponsor Level */}
                    <Box sx={{ mb: 3 }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            mb: 2
                        }}>
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    color: 'text.secondary',
                                    fontWeight: 600
                                }}
                            >
                                Executive / Sponsor - Senior Leader
                            </Typography>
                            <Button
                                variant="outlined"
                                disabled={sponsors.length > 0}
                                onClick={() => handleCreateSponsor(impactedGroup)}
                                size="small"
                                sx={{
                                    minWidth: 'auto',
                                    px: 2,
                                    opacity: 0.6
                                }}
                            >
                                Add Senior Leader
                            </Button>
                        </Box>

                        <Box sx={{
                            minHeight: 60,
                            border: '1px dashed #ccc',
                            borderRadius: 1,
                            p: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1
                        }}>
                            {sponsors.length > 0 ? (
                                sponsors.map(sponsor => (
                                    <Chip
                                        key={sponsor.id}
                                        icon={<User size={16} />}
                                        label={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                {sponsor.anagraphicDataDTO.entityName}
                                                <Edit size={12} />
                                            </Box>
                                        }
                                        size="small"
                                        variant="outlined"
                                        clickable
                                        onClick={() => handleEditSponsor(impactedGroup, sponsor)}
                                        sx={{
                                            backgroundColor: '#e3f2fd',
                                            borderColor: '#2196f3',
                                            cursor: 'pointer',
                                            '&:hover': {
                                                backgroundColor: '#bbdefb',
                                                borderColor: '#1976d2'
                                            }
                                        }}
                                    />
                                ))
                            ) : (
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: 'text.disabled',
                                        fontStyle: 'italic',
                                        textAlign: 'center',
                                        mt: 2
                                    }}
                                >
                                    No sponsors assigned
                                </Typography>
                            )}
                        </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Team Leaders Level */}
                    <Box sx={{ mb: 3 }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            mb: 2
                        }}>
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    color: 'text.secondary',
                                    fontWeight: 600
                                }}
                            >
                                Team Leaders - {impactedGroup.anagraphicDataDTO.entityName}
                            </Typography>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => handleCreateTeamLeader(impactedGroup)}
                                sx={{
                                    minWidth: 'auto',
                                    px: 2,
                                    backgroundColor: '#e8f5e8',
                                    borderColor: '#4caf50',
                                    color: '#2e7d32',
                                    '&:hover': {
                                        backgroundColor: '#d4edda',
                                        borderColor: '#2e7d32'
                                    }
                                }}
                            >
                                Add Team Leader
                            </Button>
                        </Box>

                        <Box sx={{
                            minHeight: 60,
                            border: '1px dashed #ccc',
                            borderRadius: 1,
                            p: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1
                        }}>
                            {teamLeaders.length > 0 ? (
                                <>
                                    {teamLeaders.map(leader => (
                                        <Chip
                                            key={leader.id}
                                            icon={<Users size={16} />}
                                            label={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    {leader.anagraphicDataDTO.entityName}
                                                    <Edit size={12} />
                                                </Box>
                                            }
                                            size="small"
                                            variant="outlined"
                                            clickable
                                            onClick={() => handleEditTeamLeader(impactedGroup, leader)}
                                            sx={{
                                                backgroundColor: '#f3e5f5',
                                                borderColor: '#9c27b0',
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    backgroundColor: '#e1bee7',
                                                    borderColor: '#7b1fa2'
                                                }
                                            }}
                                        />
                                    ))}
                                    {teamLeaders.length > 0 && (
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: 'text.secondary',
                                                textAlign: 'center',
                                                mt: 0.5,
                                                fontStyle: 'italic'
                                            }}
                                        >
                                            {teamLeaders.length} team leader{teamLeaders.length !== 1 ? 's' : ''}
                                        </Typography>
                                    )}
                                </>
                            ) : (
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: 'text.disabled',
                                        fontStyle: 'italic',
                                        textAlign: 'center',
                                        mt: 2
                                    }}
                                >
                                    No team leaders assigned
                                </Typography>
                            )}
                        </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Impacted Group Level */}
                    <Box>
                        <Typography
                            variant="subtitle2"
                            sx={{
                                color: 'text.secondary',
                                fontWeight: 600,
                                mb: 2
                            }}
                        >
                            Impacted Group
                        </Typography>

                        <Box sx={{
                            p: 2,
                            backgroundColor: '#f5f5f5',
                            borderRadius: 1,
                            textAlign: 'center'
                        }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 600,
                                    color: 'primary.main'
                                }}
                            >
                                {impactedGroup.anagraphicDataDTO.entityName}
                            </Typography>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        );
    };

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
                    Leadership Structure
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {leadershipData.map(data => (
                    <Grid
                        item
                        xs={12}
                        md={6}
                        lg={4}
                        key={data.impactedGroup.id}
                    >
                        {renderLeadershipCard(data)}
                    </Grid>
                ))}
            </Grid>

            {/* Summary Section */}
            <Paper sx={{ mt: 4, p: 3, backgroundColor: '#fafafa' }}>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Building2 size={20} />
                    Leadership Structure Summary
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Total Impacted Groups
                        </Typography>
                        <Typography variant="h4" sx={{ color: 'primary.main' }}>
                            {leadershipData.length}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Groups with Sponsors
                        </Typography>
                        <Typography variant="h4" sx={{ color: 'success.main' }}>
                            {leadershipData.filter(d => d.sponsors.length > 0).length}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Groups with Team Leaders
                        </Typography>
                        <Typography variant="h4" sx={{ color: 'info.main' }}>
                            {leadershipData.filter(d => d.teamLeaders.length > 0).length}
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>

            {organizationId && (
                <TeamLeaderAssessmentPopup
                    open={popupOpen}
                    onClose={handleCloseTeamLeaderAssessment}
                    impactedGroupId={selectedImpactedGroup?.id || 0}
                    projectId={projectId}
                    organizationId={organizationId}
                    onSuccess={handleAssessmentSuccess}
                    existingTeamLeader={selectedTeamLeader}
                    isEditMode={isEditMode}
                />
            )}

            {organizationId && (
                <SponsorAssessmentPopup
                    open={sponsorPopup}
                    onClose={handleCloseSponsorAssessment}
                    impactedGroupId={selectedImpactedGroup?.id || 0}
                    projectId={projectId}
                    organizationId={organizationId}
                    onSuccess={handleAssessmentSuccess}
                    existingSponsor={selectedSponsor}
                    isEditMode={isEditMode}
                />
            )}
        </Box>
    );
};

export default LeadershipStructureAssessment;