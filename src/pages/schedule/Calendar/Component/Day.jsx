const CalendarDay = ({ day, month, year,  onClick, selectedDate, selectedEndDate, isCurrentMonth, onRightClick }) => {
    // Only render if day, month, year are valid numbers
    if (typeof day !== 'number' || typeof month !== 'number' || typeof year !== 'number') {
        return (
            <div className={`calendar-day`} style={{ backgroundColor: 'transparent' }}>
                {/* No date available */}
            </div>
        );
    }
        const dateObj = new Date(year, month, day);

        // Ensure selectedDate and selectedEndDate are Date objects
        const toDate = (d) => {
            if (!d) return null;
            if (d instanceof Date) return d;
            if (typeof d === 'string') {
                // Handles 'YYYY-MM-DD' or ISO strings
                return new Date(d);
            }
            return null;
        };
        const selectedDateObj = toDate(selectedDate);
        const selectedEndDateObj = toDate(selectedEndDate);

    // Helper to compare dates (ignoring time)
        const isSameDay = (d1, d2) => d1 instanceof Date && d2 instanceof Date && d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();

        let bgColor = 'transparent';
        if (isSameDay(dateObj, selectedDateObj)) {
            bgColor = '#546372ff'; // darkest for start
        } else if (isSameDay(dateObj, selectedEndDateObj)) {
            bgColor = '#465b70ff'; // slightly less for end
        } else if (
            selectedDateObj && selectedEndDateObj &&
            dateObj > selectedDateObj && dateObj < selectedEndDateObj
        ) {
            bgColor = '#697077ff'; // lighter for middle
        }

    return (
        <div
            className={`calendar-day ${!isCurrentMonth ? 'not-current-month' : ''}`}
            onClick={() => onClick(dateObj)}
            onContextMenu={e => {
                e.preventDefault();
                if (onRightClick) onRightClick(dateObj);
            }}
            style={{ backgroundColor: bgColor, color: bgColor !== 'transparent' ? '#fff' : undefined }}
        >
            {day}
        </div>
    );

}

export default CalendarDay;
