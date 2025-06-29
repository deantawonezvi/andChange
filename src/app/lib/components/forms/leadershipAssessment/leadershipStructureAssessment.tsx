import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert, Box, Button, Card, CardContent, Chip, Divider, Grid, Paper, Typography } from '@mui/material';
import { Building2, User, Users } from 'lucide-react';
import { EImpactedGroupDTO, ImpactedGroupService } from '@/app/lib/api/services/impactedGroupService';
import { ESponsorDTO, SponsorService } from '@/app/lib/api/services/sponsorService';
import { EManagerOfPeopleDTO, MOPService } from '@/app/lib/api/services/mopService';
import { ProjectService } from '@/app/lib/api/services/projectService';
import { SectionLoader } from '@/app/lib/components/common/pageLoader';
import TeamLeaderAssessmentPopup from './teamLeaderAssessmentPopup';

interface LeadershipStructureData {
    impactedGroup: EImpactedGroupDTO;
    sponsors: ESponsorDTO[];
    teamLeaders: EManagerOfPeopleDTO[];
}

const LeadershipStructureAssessment: React.FC = () => {
    const params = useParams();
    const queryClient = useQueryClient();
    const projectId = typeof params.id === 'string' ? parseInt(params.id) : 0;

    // State for popup management
    const [popupOpen, setPopupOpen] = useState(false);
    const [selectedImpactedGroup, setSelectedImpactedGroup] = useState<EImpactedGroupDTO | null>(null);
    const [organizationId, setOrganizationId] = useState<number | null>(null);

    // Fetch impacted groups for the project
    const {
        data: impactedGroups,
        isLoading: loadingGroups,
        error: groupsError
    } = useQuery({
        queryKey: ['impacted-groups', projectId],
        queryFn: () => ImpactedGroupService.getInstance().getImpactedGroupsByProject(projectId),
        enabled: !!projectId
    });

    // Fetch project details to get organization ID
    const { data: projectData } = useQuery({
        queryKey: ['project', projectId],
        queryFn: () => ProjectService.getInstance().getProjectById(projectId),
        enabled: !!projectId
    });

// Set organization ID when project data is loaded
    useEffect(() => {
        if (projectData?.organizationId) {
            setOrganizationId(projectData.organizationId);
        }
    }, [projectData]);

    // Fetch leadership details for each impacted group
    const leadershipQueries = useQuery({
        queryKey: ['leadership-structure', projectId, impactedGroups],
        queryFn: async (): Promise<LeadershipStructureData[]> => {
            if (!impactedGroups?.length) return [];

            const sponsorService = SponsorService.getInstance();
            const mopService = MOPService.getInstance();

            return await Promise.all(
                impactedGroups.map(async (group) => {
                    // Fetch sponsors
                    const sponsors = await Promise.all(
                        (group.sponsors || []).map(sponsorId =>
                            sponsorService.getSponsorById(sponsorId)
                        )
                    );

                    // Fetch managers of people (team leaders)
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
        setPopupOpen(true);
    };

    const handleCloseTeamLeaderAssessment = () => {
        setPopupOpen(false);
        setSelectedImpactedGroup(null);
    };

    const handleAssessmentSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ['leadership-structure', projectId] });

        console.log('Team leader assessment saved successfully');
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
                                size="small"
                                disabled
                                sx={{
                                    minWidth: 'auto',
                                    px: 2,
                                    opacity: 0.6
                                }}
                            >
                                Define
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
                                        label={sponsor.anagraphicDataDTO.entityName}
                                        size="small"
                                        variant="outlined"
                                        sx={{
                                            backgroundColor: '#e3f2fd',
                                            borderColor: '#2196f3'
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

                    {/* Team Leaders Level - THIS IS WHERE THE POPUP IS TRIGGERED */}
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
                                Team Leaders
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
                                            label={leader.anagraphicDataDTO.entityName}
                                            size="small"
                                            variant="outlined"
                                            sx={{
                                                backgroundColor: '#f3e5f5',
                                                borderColor: '#9c27b0'
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
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Connect this impacted group with the leadership structure through this assessment.
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
                />
            )}
        </Box>
    );
};

export default LeadershipStructureAssessment;