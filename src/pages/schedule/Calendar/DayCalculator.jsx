
import React, { useState, useEffect } from "react";

const DayCalculator = ({ selectedDate, selectedEndDate, refresh }) => {
    const [dates, setDates] = useState([]);
    const [startType, setStartType] = useState("Blue");
    const [calculatedDays, setCalculatedDays] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    // Fetch events2 dates in range automatically
    const [events, setEvents] = useState([]);
    useEffect(() => {
        const fetchDates = async () => {
            setLoading(true);
            setSaved(false);
            if (!selectedDate || !selectedEndDate) {
                setDates([]);
                setEvents([]);
                setLoading(false);
                return;
            }
            // Always generate full range
            const start = new Date(selectedDate);
            const end = new Date(selectedEndDate);
            let allDates = [];
            let d = new Date(start);
            while (d <= end) {
                allDates.push(new Date(d));
                d.setDate(d.getDate() + 1);
            }
            setDates(allDates);
            // Fetch events for marking special/off days
            const params = new URLSearchParams({
                selectedDate,
                selectedEndDate,
            });
            const res = await fetch(`/api/schedule/events2?${params}`);
            const eventsData = await res.json();
            setEvents(eventsData);
            setLoading(false);
        };
        fetchDates();
    }, [selectedDate, selectedEndDate]);

    // Calculate Blue/Gray for weekdays and automatically save
    const calculateDays = async () => {
        let type = startType;
        const result = dates.map(date => {
            const dayOfWeek = date.getDay();
            const dateStr = date.toISOString().slice(0, 10);
            const eventForDay = events.find(ev => {
                const evStart = new Date(ev.startDate);
                const evEnd = new Date(ev.endDate);
                return date >= evStart && date <= evEnd;
            });
            let dayType = "";
            let debugReason = "";
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                dayType = "Weekend";
                debugReason = "Weekend";
            } else if (eventForDay && (eventForDay.offDay === true || eventForDay.isOffDay === true)) {
                dayType = "OffDay";
                debugReason = `OffDay: offDay=${eventForDay.offDay}, isOffDay=${eventForDay.isOffDay}`;
            } else if (eventForDay && eventForDay.specialSchedule !== false) {
                dayType = "Special";
                debugReason = `Special: specialSchedule=${eventForDay.specialSchedule}`;
            } else if (dayOfWeek >= 1 && dayOfWeek <= 5) {
                dayType = type;
                debugReason = `Weekday: ${type}`;
                type = type === "Blue" ? "Gray" : "Blue";
            } else {
                dayType = "Special";
                debugReason = "Other: Special";
            }
            return { date: dateStr, dayType, debugReason, eventForDay };
        });
        setCalculatedDays(result);
        // Debug printout
        console.log("DayCalculator Debug Output:");
        result.forEach(day => {
            console.log(`Date: ${day.date}, Type: ${day.dayType}, Reason: ${day.debugReason}, Event:`, day.eventForDay);
        });
        // Automatically save after calculation
        setLoading(true);
        // Group by consecutive dayType and collect ranges
        let start = null, end = null, currentType = null;
        const ranges = [];
        for (let i = 0; i < result.length; i++) {
            const { date, dayType } = result[i];
            if (currentType === null) {
                start = date;
                end = date;
                currentType = dayType;
            } else if (dayType === currentType) {
                end = date;
            } else {
                ranges.push({ startDate: start, endDate: result[i-1].date, dayType: currentType });
                start = date;
                end = date;
                currentType = dayType;
            }
        }
        if (start && end && currentType) {
            ranges.push({ startDate: start, endDate: end, dayType: currentType });
        }
        console.log('[saveDays] Sending ranges:', ranges);
        await fetch("/api/schedule/dayCache", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ranges })
        });
        setLoading(false);
        setSaved(true);
        refresh(); // Trigger parent refresh
    };

    // Removed saveDays, now handled in calculateDays

    return (
        <div className="day-calculator p-6 bg-gray-50 rounded-lg shadow-md max-w-2xl w-1/2 mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">Day Calculator</h2>
            <div className="mb-4 flex gap-4 items-center">
                <label className="font-medium text-gray-700">Start Day Type:</label>
                <select
                    value={startType}
                    onChange={e => setStartType(e.target.value)}
                    className="p-2 border rounded bg-white text-gray-800"
                >
                    <option value="Blue">Blue</option>
                    <option value="Gray">Gray</option>
                </select>
            </div>
            <div className="flex gap-4 mb-6">
                <button
                    onClick={calculateDays}
                    disabled={loading || !dates.length}
                    className={`px-4 py-2 rounded text-white font-semibold transition-all duration-200 ${loading || !dates.length ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                    Calculate & Save Days
                </button>
            </div>
            {loading && <div className="text-gray-500 mb-2">Loading...</div>}
            {saved && <div className="text-green-600 font-semibold mb-2">Saved!</div>}
            <div className="calculated-days mt-6">
                {/* <h4 className="text-lg font-bold mb-2 text-blue-600">Calculated Days</h4>
                {calculatedDays.length === 0 ? (
                    <div className="text-gray-500">No days calculated yet.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {calculatedDays.map(({ date, dayType, debugReason, eventForDay }) => (
                            <div
                                key={date}
                                className={`p-3 rounded shadow-sm border-l-4 flex flex-col gap-1
                                    ${dayType === 'OffDay' ? 'border-red-500 bg-red-50' :
                                      dayType === 'Special' ? 'border-yellow-500 bg-yellow-50' :
                                      dayType === 'Weekend' ? 'border-gray-500 bg-gray-100' :
                                      dayType === 'Blue' ? 'border-blue-500 bg-blue-50' :
                                      dayType === 'Gray' ? 'border-gray-400 bg-gray-50' :
                                      'border-gray-300 bg-white'}`}
                            >
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-gray-800">{date}</span>
                                    <span className={`px-2 py-1 rounded text-xs font-bold
                                        ${dayType === 'OffDay' ? 'bg-red-200 text-red-800' :
                                          dayType === 'Special' ? 'bg-yellow-200 text-yellow-800' :
                                          dayType === 'Weekend' ? 'bg-gray-300 text-gray-800' :
                                          dayType === 'Blue' ? 'bg-blue-200 text-blue-800' :
                                          dayType === 'Gray' ? 'bg-gray-200 text-gray-800' :
                                          'bg-gray-100 text-gray-700'}`}
                                    >{dayType}</span>
                                </div>
                                {eventForDay && (
                                    <div className="text-xs text-gray-700 mt-1">
                                        <span className="font-medium">Event:</span> {eventForDay.title || 'Untitled'}<br />
                                        {eventForDay.description && <span>{eventForDay.description}</span>}
                                    </div>
                                )}
                                <div className="text-xs text-gray-500 mt-1">{debugReason}</div>
                            </div>
                        ))}
                    </div>
                )} */}
            </div>
        </div>
    );
};

export default DayCalculator;
