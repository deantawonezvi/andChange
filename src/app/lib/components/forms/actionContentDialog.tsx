
import React from 'react';
import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    Typography
} from '@mui/material';
import { Calendar, FileText, Target, User, X as Close } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import ContentGenerationService from '@/app/lib/api/services/contentGenerationService';
import { format } from 'date-fns';

interface ActionContentDialogProps {
    open: boolean;
    onClose: () => void;
    action: {
        id: number;
        slotId?: number;
        name: string;
        actionName?: string;
        date: string;
        entityName?: string;
        entityType?: string;
        stateTarget?: string;
        status?: string;
    } | null;
}

export const parseGeneratedResult = (generatedResult: string): string => {
    try {
        const parsed = JSON.parse(generatedResult);
        return parsed.choices?.[0]?.message?.content || 'No content available';
    } catch (error) {
        console.error('Error parsing generated result:', error);
        return 'Error parsing content';
    }
};

export const formatContentParagraphs = (content: string): string[] => {
    return content.split('\\n\\n')
        .filter(p => p.trim())
        .map(p => p.replace(/\\n/g, ' ').trim());
};

const ActionContentDialog: React.FC<ActionContentDialogProps> = ({
                                                                     open,
                                                                     onClose,
                                                                     action
                                                                 }) => {
    const contentService = ContentGenerationService.getInstance();

    const { data: contentData, isLoading, error, refetch } = useQuery({
        queryKey: ['actionContent', action?.slotId],
        queryFn: async () => {
            if (!action?.slotId) {
                throw new Error('No slot ID available');
            }
            return await contentService.getAIContentForActionPlanItems([action.slotId]);
        },
        enabled: open && !!action?.slotId,
        staleTime: 5 * 60 * 1000, 
        retry: 2
    });

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), 'MMM dd, yyyy');
        } catch {
            return dateString;
        }
    };

    const getEntityTypeDisplay = (entityType?: string) => {
        const typeMapping: Record<string, string> = {
            'impactedGroup': 'Impacted Group',
            'mop': 'Manager of People',
            'sponsor': 'Sponsor'
        };
        return typeMapping[entityType || ''] || entityType || 'Unknown';
    };

    const getStateTargetColor = (target?: string) => {
        const colors: Record<string, string> = {
            'AWARENESS': '#2196f3',
            'BUYIN': '#ff9800',
            'SKILL': '#4caf50',
            'USE': '#9c27b0',
            'PROFICIENCY': '#f44336'
        };
        return colors[target || ''] || '#9e9e9e';
    };

    if (!action) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    minHeight: '60vh',
                    maxHeight: '90vh'
                }
            }}
        >
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" alignItems="center" gap={1}>
                        <FileText size={20} />
                        <Typography variant="h6">
                            Action Content
                        </Typography>
                    </Box>
                    <IconButton onClick={onClose} size="small">
                        <Close />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent dividers>
                {/* Action Details Header */}
                <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="h6" gutterBottom>
                        {action.actionName || action.name}
                    </Typography>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
                        {action.entityName && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <User size={16} color="#666" />
                                <Typography variant="body2" color="text.secondary">
                                    <strong>Target:</strong> {action.entityName}
                                </Typography>
                            </Box>
                        )}

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Calendar size={16} color="#666" />
                            <Typography variant="body2" color="text.secondary">
                                <strong>Date:</strong> {formatDate(action.date)}
                            </Typography>
                        </Box>

                        {action.entityType && (
                            <Typography variant="body2" color="text.secondary">
                                <strong>Type:</strong> {getEntityTypeDisplay(action.entityType)}
                            </Typography>
                        )}
                    </Box>

                    {action.stateTarget && (
                        <Box sx={{ mt: 2 }}>
                            <Chip
                                icon={<Target size={14} />}
                                label={`Target: ${action.stateTarget}`}
                                size="small"
                                sx={{
                                    bgcolor: getStateTargetColor(action.stateTarget),
                                    color: 'white',
                                    '& .MuiChip-icon': {
                                        color: 'white'
                                    }
                                }}
                            />
                        </Box>
                    )}
                </Box>

                <Divider sx={{ mb: 3 }} />

                {/* Content Display */}
                {isLoading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                        <CircularProgress />
                        <Typography variant="body2" sx={{ ml: 2 }}>
                            Loading generated content...
                        </Typography>
                    </Box>
                )}

                {error && (
                    <Alert
                        severity="error"
                        action={
                            <Button color="inherit" size="small" onClick={() => refetch()}>
                                Retry
                            </Button>
                        }
                    >
                        {error instanceof Error ? error.message : 'Failed to load content'}
                    </Alert>
                )}

                {!isLoading && !error && contentData && (
                    <Box>
                        {contentData.length === 0 ? (
                            <Alert severity="info">
                                No generated content available for this action.
                            </Alert>
                        ) : (
                            contentData.map((contentArray, arrayIndex) => (
                                <Box key={arrayIndex} sx={{ mb: 3 }}>
                                    {contentArray.map((content, contentIndex) => (
                                        <Box key={content.id || contentIndex} sx={{ mb: 3 }}>

                                            {content.generatedResult && (
                                                <Box sx={{ mb: 2 }}>
                                                    <Typography variant="subtitle2" color="success.main" gutterBottom>
                                                        Generated Content:
                                                    </Typography>
                                                    <Box sx={{
                                                        p: 2,
                                                        bgcolor: 'green.50',
                                                        borderRadius: 1,
                                                        border: '1px solid',
                                                        borderColor: 'green.200'
                                                    }}>
                                                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                                                            {parseGeneratedResult(content.generatedResult)}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            )}

                                            {contentIndex < contentArray.length - 1 && (
                                                <Divider sx={{ my: 2 }} />
                                            )}
                                        </Box>
                                    ))}
                                </Box>
                            ))
                        )}
                    </Box>
                )}

                {!isLoading && !error && !action.slotId && (
                    <Alert severity="warning">
                        This action does not have generated content available.
                    </Alert>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} variant="contained">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ActionContentDialog;