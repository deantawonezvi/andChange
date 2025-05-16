import React, { useMemo } from 'react';
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip,
    Legend
} from 'recharts';
import { Box, Typography, useTheme } from '@mui/material';

const dimensionLabels = {
    process: 'Process',
    systems: 'Systems',
    tools: 'Tools',
    jobRoles: 'Job Roles',
    criticalBehaviours: 'Critical Behaviors',
    mindsetAttitudesBeliefs: 'Mindset/Attitudes',
    reportingStructure: 'Reporting Structure',
    performanceReviews: 'Performance Reviews',
    compensation: 'Compensation',
    location: 'Location',
    retrenchments: 'Retrenchments',
    clarityOfFutureState: 'Clarity of Future'
};

type ImpactRadarChartProps = {
    watch: () => Record<string, any>;
};


const ImpactRadarChart: React.FC<ImpactRadarChartProps> = ({ watch }) => {
    const theme = useTheme();

    // Get the current form values from the watch function
    const formValues = watch();

    const chartData = useMemo(() =>
            (Object.keys(dimensionLabels) as Array<keyof typeof dimensionLabels>).map(key => ({
                dimension: dimensionLabels[key],
                value: formValues[key] || 0,
                fullMark: 5
            })),
        [formValues]
    );


    const changeImpactStrength = useMemo(() => {
        const impactFields = [
            'process', 'systems', 'tools', 'jobRoles', 'criticalBehaviours',
            'mindsetAttitudesBeliefs', 'reportingStructure', 'performanceReviews',
            'compensation', 'location', 'retrenchments', 'clarityOfFutureState'
        ];
        const totalRating = impactFields.reduce((sum, field) => sum + (formValues[field] || 0), 0);
        const maxPossibleRating = impactFields.length * 5;
        return Math.round((totalRating / maxPossibleRating) * 100);
    }, [formValues]);


    return (
        <Box sx={{
            p: 3,
            borderRadius: 1,
        }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6"></Typography>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="subtitle1">Change Impact Strength</Typography>
                    <Typography
                        variant="h4"
                        color="primary"
                        sx={{ fontWeight: 'bold' }}
                    >
                        {changeImpactStrength}%
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ height: 350, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart
                        cx="50%"
                        cy="50%"
                        outerRadius="70%"
                        data={chartData}
                    >
                        <PolarGrid stroke={theme.palette.divider} />
                        <PolarAngleAxis
                            dataKey="dimension"
                            tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                        />
                        <PolarRadiusAxis
                            angle={30}
                            domain={[0, 5]}
                            tick={{ fill: theme.palette.text.secondary }}
                        />
                        <Radar
                            name="Impact Level"
                            dataKey="value"
                            stroke={theme.palette.primary.main}
                            fill={theme.palette.primary.main}
                            fillOpacity={0.4}
                        />
                        <Tooltip
                            formatter={(value) => [`${value}`, 'Impact Level']}
                            contentStyle={{
                                backgroundColor: theme.palette.background.paper,
                                border: `1px solid ${theme.palette.divider}`,
                                borderRadius: 4
                            }}
                        />
                        <Legend />
                    </RadarChart>
                </ResponsiveContainer>
            </Box>
        </Box>
    );
};

export default ImpactRadarChart;