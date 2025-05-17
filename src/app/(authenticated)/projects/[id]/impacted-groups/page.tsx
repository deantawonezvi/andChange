'use client'
import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { Users } from 'lucide-react';
import ImpactedGroupsTable from '@/app/lib/components/tables/impactedGroupsTable';

const ImpactedGroupsPage = () => {

    return (
        <Box sx={{ mx: 'auto', maxWidth: '100%' }}>

            {/* Summary section */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Users size={24} style={{ marginRight: '12px' }} />
                    <Typography variant="h5">
                        Impacted Groups
                    </Typography>
                </Box>

            </Paper>

            <ImpactedGroupsTable />

        </Box>
    );
};

export default ImpactedGroupsPage;