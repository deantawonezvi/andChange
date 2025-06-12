'use client'
import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { OrganizationService } from "@/app/lib/api/services/organisationService";
import OrganizationsTable from "@/app/lib/components/tables/organisationsTable";
import CreateOrganizationModal from "@/app/lib/components/forms/createOrganizationModal";
import { useToast } from '@/app/lib/hooks/useToast';

const OrganizationsPage = () => {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const organizationService = OrganizationService.getInstance();
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    const { data, isLoading, error } = useQuery({
        queryKey: ['organizations'],
        queryFn: () => organizationService.getAllOrganizations()
    });

    const handleCreateSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ['organizations'] });
        setCreateModalOpen(false);
        showToast('Organization created successfully!', 'success');
    };

    return (
        <Box>
            {/* Header with Create Button */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3
            }}>
                <Box>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Plus size={20} />}
                    onClick={() => setCreateModalOpen(true)}
                    sx={{ mb: 2 }}
                >
                    Create Organization
                </Button>
            </Box>

            <OrganizationsTable
                data={data || []}
                isLoading={isLoading}
                error={error instanceof Error ? error.message : undefined}
            />

            <CreateOrganizationModal
                open={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onSuccess={handleCreateSuccess}
            />
        </Box>
    );
};

export default OrganizationsPage;