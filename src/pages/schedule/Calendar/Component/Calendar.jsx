import React, { useEffect, useState } from 'react';
import CalendarDay from './Day';

const Calendar = ({ month, selectedDate, setSelectedDate, selectedEndDate, setSelectedEndDate, refreshHelper }) => {
    const [dayCache, setDayCache] = useState([]);

    useEffect(() => {
        const fetchDayCache = async () => {
            const year = month.getFullYear();
            const monthIndex = month.getMonth() + 1; // API expects 1-based month
            try {
                const res = await fetch(`/api/schedule/dayCache?month=${monthIndex}&year=${year}`);
                if (res.ok) {
                    const data = await res.json();
                    // Flatten days for easy lookup
                    const daysMap = {};
                    data.forEach(entry => {
                        entry.days.forEach(d => {
                            daysMap[`${entry.year}-${entry.month}-${d.day}`] = d.dayType;
                        });
                    });
                    setDayCache(daysMap);
                } else {
                    setDayCache([]);
                }
            } catch {
                setDayCache([]);
            }
        };
        fetchDayCache();
    }, [month, refreshHelper]);
    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
    
    const renderCalendarDays = () => {
        const year = month.getFullYear();
        const monthIndex = month.getMonth();
        
        const daysInMonth = getDaysInMonth(year, monthIndex);
        const firstDayOfMonth = getFirstDayOfMonth(year, monthIndex);
        
        // Calculate days from previous month to display
        const daysFromPrevMonth = firstDayOfMonth;
        const prevMonthDays = getDaysInMonth(year, monthIndex - 1);
        
        // Calculate days from next month to display
        const totalDaysToDisplay = 42; // 6 rows of 7 days
        const daysFromNextMonth = totalDaysToDisplay - daysInMonth - daysFromPrevMonth;
        
        const days = [];
        
        // Add days from previous month
        for (let i = 0; i < daysFromPrevMonth; i++) {
            const day = prevMonthDays - daysFromPrevMonth + i + 1;
            const prevMonth = monthIndex === 0 ? 11 : monthIndex - 1;
            const prevYear = monthIndex === 0 ? year - 1 : year;
            const key = `${prevYear}-${prevMonth + 1}-${day}`;
            days.push({
                day,
                month: monthIndex - 1,
                year,
                isCurrentMonth: false,
                dayType: dayCache[key] || undefined
            });
        }

        // Add days from current month
        for (let i = 1; i <= daysInMonth; i++) {
            const key = `${year}-${monthIndex + 1}-${i}`;
            days.push({
                day: i,
                month: monthIndex,
                year,
                isCurrentMonth: true,
                dayType: dayCache[key] || undefined
            });
        }

        // Add days from next month
        for (let i = 1; i <= daysFromNextMonth; i++) {
            const nextMonth = monthIndex === 11 ? 0 : monthIndex + 1;
            const nextYear = monthIndex === 11 ? year + 1 : year;
            const key = `${nextYear}-${nextMonth + 1}-${i}`;
            days.push({
                day: i,
                month: monthIndex + 1,
                year,
                isCurrentMonth: false,
                dayType: dayCache[key] || undefined
            });
        }

        return days;
    };

    const isDateSelected = (day, month, year) => {
        if (!selectedDate) return false;
        return (
            selectedDate.getDate() === day &&
            selectedDate.getMonth() === month &&
            selectedDate.getFullYear() === year
        );
    };

    const handleDateClick = (day, month, year) => {
        // Create a new date object for the clicked date
        const newDate = new Date(year, month, day);
        
        // If clicked date is after selected end date, swap them
        if (selectedEndDate && newDate > selectedEndDate) {
            setSelectedDate(selectedEndDate);
            setSelectedEndDate(newDate);
            return;
        }
        
        setSelectedDate(newDate);
    };

    const handleRightClick = (day, month, year) => {
        // Prevent right-click context menu
        event.preventDefault();

        // If right-clicked date is before selected date, swap them
        const newEndDate = new Date(year, month, day);
        if (selectedDate && newEndDate < selectedDate) {
            setSelectedEndDate(selectedDate);
            setSelectedDate(newEndDate);
            return;
        }
        setSelectedEndDate(new Date(year, month, day));
    };

    const days = renderCalendarDays();
    
    return (
        <div className="calendar">
            <div className="calendar-header">
                <div className="weekday">Sun</div>
                <div className="weekday">Mon</div>
                <div className="weekday">Tue</div>
                <div className="weekday">Wed</div>
                <div className="weekday">Thu</div>
                <div className="weekday">Fri</div>
                <div className="weekday">Sat</div>
            </div>
            <div className="calendar-grid">
                {days.map((day, index) => (
                        <CalendarDay
                            key={index}
                            day={day.day}
                            month={day.month}
                            year={day.year}
                            isCurrentMonth={day.isCurrentMonth}
                            dayType={day.dayType}
                            selectedDate={selectedDate}
                            selectedEndDate={selectedEndDate}
                            onClick={() => handleDateClick(day.day, day.month, day.year)}
                            onRightClick={() => handleRightClick(day.day, day.month, day.year)}
                        />
                ))}
            </div>
        </div>
    );
};

export default Calendar;
