'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import ImpactedGroupAssessment from "@/app/lib/components/forms/impactedGroupAssesssment/impactedGroupAssessment";

export default function NewImpactedGroupPage() {
    return (
        <Box>
            <Typography variant="h4" gutterBottom>Create New Impacted Group</Typography>
            <ImpactedGroupAssessment />
        </Box>
    );
}