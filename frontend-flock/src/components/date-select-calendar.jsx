import React, { useState } from 'react';
import '../styles/date-select-calendar.css';

const CalendarComponent = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);

    // Helper function to change the month
    const changeMonth = (offset) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() + offset);
        setCurrentDate(newDate);
    };

    // Helper function to select a date
    const selectDate = (day) => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        setSelectedDate(newDate);
    };

    // Helper function to get the days of the week
    const getDaysOfWeek = () => {
        return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    };

    // Helper function to populate the days in the current month, including adjacent months
    const getDaysInMonth = () => {
        const daysInMonth = [];
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const startDay = firstDayOfMonth.getDay(); // Day of week (0-6)
        const totalDays = lastDayOfMonth.getDate();

        // Previous month details
        const prevMonth = month === 0 ? 11 : month - 1;
        const prevYear = month === 0 ? year - 1 : year;
        const lastDayPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();

        // Fill in the days from the previous month
        for (let i = startDay - 1; i >= 0; i--) {
            daysInMonth.push({
                day: lastDayPrevMonth - i,
                isCurrentMonth: false,
            });
        }

        // Fill in the days of the current month
        for (let day = 1; day <= totalDays; day++) {
            daysInMonth.push({
                day,
                isCurrentMonth: true,
            });
        }

        // Next month details
        const nextMonth = month === 11 ? 0 : month + 1;
        const nextYear = month === 11 ? year + 1 : year;

        // Calculate how many cells are needed to complete the last week
        const remainingCells = 7 - (daysInMonth.length % 7);
        if (remainingCells < 7) {
            for (let day = 1; day <= remainingCells; day++) {
                daysInMonth.push({
                    day,
                    isCurrentMonth: false,
                    nextMonth: true,
                });
            }
        }

        return daysInMonth;
    };

    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();

    return (
        <div className="calendar-container" style={{ width: '30%' }}>
            <div className="calendar-header">
                <button onClick={() => changeMonth(-1)}>{'<'}</button>
                <span id="month-year">{`${monthName} ${year}`}</span>
                <button onClick={() => changeMonth(1)}>{'>'}</button>
            </div>
            <table id="calendar-grid">
                <thead>
                    <tr>
                        {getDaysOfWeek().map((day, index) => (
                            <th key={index}>{day}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {getDaysInMonth().reduce((rows, dayObj, index) => {
                        if (index % 7 === 0) rows.push([]);
                        rows[rows.length - 1].push(dayObj);
                        return rows;
                    }, []).map((week, index) => (
                        <tr key={index}>
                            {week.map((dayObj, dayIndex) => (
                                <td
                                    key={dayIndex}
                                    onClick={dayObj.isCurrentMonth ? () => selectDate(dayObj.day) : undefined}
                                    className={`day-cell ${
                                        dayObj.isCurrentMonth ? 'current-month' : 'adjacent-month'
                                    } ${
                                        dayObj.isCurrentMonth && selectedDate &&
                                        dayObj.day === selectedDate.getDate()
                                            ? 'selected-date'
                                            : ''
                                    }`}
                                >
                                    {dayObj.day}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedDate && (
                <div className="selected-date-info">
                    <p>Selected Date: {selectedDate.toLocaleDateString()}</p>
                    <p></p>
                </div>
            )}
        </div>
    );
};

export default CalendarComponent;
