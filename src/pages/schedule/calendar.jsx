import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import ReactLoading from 'react-loading';
import CalendarImage from './Calendar/CalendarImage';

export default function CalendarEditor() {
  //image uploader
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  // Date Setter 
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [breakName, setBreakName] = useState(''); // Add this line

  const [loading, setLoading] = useState(true);  // State to manage loading data


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Start loading
      try {
        const responseCalendar = await fetch('/api/schedule/calendar', { method: 'GET' });
        if (responseCalendar.ok) {
          const dataCalendar = await responseCalendar.json();
          setImageUrl(dataCalendar.calendar_img);
        } else {
          console.error('Failed to fetch calendar data:', await responseCalendar.json());
        }

        const responseClock = await fetch('/api/schedule/break', { method: 'GET' });
        if (responseClock.ok) {
          const dataClock = await responseClock.json();
          if (dataClock.Start_Date) {
            setStartDate(dataClock.Start_Date);
          } else {
            console.error('Start Date is undefined or null');
          }
          setEndDate(dataClock.End_Date);
          setBreakName(dataClock.title);
        } else {
          console.error('Failed to fetch break clock data:', await responseClock.json());
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false); // Stop loading regardless of outcome
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex w-full h-100vh items-center justify-center">
        <ReactLoading type="spin" color="#000000" />
      </div>
    );
  }

  const handleSubmitClock = async (e) => {
    e.preventDefault();
  
    // Ensure the property names exactly match those expected by the backend
    const body = JSON.stringify({
      Start_Date: startDate, // Changed from Start_date to Start_Date
      End_Date: endDate,     // Ensure this matches exactly with the backend expectation
      title: breakName
    });
    console.log(body);
  
    const response = await fetch('/api/schedule/break', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: body
    });
  
    if (response.ok) {
      alert('Break Clock updated successfully!');
    } else {
      const errorData = await response.json();
      alert('Failed to update Break Clock: ' + errorData.message);
    }
  }

  return (
    <React.StrictMode>
    <Head>
      <title>Calendar Editor</title>
    </Head>
    <div className="container mx-auto mt-4 p-4">
      <div className="flex">
        <CalendarImage/>
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold mb-4">Break Clock Editor</h1>
          <input
            id="breakName"
            placeholder="Break Name"
            type="text"
            value={breakName}
            onChange={(e) => setBreakName(e.target.value)}
            className="p-2 border rounded-md"
          />
          <div className="flex mb-4">
            <div className="flex flex-col mr-4">
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                id="startDate"
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="p-2 border rounded-md"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                id="endDate"
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="p-2 border rounded-md"
              />
            </div>
          </div>
          <button
            onClick={handleSubmitClock}
            className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md self-end"
          >
            Save
          </button>
         
        </div>
      </div>
    </div>
  </React.StrictMode>
  );
}
