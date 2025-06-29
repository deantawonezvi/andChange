import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Alert, Box, Button, Card, CardContent, Chip, Divider, Grid, Paper, Typography } from '@mui/material';
import { Building2, User, Users } from 'lucide-react';
import { EImpactedGroupDTO, ImpactedGroupService } from '@/app/lib/api/services/impactedGroupService';
import { ESponsorDTO, SponsorService } from '@/app/lib/api/services/sponsorService';
import { EManagerOfPeopleDTO, MOPService } from '@/app/lib/api/services/mopService';
import { SectionLoader } from '@/app/lib/components/common/pageLoader';

interface LeadershipStructureData {
    impactedGroup: EImpactedGroupDTO;
    sponsors: ESponsorDTO[];
    teamLeaders: EManagerOfPeopleDTO[];
}

const LeadershipStructureAssessment: React.FC = () => {
    const params = useParams();
    const projectId = typeof params.id === 'string' ? parseInt(params.id) : 0;

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
                                Team Leaders
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
                            {teamLeaders.length > 0 ? (
                                teamLeaders.map(leader => (
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
        </Box>
    );
};

export default LeadershipStructureAssessment;