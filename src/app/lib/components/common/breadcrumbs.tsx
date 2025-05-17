import React, { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { alpha, Box, Breadcrumbs as MuiBreadcrumbs, Chip, Typography, useTheme } from '@mui/material';
import { BookOpen, Calendar, ChevronRight, FileText, FolderKanban, Home, LayoutGrid, Plus, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { ProjectService } from '@/app/lib/api/services/projectService';
import { OrganizationService } from '@/app/lib/api/services/organisationService';
import { ImpactedGroupService } from '@/app/lib/api/services/impactedGroupService';

interface BreadcrumbsProps {
    extraCrumbs?: {
        title: string;
        href?: string;
        icon?: React.ReactNode;
    }[];
    showHome?: boolean;
}

type PathSegment = {
    title: string;
    href: string;
    icon: React.ReactNode;
};

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ extraCrumbs = [], showHome = true }) => {
    const pathname = usePathname();
    const theme = useTheme();

    // Initialize services
    const projectService = ProjectService.getInstance();
    const organizationService = OrganizationService.getInstance();
    const impactedGroupService = ImpactedGroupService.getInstance();

    // Parse the path segments
    const pathSegments = useMemo(() => {
        const segments = pathname.split('/').filter(Boolean);

        // Extract IDs from the path
        const projectId = segments.includes('projects') && segments[segments.indexOf('projects') + 1]
            ? parseInt(segments[segments.indexOf('projects') + 1])
            : null;

        const organisationId = segments.includes('organisations') && segments[segments.indexOf('organisations') + 1]
            ? parseInt(segments[segments.indexOf('organisations') + 1])
            : null;

        const impactedGroupId = segments.includes('impacted-group') && segments[segments.indexOf('impacted-group') + 1]
            ? parseInt(segments[segments.indexOf('impacted-group') + 1])
            : null;

        return { segments, projectId, organisationId, impactedGroupId };
    }, [pathname]);

    // Fetch project data if needed
    const {
        data: projectData,
        isLoading: isLoadingProject
    } = useQuery({
        queryKey: ['project', pathSegments.projectId],
        queryFn: () => projectService.getProjectById(pathSegments.projectId as number),
        enabled: !!pathSegments.projectId && !isNaN(pathSegments.projectId)
    });

    // Fetch organization data if needed
    const {
        data: organisationData,
        isLoading: isLoadingOrganisation
    } = useQuery({
        queryKey: ['organisation', pathSegments.organisationId],
        queryFn: () => organizationService.getOrganizationById(pathSegments.organisationId as number),
        enabled: !!pathSegments.organisationId && !isNaN(pathSegments.organisationId)
    });

    // Fetch impacted group data if needed
    const {
        data: impactedGroupData,
        isLoading: isLoadingImpactedGroup
    } = useQuery({
        queryKey: ['impactedGroup', pathSegments.impactedGroupId],
        queryFn: () => impactedGroupService.getImpactedGroupById(pathSegments.impactedGroupId as number),
        enabled: !!pathSegments.impactedGroupId && !isNaN(pathSegments.impactedGroupId)
    });

    // Generate breadcrumbs based on path and fetched data
    const breadcrumbs = useMemo(() => {
        // Start with Home
        const result: PathSegment[] = showHome
            ? [{ title: 'Home', href: '/', icon: <Home size={16} /> }]
            : [];

        let currentPath = '';
        let prevTitle = '';

        // Map for common paths
        const pathMap: Record<string, { title: string; icon: React.ReactNode }> = {
            'projects': { title: 'Projects', icon: <FolderKanban size={16} /> },
            'organisations': { title: 'Organisations', icon: <BookOpen size={16} /> },
            'portfolio': { title: 'Portfolio', icon: <LayoutGrid size={16} /> },
            'calendar': { title: 'Calendar', icon: <Calendar size={16} /> },
            'impacted-group': { title: 'Impacted Groups', icon: <Users size={16} /> }
        };

        // Process each path segment
        pathSegments.segments.forEach((segment) => {
            // Update current path
            currentPath += `/${segment}`;

            // Check if this is an ID segment (numeric)
            const isIdSegment = !isNaN(Number(segment));

            // Determine title and icon based on path segment
            let title = '';
            let icon: any = <FileText size={16} />;

            if (pathMap[segment]) {
                // Known path segment
                title = pathMap[segment].title;
                icon = pathMap[segment].icon;
                prevTitle = title;
            } else if (isIdSegment) {
                // This is an ID segment, get the entity name from fetched data
                if (prevTitle === 'Projects' && pathSegments.projectId && projectData) {
                    title = projectData.projectName;
                    icon = <FolderKanban size={16} />;
                } else if (prevTitle === 'Organisations' && pathSegments.organisationId && organisationData) {
                    title = organisationData.organizationName;
                    icon = <BookOpen size={16} />;
                } else if (prevTitle === 'Impacted Groups' && pathSegments.impactedGroupId && impactedGroupData) {
                    title = impactedGroupData.anagraphicDataDTO?.entityName || `Group ${segment}`;
                    icon = <Users size={16} />;
                } else {
                    // If data hasn't loaded yet or isn't available
                    title = `${prevTitle} ${segment}`;
                }
            } else if (segment === 'new') {
                title = 'New';
                icon = <Plus size={16} />;
            } else {
                // Other segments (like "edit", etc.)
                title = segment.charAt(0).toUpperCase() + segment.slice(1);
            }

            // Add to breadcrumbs
            result.push({
                title,
                href: currentPath,
                icon
            });
        });

        // Add any extra breadcrumbs
        return [...result, ...extraCrumbs.map(crumb => ({
            title: crumb.title,
            href: crumb.href || '#',
            icon: crumb.icon || <FileText size={16} />
        }))];
    }, [
        pathname,
        showHome,
        extraCrumbs,
        pathSegments.segments,
        pathSegments.projectId,
        pathSegments.organisationId,
        pathSegments.impactedGroupId,
        projectData,
        organisationData,
        impactedGroupData
    ]);

    // Don't render if it's just the home breadcrumb
    if (breadcrumbs.length <= 1) {
        return null;
    }

    // Loading indicator for breadcrumbs
    if (
        (pathSegments.projectId && isLoadingProject) ||
        (pathSegments.organisationId && isLoadingOrganisation) ||
        (pathSegments.impactedGroupId && isLoadingImpactedGroup)
    ) {
        return (
            <Box sx={{ py: 0.5 }}>
                <Chip
                    label="Loading..."
                    size="small"
                    sx={{
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main
                    }}
                />
            </Box>
        );
    }

    return (
        <MuiBreadcrumbs
            separator={<ChevronRight size={16} />}
            aria-label="breadcrumb"
            sx={{
                '.MuiBreadcrumbs-ol': {
                    flexWrap: 'nowrap',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }
            }}
        >
            {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;

                return isLast ? (
                    // Last item is just text
                    <Box
                        key={crumb.href}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            color: theme.palette.text.primary,
                            fontWeight: 500
                        }}
                    >
                        <Box sx={{ mr: 0.75, display: 'flex', alignItems: 'center' }}>
                            {crumb.icon}
                        </Box>
                        <Typography variant="body2" component="span" noWrap>
                            {crumb.title}
                        </Typography>
                    </Box>
                ) : (
                    // Link for other items
                    <Link
                        key={crumb.href}
                        href={crumb.href}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            color: theme.palette.text.secondary,
                            textDecoration: 'none'
                        }}
                    >
                        <Box sx={{ mr: 0.75, display: 'flex', alignItems: 'center' }}>
                            {crumb.icon}
                        </Box>
                        <Typography variant="body2" component="span" noWrap>
                            {crumb.title}
                        </Typography>
                    </Link>
                );
            })}
        </MuiBreadcrumbs>
    );
};

export default Breadcrumbs;