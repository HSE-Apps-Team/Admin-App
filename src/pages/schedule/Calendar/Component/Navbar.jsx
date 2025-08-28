import React from "react";

const CalendarNavbar = ({month, setMonth}) => {
    
  return (
    <nav className="bg-gray-800 p-4">
    <div className="flex justify-between items-center">
        <button 
            onClick={() => setMonth(prevMonth => new Date(prevMonth.getFullYear(), prevMonth.getMonth() - 1, 1))}
            className="text-white hover:text-gray-300"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
        </button>
        
        <h2 className="text-white text-xl font-bold">
            {month.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        
        <button 
            onClick={() => setMonth(prevMonth => new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 1))}
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

