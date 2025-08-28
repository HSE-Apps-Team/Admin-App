import Calendar from "./Component/Calendar";
import CalendarNavbar from "./Component/Navbar";
import EventEditor from "./EventEditor";
import React from "react";

const CalendarView = () => {
    const [month, setMonth] = React.useState(new Date());
    const [selectedDate, setSelectedDate] = React.useState(null);
    const [selectedEndDate, setSelectedEndDate] = React.useState(null);

    const [selectedYear, setSelectedYear] = React.useState(null);

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ width: '50%' }}>
          <CalendarNavbar month={month} setMonth={setMonth} />  
          <Calendar
            month={month}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedEndDate={selectedEndDate}
            setSelectedEndDate={setSelectedEndDate}
          />
          <p> Left click to set start date, Right Click to set end date</p>
        </div>
        <EventEditor
          selectedDate={selectedDate}
          selectedEndDate={selectedEndDate}
          setSelectedDate={setSelectedDate}
          setSelectedEndDate={setSelectedEndDate}
          style={{ width: '50%' }}
        />
      </div>
    </div>
  );
};

export default CalendarView;    

