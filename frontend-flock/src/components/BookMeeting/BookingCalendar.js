// Chloe Gavrilovic 260955835
import * as React from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export default function BookingCalendar({ onDateChange }) {
    const [value, setValue] = React.useState(null); 

    const handleDateChange = (newValue) => {
        setValue(newValue); 
        if (onDateChange) {
            onDateChange(newValue);
        }
    };

    return (
        <div style={{ width: '100%', paddingTop: '7vh' }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar
                    value={value}
                    onChange={handleDateChange} 
                    minDate={dayjs(new Date())}
                    sx={{
                        backgroundColor: 'white',
                        borderRadius: '30px',
                        padding: '20px',
                        marginBottom: '5vh',
                        '& .MuiPickersDay-root': {
                            borderRadius: '50%',
                        },
                        '& .MuiButtonBase-root': {
                            '&:hover': {
                                backgroundColor: 'grey',
                            },
                        },
                        '& .MuiPickersDay-root.Mui-selected': {
                            backgroundColor: 'red !important',
                            color: 'white !important',
                        },
                    }}
                />
            </LocalizationProvider>
        </div>
    );
}
