'use client';

import React from 'react';
import { Typography, Box } from '@mui/material';
import ImpactedGroupAssessment from "@/app/lib/components/forms/impactedGroupAssesssment/impactedGroupAssessment";

export default function EditImpactedGroupPage() {
    return (
        <Box>
            <Typography variant="h4" gutterBottom>Edit Impacted Group</Typography>
            <ImpactedGroupAssessment />
        </Box>
    );
}