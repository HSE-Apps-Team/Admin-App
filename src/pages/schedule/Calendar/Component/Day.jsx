const CalendarDay = ({ day, month, year,  onClick, selectedDate, selectedEndDate, isCurrentMonth, onRightClick, dayType, eventColors = [] }) => {

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
                    color: !isCurrentMonth ? '#222' : '#000',
                    opacity: !isCurrentMonth ? 0.5 : 1,
                    border: borderWidth !== '0px' ? `${borderWidth} solid #000` : 'none',
                    boxSizing: 'border-box',
                    position: 'relative',
                    backgroundColor: 'transparent',
                    transition: 'color 0.2s, opacity 0.2s',
                }}
                title={dayType}
            >
                <span style={{position: 'relative', zIndex: 2}}>{day}</span>
                <div
                    style={{
                        position: 'absolute',
                        left: 0,
                        bottom: 0,
                        width: '100%',
                        height: '15%',
                        backgroundColor: baseColor,
                        zIndex: 1,
                        borderBottomLeftRadius: '4px',
                        borderBottomRightRadius: '4px',
                    }}
                />
                {/* Render event colors as small dots or bars at the top of the cell */}
                {eventColors.length > 0 && (
                    <div style={{
                        position: 'absolute',
                        top: 2,
                        left: 2,
                        display: 'flex',
                        gap: '2px',
                        zIndex: 3,
                    }}>
                        {eventColors.map((color, idx) => (
                            <span key={idx} style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: color,
                                border: '1px solid #000',
                                boxShadow: '0 0 2px #0002',
                            }} />
                        ))}
                    </div>
                )}
            </div>
    );

}

export default CalendarDay;
