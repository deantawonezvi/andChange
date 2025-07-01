import React from 'react';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { Box, Paper, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface DataTableProps<T extends Record<string, unknown>> {
    data: T[];
    columns: MRT_ColumnDef<T>[];
    title?: string;
    subtitle?: string;
    enablePagination?: boolean;
    muiTableBodyRowProps?: any;
}

const DataTable = <T extends Record<string, unknown>>({
                                                          data,
                                                          columns,
                                                          title,
                                                          subtitle,
                                                          enablePagination = false,
                                                          muiTableBodyRowProps,
                                                      }: DataTableProps<T>) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    const responsiveColumns = React.useMemo(
        () =>
            columns.map((column) => ({
                ...column,
                size: isMobile ? 100 : isTablet ? 150 : 180,
            })),
        [columns, isMobile, isTablet]
    );

    return (
        <Paper
            sx={{
                width: '100%',
                overflow: 'hidden',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                borderRadius: '12px',
                backgroundColor: theme.palette.background.default,
                border: '2px solid #1e3a34'
            }}
        >
            {/* Header Section */}
            {(title || subtitle) && (
                <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                    {title && (
                        <Typography variant="h5" fontWeight="bold" color="primary" sx={{ mb: 1 }}>
                            {title}
                        </Typography>
                    )}
                    {subtitle && (
                        <Typography variant="body2" color="text.secondary">
                            {subtitle}
                        </Typography>
                    )}
                </Box>
            )}

            <MaterialReactTable
                columns={responsiveColumns}
                data={data}
                enableColumnFilters={true}
                enableGlobalFilter={true}
                enableFullScreenToggle={false}
                enableColumnActions={false}
                enableDensityToggle={false}
                enableHiding={false}
                enablePagination={enablePagination}

                muiTopToolbarProps={{
                    sx: {
                        padding: '12px 16px',
                        '& .MuiBox-root': {
                            gap: 2,
                        },
                        '& .MuiButton-root, & .MuiIconButton-root': {
                            border: '2px solid rgba(25, 118, 210, 0.3)',
                            borderRadius: '8px',
                            color: '#1a1f2c',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                                backgroundColor: '#1a1f2c',
                                color: 'white',
                                transform: 'translateY(-1px)',
                                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)',
                            },
                            '&[aria-pressed="true"]': {
                                backgroundColor: '#4caf50',
                                borderColor: '#4caf50',
                                color: 'white',
                            }
                        }
                    }
                }}
                muiTableHeadCellProps={{
                    sx: {
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        padding: '12px',
                        borderBottom: `2px solid ${theme.palette.primary.light}`,
                        position: 'relative',
                        '& .MuiIconButton-root': {
                            backgroundColor: 'rgba(25, 118, 210, 0.1)',
                            border: '2px solid rgba(25, 118, 210, 0.3)',
                            borderRadius: '8px',
                            padding: '6px',
                            margin: '2px',
                            color: '#1a1f2c',
                            fontSize: '1.1rem',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                                backgroundColor: '#1a1f2c',
                                color: 'white',
                                transform: 'scale(1.05)',
                                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)',
                            },

                            '&[aria-pressed="true"]': {
                                backgroundColor: '#4caf50',
                                color: 'white',
                                borderColor: '#4caf50',
                                boxShadow: '0 2px 8px rgba(76, 175, 80, 0.4)',
                            }
                        }
                    },
                }}



                muiTablePaperProps={{
                    elevation: 0,
                    sx: {
                        borderRadius: 0,
                    }
                }}
                muiTableBodyRowProps={muiTableBodyRowProps}
                muiTableBodyProps={{
                    sx: (theme) => ({
                        '& tr:nth-of-type(odd)': {
                            backgroundColor: theme.palette.action.hover,
                        },
                        '& tr:hover': {
                            backgroundColor: theme.palette.action.selected,
                        },
                    }),
                }}
                positionToolbarAlertBanner="bottom"
                muiSearchTextFieldProps={{
                    variant: 'outlined',
                    size: 'small',
                    sx: {
                        minWidth: { xs: '100%', sm: '300px' },
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: '#fafafa',
                            borderRadius: '8px',
                        }
                    },
                }}
                muiPaginationProps={{
                    rowsPerPageOptions: [5, 10, 25, 50],
                    showFirstButton: true,
                    showLastButton: true,
                    sx: {
                        '.MuiTablePagination-toolbar': {
                            flexWrap: 'wrap',
                            padding: '8px',
                        },
                        '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                            marginBottom: '0',
                        },
                    },
                }}
                initialState={{
                    pagination: {
                        pageIndex: 0,
                        pageSize: 10,
                    },
                    showColumnFilters: false,
                }}
            />
        </Paper>
    );
};

export default DataTable;