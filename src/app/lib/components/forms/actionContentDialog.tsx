import React, { useState } from 'react';
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
    Grid,
    IconButton, TextField,
    Typography
} from '@mui/material';
import { Calendar, FileText, Target, User, X as Close, Copy, Zap } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import ContentGenerationService from '@/app/lib/api/services/contentGenerationService';
import { format } from 'date-fns';
import MarkDownContentRenderer from "@/app/lib/components/forms/markDownContentRenderer";

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
        console.log(parsed.choices?.[0]?.message?.content);
        return parsed.choices?.[0]?.message?.content || 'No content available';
    } catch (error) {
        console.log('Error parsing generated result:', error);
        return 'Error parsing content';
    }
};

const ActionContentDialog: React.FC<ActionContentDialogProps> = ({
                                                                     open,
                                                                     onClose,
                                                                     action
                                                                 }) => {
    const contentService = ContentGenerationService.getInstance();
    const [isGenerating, setIsGenerating] = useState(false);


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

    const handleGenerateContent = async (slotId: number) => {
        if (!slotId) return;

        setIsGenerating(true);
        try {
            await contentService.generateAIContentForActionPlanItems([slotId]);
            // Refetch the content to show the newly generated content
            await refetch();
        } catch (error) {
            console.error('Failed to generate content:', error);
            // Show error toast/notification
        } finally {
            setIsGenerating(false);
        }
    };

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

    // Get all content items flattened
    const getAllContentItems = () => {
        if (!contentData || contentData.length === 0) return [];

        const allItems: any[] = [];
        contentData.forEach((contentArray) => {
            contentArray.forEach((content) => {
                if (content.generatedResult) {
                    allItems.push(content);
                }
            });
        });
        return allItems;
    };

    const handleCopyContent = async (content: string, assetNumber: number) => {
        try {
            await navigator.clipboard.writeText(content);
            console.log(`Asset ${assetNumber} content copied to clipboard`);
        } catch (err) {
            console.error('Failed to copy content:', err);
        }
    };

    const contentItems = getAllContentItems();
    const hasMultipleItems = contentItems.length > 1;

    if (!action) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth={hasMultipleItems ? "xl" : "lg"}
            fullWidth
            PaperProps={{
                sx: {
                    minHeight: '60vh',
                    maxHeight: '90vh',
                    width: hasMultipleItems ? '95vw' : undefined,
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
                        {hasMultipleItems && (
                            <Chip
                                label={`${contentItems.length} items`}
                                size="small"
                                color="primary"
                                variant="outlined"
                            />
                        )}
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
                        {contentItems.length === 0 ? (
                            <Alert severity="info">
                                No generated content available for this action.
                            </Alert>
                        ) : hasMultipleItems ? (
                            <Grid container spacing={3}>
                                {contentItems.map((content, index) => (
                                    <Grid item xs={12} md={6} key={content.id || index}>
                                        <Box sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}>
                                            <Typography
                                                variant="subtitle1"
                                                sx={{
                                                    mb: 2,
                                                    fontWeight: 600,
                                                    color: 'primary.main',
                                                    borderBottom: '2px solid',
                                                    borderColor: 'primary.main',
                                                    pb: 1
                                                }}
                                            >
                                                Asset {index + 1}
                                            </Typography>
                                            <Grid container spacing={1}>
                                                <Grid item xs={6}>
                                                    <Button
                                                        fullWidth
                                                        startIcon={isGenerating ? <CircularProgress size={14} /> : <Zap size={14} />}
                                                        onClick={() => handleGenerateContent(action.slotId!)}
                                                        variant="outlined"
                                                        sx={{
                                                            minWidth: 'auto',
                                                            px: 1,
                                                            py: 0.5,
                                                            fontSize: '0.75rem',
                                                        }}
                                                    >
                                                        Generate Content
                                                    </Button>
                                                </Grid>

                                                <Grid item xs={6}>
                                                    <Button
                                                        fullWidth
                                                        startIcon={<Copy size={14} />}
                                                        onClick={() => handleCopyContent(parseGeneratedResult(content.generatedResult), index + 1)}
                                                        variant="outlined"
                                                        sx={{
                                                            minWidth: 'auto',
                                                            px: 1,
                                                            py: 0.5,
                                                            fontSize: '0.75rem',
                                                        }}
                                                    >
                                                        Copy Content
                                                    </Button>
                                                </Grid>
                                            </Grid>

                                            <br/>
                                            <Box sx={{
                                                flex: 1,
                                                p: 2,
                                                bgcolor: 'grey.50',
                                                borderRadius: 1,
                                                border: '1px solid',
                                                borderColor: 'grey.300',
                                                overflow: 'auto'
                                            }}>
                                                <MarkDownContentRenderer
                                                    content={parseGeneratedResult(content.generatedResult)}
                                                />
                                            </Box>
                                            <br/>
                                            <Grid container spacing={1}>
                                                <Grid item xs={6}>
                                                    <Button
                                                        fullWidth
                                                        startIcon={<Zap size={14} />}
                                                        onClick={() => handleCopyContent(parseGeneratedResult(content.generatedResult), index + 1)}
                                                        variant="outlined"
                                                        sx={{
                                                            minWidth: 'auto',
                                                            px: 1,
                                                            py: 0.5,
                                                            fontSize: '0.75rem',
                                                        }}
                                                    >
                                                        Regenerate Content
                                                    </Button>
                                                </Grid>

                                                <Grid item xs={6}>
                                                    <Button
                                                        fullWidth
                                                        startIcon={<Copy size={14} />}
                                                        onClick={() => handleCopyContent(parseGeneratedResult(content.generatedResult), index + 1)}
                                                        variant="outlined"
                                                        sx={{
                                                            minWidth: 'auto',
                                                            px: 1,
                                                            py: 0.5,
                                                            fontSize: '0.75rem',
                                                        }}
                                                    >
                                                        Copy Content
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                            <br/>
                                            <Typography>
                                                Additional Prompt
                                            </Typography>
                                            <br/>
                                            <TextField
                                                label="Additional Prompt"
                                                multiline
                                                rows={2}
                                                variant="outlined"
                                                fullWidth
                                            />

                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <Grid container spacing={3}>
                                {contentItems.map((content, index) => (
                                    <Grid item xs={12} key={content.id || index}>
                                        <Box sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}>
                                            <Typography
                                                variant="subtitle1"
                                                sx={{
                                                    mb: 2,
                                                    fontWeight: 600,
                                                    color: 'primary.main',
                                                    borderBottom: '2px solid',
                                                    borderColor: 'primary.main',
                                                    pb: 1
                                                }}
                                            >
                                                Asset {index + 1}
                                            </Typography>
                                            <Grid container spacing={1}>
                                                <Grid item xs={6}>
                                                    <Button
                                                        fullWidth
                                                        startIcon={isGenerating ? <CircularProgress size={14} /> : <Zap size={14} />}
                                                        onClick={() => handleGenerateContent(action.slotId!)}
                                                        variant="outlined"
                                                        sx={{
                                                            minWidth: 'auto',
                                                            px: 1,
                                                            py: 0.5,
                                                            fontSize: '0.75rem',
                                                        }}
                                                    >
                                                        Generate Content
                                                    </Button>
                                                </Grid>

                                                <Grid item xs={6}>
                                                    <Button
                                                        fullWidth
                                                        startIcon={<Copy size={14} />}
                                                        onClick={() => handleCopyContent(parseGeneratedResult(content.generatedResult), index + 1)}
                                                        variant="outlined"
                                                        sx={{
                                                            minWidth: 'auto',
                                                            px: 1,
                                                            py: 0.5,
                                                            fontSize: '0.75rem',
                                                        }}
                                                    >
                                                        Copy Content
                                                    </Button>
                                                </Grid>
                                            </Grid>

                                            <br/>
                                            <Box sx={{
                                                flex: 1,
                                                p: 2,
                                                bgcolor: 'grey.50',
                                                borderRadius: 1,
                                                border: '1px solid',
                                                borderColor: 'grey.300',
                                                overflow: 'auto'
                                            }}>
                                                <MarkDownContentRenderer
                                                    content={parseGeneratedResult(content.generatedResult)}
                                                />
                                            </Box>
                                            <br/>
                                            <Grid container spacing={1}>
                                                <Grid item xs={6}>
                                                    <Button
                                                        fullWidth
                                                        startIcon={<Zap size={14} />}
                                                        onClick={() => handleCopyContent(parseGeneratedResult(content.generatedResult), index + 1)}
                                                        variant="outlined"
                                                        sx={{
                                                            minWidth: 'auto',
                                                            px: 1,
                                                            py: 0.5,
                                                            fontSize: '0.75rem',
                                                        }}
                                                    >
                                                        Regenerate Content
                                                    </Button>
                                                </Grid>

                                                <Grid item xs={6}>
                                                    <Button
                                                        fullWidth
                                                        startIcon={<Copy size={14} />}
                                                        onClick={() => handleCopyContent(parseGeneratedResult(content.generatedResult), index + 1)}
                                                        variant="outlined"
                                                        sx={{
                                                            minWidth: 'auto',
                                                            px: 1,
                                                            py: 0.5,
                                                            fontSize: '0.75rem',
                                                        }}
                                                    >
                                                        Copy Content
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                            <br/>
                                            <Typography>
                                                Additional Prompt
                                            </Typography>
                                            <br/>
                                            <TextField
                                                label="Additional Prompt"
                                                multiline
                                                rows={2}
                                                variant="outlined"
                                                fullWidth
                                            />

                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>

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