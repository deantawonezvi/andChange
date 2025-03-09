import React, { useState } from 'react';
import { TextField, Box, Paper, Popover, IconButton, Grid, Typography, Button } from '@mui/material';
import { format, parse, isValid, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface CustomDatePickerProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
    label?: string;
}

const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
                                                                      value,
                                                                      onChange,
                                                                      error,
                                                                      label
                                                                  }) => {
    // Convert the string value to a Date object for manipulation
    const parseDate = (dateStr: string) => {
        if (!dateStr) return new Date();

        // Try to parse the date from ISO format (YYYY-MM-DD)
        const parsedDate = parse(dateStr, 'yyyy-MM-dd', new Date());

        return isValid(parsedDate) ? parsedDate : new Date();
    };

    const [currentDate, setCurrentDate] = useState(parseDate(value));
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [inputValue, setInputValue] = useState(value ? format(parseDate(value), 'MM/dd/yyyy') : '');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);

        // Try to parse the input as MM/dd/yyyy
        const parsedDate = parse(newValue, 'MM/dd/yyyy', new Date());

        if (isValid(parsedDate)) {
            setCurrentDate(parsedDate);
            onChange(format(parsedDate, 'yyyy-MM-dd'));
        }
    };

    const handleDateClick = (date: Date) => {
        setCurrentDate(date);
        setInputValue(format(date, 'MM/dd/yyyy'));
        onChange(format(date, 'yyyy-MM-dd'));
        setAnchorEl(null);
    };

    const handlePrevMonth = () => {
        setCurrentDate(prevDate => subMonths(prevDate, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(prevDate => addMonths(prevDate, 1));
    };

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleToday = () => {
        const today = new Date();
        setCurrentDate(today);
        setInputValue(format(today, 'MM/dd/yyyy'));
        onChange(format(today, 'yyyy-MM-dd'));
    };

    const handleClear = () => {
        setInputValue('');
        onChange('');
    };

    const open = Boolean(anchorEl);

    // Generate the days for the current month
    const currentMonthStart = startOfMonth(currentDate);
    const currentMonthEnd = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start: currentMonthStart, end: currentMonthEnd });

    // Get the start day of the month (0 = Sunday, 1 = Monday, etc.)
    const startDay = currentMonthStart.getDay();

    // Create the grid, including empty slots for days from previous/next months
    const grid = [];

    // Add empty cells for days before the start of the month
    for (let i = 0; i < startDay; i++) {
        grid.push(null);
    }

    // Add the days of the current month
    grid.push(...days);

    // Calculate rows needed (6 rows maximum for a monthly calendar)
    const rows = Math.ceil(grid.length / 7);

    // Add empty cells to complete the last row if needed
    while (grid.length < rows * 7) {
        grid.push(null);
    }

    // Convert the grid to rows for easier rendering
    const calendarRows = [];
    for (let i = 0; i < rows; i++) {
        calendarRows.push(grid.slice(i * 7, (i + 1) * 7));
    }

    return (
        <Box>
            <TextField
                fullWidth
                value={inputValue}
                onChange={handleInputChange}
                placeholder="MM/DD/YYYY"
                label={label}
                error={!!error}
                helperText={error}
                InputProps={{
                    endAdornment: (
                        <IconButton onClick={handleOpen}>
                            <Calendar size={18} />
                        </IconButton>
                    )
                }}
            />

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <Paper sx={{ p: 2, width: 280 }}>
                    {/* Month Navigation */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <IconButton onClick={handlePrevMonth}>
                            <ChevronLeft size={18} />
                        </IconButton>

                        <Typography variant="subtitle1">
                            {format(currentDate, 'MMMM yyyy')}
                        </Typography>

                        <IconButton onClick={handleNextMonth}>
                            <ChevronRight size={18} />
                        </IconButton>
                    </Box>

                    {/* Days of the Week Header */}
                    <Grid container spacing={0}>
                        {daysOfWeek.map(day => (
                            <Grid
                                item
                                key={day}
                                xs={12/7}
                                sx={{
                                    textAlign: 'center',
                                    p: 0.5,
                                    fontWeight: 'bold',
                                    fontSize: '0.75rem',
                                    color: 'text.secondary'
                                }}
                            >
                                {day}
                            </Grid>
                        ))}
                    </Grid>

                    {/* Calendar Grid */}
                    {calendarRows.map((row, rowIndex) => (
                        <Grid container key={rowIndex} spacing={0}>
                            {row.map((day, colIndex) => (
                                <Grid
                                    item
                                    key={`${rowIndex}-${colIndex}`}
                                    xs={12/7}
                                >
                                    {day ? (
                                        <Button
                                            fullWidth
                                            onClick={() => handleDateClick(day)}
                                            sx={{
                                                minWidth: 0,
                                                p: 0.5,
                                                borderRadius: '50%',
                                                height: 32,
                                                width: 32,
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                margin: '2px auto',
                                                fontSize: '0.75rem',
                                                bgcolor: isToday(day)
                                                    ? 'primary.light'
                                                    : (value && isSameDay(day, parseDate(value)))
                                                        ? 'primary.main'
                                                        : 'transparent',
                                                color: isToday(day) || (value && isSameDay(day, parseDate(value)))
                                                    ? 'white'
                                                    : 'text.primary',
                                                '&:hover': {
                                                    bgcolor: isToday(day)
                                                        ? 'primary.main'
                                                        : (value && isSameDay(day, parseDate(value)))
                                                            ? 'primary.dark'
                                                            : 'action.hover',
                                                }
                                            }}
                                        >
                                            {format(day, 'd')}
                                        </Button>
                                    ) : (
                                        <Box sx={{
                                            height: 32,
                                            width: 32,
                                            margin: '2px auto',
                                        }} />
                                    )}
                                </Grid>
                            ))}
                        </Grid>
                    ))}

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Button
                            size="small"
                            variant="text"
                            onClick={handleClear}
                            sx={{ fontSize: '0.75rem' }}
                        >
                            Clear
                        </Button>

                        <Button
                            size="small"
                            variant="text"
                            onClick={handleToday}
                            sx={{ fontSize: '0.75rem' }}
                        >
                            Today
                        </Button>
                    </Box>
                </Paper>
            </Popover>
        </Box>
    );
};