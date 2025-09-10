
import React, { useEffect, useState } from 'react';
import CalendarDay from './Day';

const Calendar = ({ month, selectedDate, setSelectedDate, selectedEndDate, setSelectedEndDate, refreshHelper }) => {
    const [dayCache, setDayCache] = useState([]);
    const [events, setEvents] = useState([]);
    const [eventTypes, setEventTypes] = useState([]);

    useEffect(() => {
        if (!month) return;
        const fetchDayCache = async () => {
            if (!month) return;
            const year = month.getFullYear?.();
            const monthIndex = month.getMonth?.() + 1; // API expects 1-based month
            if (year === undefined || monthIndex === undefined) return;
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

        // Fetch events for the current month
        const fetchEvents = async () => {
            if (!month) return;
            const year = month.getFullYear?.();
            const monthIndex = month.getMonth?.() + 1;
            if (year === undefined || monthIndex === undefined) return;
            try {
                const res = await fetch(`/api/schedule/events2`);
                if (res.ok) {
                    const data = await res.json();
                    setEvents(data);
                } else {
                    setEvents([]);
                }
            } catch {
                setEvents([]);
            }
        };
        fetchEvents();

        // Fetch event types
        const fetchEventTypes = async () => {
            try {
                const res = await fetch(`/api/schedule/eventTypes`);
                if (res.ok) {
                    const data = await res.json();
                    setEventTypes(data);
                } else {
                    setEventTypes([]);
                }
            } catch {
                setEventTypes([]);
            }
        };
        fetchEventTypes();
    }, [month, refreshHelper]);
    const getDaysInMonth = (year, month) => {
        if (typeof year !== 'number' || typeof month !== 'number') return 0;
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year, month) => {
        if (typeof year !== 'number' || typeof month !== 'number') return 0;
        return new Date(year, month, 1).getDay();
    };

    const renderCalendarDays = () => {
        if (!month || typeof month.getFullYear !== 'function' || typeof month.getMonth !== 'function') return [];
        const year = month.getFullYear();
        const monthIndex = month.getMonth();
        if (typeof year !== 'number' || typeof monthIndex !== 'number') return [];

        const daysInMonth = getDaysInMonth(year, monthIndex);
        const firstDayOfMonth = getFirstDayOfMonth(year, monthIndex);

        // Calculate days from previous month to display
        const daysFromPrevMonth = firstDayOfMonth;
        const prevMonthDays = getDaysInMonth(year, monthIndex - 1);

        // Calculate days from next month to display
        const totalDaysToDisplay = 42; // 6 rows of 7 days
        const daysFromNextMonth = totalDaysToDisplay - daysInMonth - daysFromPrevMonth;

        const days = [];

        // Helper to get event colors for a given day
        const getEventColorsForDay = (day, month, year) => {
            if (typeof year !== 'number' || typeof month !== 'number' || typeof day !== 'number') return [];
            const dayStr = `${year}-${month + 1}-${day}`;
            const current = new Date(year, month, day);
            // Helper to compare only date part
            const isSameOrBetween = (date, start, end) => {
                if (!date || !start || !end) return false;
                if (typeof date.getFullYear !== 'function' || typeof start.getFullYear !== 'function' || typeof end.getFullYear !== 'function') return false;
                const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                const s = new Date(start.getFullYear(), start.getMonth(), start.getDate());
                const e = new Date(end.getFullYear(), end.getMonth(), end.getDate());
                return d >= s && d <= e;
            };
            const dayEvents = events.filter(ev => {
                if (!ev.startDate || !ev.endDate) return false;
                const start = new Date(ev.startDate);
                const end = new Date(ev.endDate);
                return isSameOrBetween(current, start, end);
            });
            const colors = dayEvents.map(ev => {
                const type = eventTypes.find(et => et.name === ev.eventType);
                return type ? type.color : undefined;
            }).filter(Boolean);
            return colors;
        };

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
                dayType: dayCache[key] || undefined,
                eventColors: getEventColorsForDay(day, prevMonth, prevYear)
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
                dayType: dayCache[key] || undefined,
                eventColors: getEventColorsForDay(i, monthIndex, year)
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
                dayType: dayCache[key] || undefined,
                eventColors: getEventColorsForDay(i, nextMonth, nextYear)
            });
        }

        return days;
    };

    const isDateSelected = (day, month, year) => {
        if (!selectedDate || typeof selectedDate.getDate !== 'function' || typeof selectedDate.getMonth !== 'function' || typeof selectedDate.getFullYear !== 'function') return false;
        return (
            selectedDate.getDate() === day &&
            selectedDate.getMonth() === month &&
            selectedDate.getFullYear() === year
        );
    };

    const handleDateClick = (day, month, year) => {
        if (typeof year !== 'number' || typeof month !== 'number' || typeof day !== 'number') return;
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
        if (typeof event !== 'undefined' && event.preventDefault) event.preventDefault();
        if (typeof year !== 'number' || typeof month !== 'number' || typeof day !== 'number') return;
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

    // Defensive: If month is not ready, show loading or fallback
    if (!month || typeof month.getFullYear !== 'function' || typeof month.getMonth !== 'function') {
        return <div>Loading calendar...</div>;
    }

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
                        eventColors={day.eventColors}
                        onClick={() => handleDateClick(day.day, day.month, day.year)}
                        onRightClick={() => handleRightClick(day.day, day.month, day.year)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Calendar;
