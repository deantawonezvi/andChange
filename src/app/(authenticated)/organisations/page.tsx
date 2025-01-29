'use client'
import React from 'react';
import { Box } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import {OrganizationService} from "@/app/lib/api/services/organisationService";
import OrganizationsTable from "@/app/lib/components/tables/organisationsTable";

const OrganizationsPage = () => {
    const organizationService = OrganizationService.getInstance();

    const { data, isLoading, error } = useQuery({
        queryKey: ['organizations'],
        queryFn: () => organizationService.getAllOrganizations()
    });

    return (
        <Box>
            <OrganizationsTable
                data={data || []}
                isLoading={isLoading}
                error={error instanceof Error ? error.message : undefined}
            />
        </Box>
    );
};

export default OrganizationsPage;