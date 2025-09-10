import React from "react";

const CalendarNavbar = ({month, setMonth}) => {
    // Defensive: If month is not ready, show loading or fallback
    const isMonthValid = month && typeof month.toLocaleString === 'function' && typeof month.getFullYear === 'function' && typeof month.getMonth === 'function';

    return (
        <nav className="bg-gray-800 p-4">
            <div className="flex justify-between items-center">
                <button
                    onClick={() => {
                        if (!isMonthValid) return;
                        setMonth(prevMonth => {
                            if (!prevMonth || typeof prevMonth.getFullYear !== 'function' || typeof prevMonth.getMonth !== 'function') return prevMonth;
                            return new Date(prevMonth.getFullYear(), prevMonth.getMonth() - 1, 1);
                        });
                    }}
                    className="text-white hover:text-gray-300"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <h2 className="text-white text-xl font-bold">
                    {isMonthValid
                        ? month.toLocaleString('default', { month: 'long', year: 'numeric' })
                        : 'Loading...'}
                </h2>

                <button
                    onClick={() => {
                        if (!isMonthValid) return;
                        setMonth(prevMonth => {
                            if (!prevMonth || typeof prevMonth.getFullYear !== 'function' || typeof prevMonth.getMonth !== 'function') return prevMonth;
                            return new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 1);
                        });
                    }}
                    className="text-white hover:text-gray-300"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </nav>
    );
};

export default CalendarNavbar;

