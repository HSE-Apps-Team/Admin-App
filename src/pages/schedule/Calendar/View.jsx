import Calendar from "./Component/Calendar";
import CalendarNavbar from "./Component/Navbar";
import EventEditor from "./EventEditor";
import React from "react";
import DayCalculator from "./DayCalculator";

const CalendarView = () => {
    const [month, setMonth] = React.useState(new Date());
    const [selectedDate, setSelectedDate] = React.useState(null);
    const [selectedEndDate, setSelectedEndDate] = React.useState(null);

    const [selectedYear, setSelectedYear] = React.useState(null);

    const [refreshHelper, setRefreshHelper] = React.useState(0);

    const refresh = () => setRefreshHelper(prev => prev === 0 ? 1 : 0);

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ width: '50%' }}>
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
          <DayCalculator selectedDate={selectedDate} selectedEndDate={selectedEndDate} refresh={refresh} />
        </div>
        <EventEditor
          selectedDate={selectedDate}
          selectedEndDate={selectedEndDate}
          setSelectedDate={setSelectedDate}
          setSelectedEndDate={setSelectedEndDate}
          style={{ width: '50%' }}
          refresh={refresh}
        />
      </div>
    </div>
  );
};

export default CalendarView;    

