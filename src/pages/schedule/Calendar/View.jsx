import Calendar from "./Component/Calendar";
import CalendarNavbar from "./Component/Navbar";
import EventEditor from "./EventEditor";
import React from "react";
import DayCalculator from "./DayCalculator";
import EventTypeEditor from "./EventTypeEditor";

// parent component for the whole calendar editor system
// does some styling and refreshing

// the refresh system, so that all of the data is kept in sync, 
// works by having a useState just cycle between 0 and 1, allowing for useEffects to re-run

const CalendarView = () => {
  const today = new Date();
  const [month, setMonth] = React.useState(today);
  const [selectedDate, setSelectedDate] = React.useState(today);
  const [selectedEndDate, setSelectedEndDate] = React.useState(today);
  const [selectedYear, setSelectedYear] = React.useState(today.getFullYear());

    const [refreshHelper, setRefreshHelper] = React.useState(0);

    const refresh = () => setRefreshHelper(prev => prev === 0 ? 1 : 0);

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ width: '40%' }}>
          <CalendarNavbar month={month} setMonth={setMonth} refresh={refresh} />  
          <Calendar
            month={month}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedEndDate={selectedEndDate}
            setSelectedEndDate={setSelectedEndDate}
            refreshHelper={refreshHelper}
          />
          <p> Left click to set start date, Right Click to set end date</p>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
            <DayCalculator selectedDate={selectedDate} selectedEndDate={selectedEndDate} refresh={refresh} refreshHelper={refreshHelper} />
          </div>
        </div>
        <div style={{ width: '67%', display: 'flex', flexDirection: 'row' }}>
            <EventEditor
              selectedDate={selectedDate}
              selectedEndDate={selectedEndDate}
              setSelectedDate={setSelectedDate}
              setSelectedEndDate={setSelectedEndDate}
              refresh={refresh}
              refreshHelper={refreshHelper}
            />
          <EventTypeEditor refresh={refresh} refreshHelper={refreshHelper} />
        </div>
      </div>
    </div>
  );
};

export default CalendarView;    

