const CalendarDay = ({ day, month, year,  onClick, selectedDate, selectedEndDate, isCurrentMonth, onRightClick, dayType }) => {
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

        // Define base colors for different day types
        const baseColors = {
            Blue: '#4a90e2',
            Gray: '#9e9e9e',
            weekend: '#ffffff',
            special: '#66bb6a',
            offDay: '#ef5350',
            default: 'transparent'
        };
        
    // Get base color based on dayType (case-insensitive)
    let baseColor = baseColors.default;
    const type = typeof dayType === 'string' ? dayType.toLowerCase() : '';
    if (type === 'offday') {
        baseColor = baseColors.offDay;
    } else if (type === 'blue') {
        baseColor = baseColors.Blue;
    } else if (type === 'gray') {
        baseColor = baseColors.Gray;
    } else if (type === 'special') {
        baseColor = baseColors.special;
    } else if (!type || dateObj.getDay() === 0 || dateObj.getDay() === 6) {
        baseColor = baseColors.weekend;
    }

        // Border logic
        let borderWidth = '0px';
        if (selectedDateObj && selectedEndDateObj) {
            if (isSameDay(dateObj, selectedDateObj)) {
                borderWidth = '3px'; // Start date
            } else if (isSameDay(dateObj, selectedEndDateObj)) {
                borderWidth = '2px'; // End date
            } else if (dateObj > selectedDateObj && dateObj < selectedEndDateObj) {
                borderWidth = '1px'; // In between
            }
            else if (isSameDay(selectedDateObj, selectedEndDateObj) && isSameDay(dateObj, selectedDateObj)) {
                borderWidth = '4px'; // Single selected date
        } else if (isSameDay(dateObj, selectedDateObj)) {
            borderWidth = '4px'; // Single selected date
        }
    }

    return (
        <div
            className={`calendar-day ${!isCurrentMonth ? 'not-current-month' : ''} day-type-${dayType}`}
            onClick={() => onClick(dateObj)}
            onContextMenu={e => {
                e.preventDefault();
                if (onRightClick) onRightClick(dateObj);
            }}
                style={{ 
                    backgroundColor: baseColor,
                    color: !isCurrentMonth
                        ? '#b0b0b0' // Gray text for previous/next month
                        : (baseColor === '#ffffff' ? '#000' : (baseColor !== 'transparent' ? '#fff' : undefined)),
                    border: borderWidth !== '0px' ? `${borderWidth} solid #000` : 'none',
                    boxSizing: 'border-box'
                }}
            title={dayType}
        >
            {day}
        </div>
    );

}

export default CalendarDay;
