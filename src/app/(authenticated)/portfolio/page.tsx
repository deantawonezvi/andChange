'use client';

import React from 'react';
import { Alert, Box, Grid, Paper, Typography } from '@mui/material';
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Scatter,
    ScatterChart,
    Tooltip,
    TooltipProps,
    XAxis,
    YAxis,
    ZAxis
} from 'recharts';
import { Info } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { PortfolioService } from '@/app/lib/api/services/portfolioService';
import { useToast } from '@/app/lib/hooks/useToast';
import { SectionLoader } from "@/app/lib/components/common/pageLoader";

const PortfolioPage = () => {
    const { showToast } = useToast();
    const portfolioService = PortfolioService.getInstance();

    // Fetch people ROI vs budget data
    const {
        data: peopleROIData = [],
        isLoading: isLoadingPeopleROI,
        error: peopleROIError
    } = useQuery({
        queryKey: ['portfolioPeopleROI'],
        queryFn: () => portfolioService.getPeopleROIvsBudget(),
    });

    // Fetch CM budget vs risk data
    const {
        data: cmBudgetData = [],
        isLoading: isLoadingCMBudget,
        error: cmBudgetError
    } = useQuery({
        queryKey: ['portfolioCMBudget'],
        queryFn: () => portfolioService.getCMBudgetVsRisk(),
    });

    // Show errors in toast if any
    React.useEffect(() => {
        if (peopleROIError) {
            showToast('Failed to load People ROI data: ' + (peopleROIError as Error).message, 'error');
        }
        if (cmBudgetError) {
            showToast('Failed to load CM Budget data: ' + (cmBudgetError as Error).message, 'error');
        }
    }, [peopleROIError, cmBudgetError, showToast]);

    // Create ordered projects data for bar chart
    const orderedProjectsData = React.useMemo(() => {
        return [...peopleROIData]
            .sort((a, b) => b.peopleSideROI - a.peopleSideROI)
            .map(project => ({
                name: project.projectName,
                value: project.peopleSideROI
            }));
    }, [peopleROIData]);

    // Transform data for scatter plots
    const peopleROIScatterData = React.useMemo(() => {
        return peopleROIData.map(project => ({
            x: project.projectBudgetAmount,
            y: project.peopleSideROI,
            z: project.sufficiencyOfBudget * 3, // Scale for better visualization
            name: project.projectName
        }));
    }, [peopleROIData]);

    const cmBudgetScatterData = React.useMemo(() => {
        return cmBudgetData.map(project => ({
            x: project.riskValue,
            y: project.percentOfBudgetForCM,
            z: project.projectROI * 2, // Scale for better visualization
            name: project.projectName
        }));
    }, [cmBudgetData]);

    const isLoading = isLoadingPeopleROI || isLoadingCMBudget;
    const hasError = peopleROIError || cmBudgetError;

    // Custom tooltip for charts


    const renderCustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
        if (active && payload && payload.length) {
            return (
                <Paper elevation={3} sx={{ p: 1.5, bgcolor: 'background.paper' }}>
                    <Typography variant="subtitle2">{payload[0].payload.name}</Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>{`${payload[0].name}: ${payload[0].value}`}</Typography>
                    {payload[1] && (
                        <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>{`${payload[1].name}: ${payload[1].value}`}</Typography>
                    )}
                </Paper>
            );
        }
        return null;
    };


    if (isLoading) {
        return <SectionLoader message="Loading portfolio..." />;
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>Portfolio Overview</Typography>

            {hasError && (
                <Alert severity="warning" sx={{ mb: 3 }}>
                    Some data could not be loaded. Charts may be incomplete.
                </Alert>
            )}

            <Grid container spacing={3}>
                {/* People ROI vs Budget Chart */}
                <Grid item xs={12} md={12}>
                    <Paper elevation={3} sx={{ p: 2, height: '400px', position: 'relative' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6">People ROI vs Budget</Typography>
                            <Box
                                component="span"
                                sx={{
                                    ml: 1,
                                    cursor: 'help',
                                    display: 'inline-flex',
                                    '&:hover': { color: 'primary.main' }
                                }}
                                title="RAG from 'Sufficiency of Budget' (MV16)"
                            >
                                <Info size={16} />
                            </Box>
                        </Box>
                        <ResponsiveContainer width="100%" height="85%">
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid />
                                <XAxis
                                    type="number"
                                    dataKey="x"
                                    name="Project Budget"
                                    label={{ value: 'Project Budget ($)', position: 'bottom' }}
                                />
                                <YAxis
                                    type="number"
                                    dataKey="y"
                                    name="People Side ROI"
                                    label={{ value: 'People Side ROI (%)', angle: -90, position: 'left' }}
                                />
                                <ZAxis
                                    type="number"
                                    dataKey="z"
                                    range={[60, 400]}
                                    name="Sufficiency"
                                />
                                <Tooltip content={renderCustomTooltip} />
                                <Scatter
                                    name="Projects"
                                    data={peopleROIScatterData}
                                    fill="#4caf50"
                                    shape="triangle"
                                />
                            </ScatterChart>
                        </ResponsiveContainer>
                        <Typography
                            variant="caption"
                            sx={{ position: 'absolute', bottom: 5, right: 10, color: 'text.secondary' }}
                        >
                            Triangle size indicates budget sufficiency
                        </Typography>
                    </Paper>
                </Grid>

                {/* CM Budget vs Risk Chart */}
                <Grid item xs={12} md={12}>
                    <Paper elevation={3} sx={{ p: 2, height: '400px', position: 'relative' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6">CM Budget vs Risk</Typography>
                            <Box
                                component="span"
                                sx={{
                                    ml: 1,
                                    cursor: 'help',
                                    display: 'inline-flex',
                                    '&:hover': { color: 'primary.main' }
                                }}
                                title="Hover over shows Project ROI (MV25)"
                            >
                                <Info size={16} />
                            </Box>
                        </Box>
                        <ResponsiveContainer width="100%" height="85%">
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid />
                                <XAxis
                                    type="number"
                                    dataKey="x"
                                    name="Risk Value"
                                    label={{ value: 'Risk Value', position: 'bottom' }}
                                />
                                <YAxis
                                    type="number"
                                    dataKey="y"
                                    name="CM Investment"
                                    label={{ value: '% of Budget for CM', angle: -90, position: 'left' }}
                                />
                                <ZAxis
                                    type="number"
                                    dataKey="z"
                                    range={[60, 400]}
                                    name="Project ROI"
                                />
                                <Tooltip content={renderCustomTooltip} />
                                <Scatter
                                    name="Projects"
                                    data={cmBudgetScatterData}
                                    fill="#f44336"
                                    shape="square"
                                />
                            </ScatterChart>
                        </ResponsiveContainer>
                        <Typography
                            variant="caption"
                            sx={{ position: 'absolute', bottom: 5, right: 10, color: 'text.secondary' }}
                        >
                            Square size indicates project ROI
                        </Typography>
                    </Paper>
                </Grid>

                {/* Ordered List of Projects by People Side ROI */}
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ p: 2, height: '400px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6">Ordered List of Projects by People Side ROI</Typography>
                            <Box
                                component="span"
                                sx={{
                                    ml: 1,
                                    cursor: 'help',
                                    display: 'inline-flex',
                                    '&:hover': { color: 'primary.main' }
                                }}
                                title="Ordered highest to lowest"
                            >
                                <Info size={16} />
                            </Box>
                        </Box>
                        <ResponsiveContainer width="100%" height="85%">
                            <BarChart
                                data={orderedProjectsData}
                                margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" label={{ value: 'Projects', position: 'bottom' }} />
                                <YAxis label={{ value: 'People Side ROI (%)', angle: -90, position: 'left' }} />
                                <Tooltip />
                                <Bar dataKey="value" fill="#4caf50" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default PortfolioPage;