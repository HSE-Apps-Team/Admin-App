import React, { useEffect, useState } from "react";
import Head from "next/head";

import ReactLoading from "react-loading";

export default function EventPage() {
  const [events, setEvents] = useState(null);
  const [newEvent, setNewEvent] = useState({
    Date: "",
    Title: "",
    Description: "",
    ScheduleName: "",
  });
  const [specialSchedules, setSpecialSchedules] = useState(null);

  useEffect(() => {
    fetch("/api/schedule/events").then((res) => {
      res.json().then((data) => {
        setEvents(data);
      });
    });

    fetch("/api/schedule/special").then((res) => {
      res.json().then((data) => {
        console.log(data);
        setSpecialSchedules(data);
        setNewEvent((prev) => ({
          ...prev,
          ScheduleName: data[0].Name,
        }));
      });
    });
  }, []);

  const handleFormChange = (e) => {
    if (e.target.id == "noSchool") {
      if (e.target.checked) {
        setNewEvent((prev) => {
          return {
            ...prev,
            NoSchoolText: "",
          };
        });
        return;
      } else {
        setNewEvent((prev) => {
          const newEvent = { ...prev };
          delete newEvent.NoSchoolText;
          return {
            ...newEvent,
          };
        });
        console.log(newEvent);
        return;
      }
    }

    setNewEvent((prev) => {
      return {
        ...prev,
        [e.target.id]: e.target.value,
      };
    });
    console.log(newEvent);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("/api/schedule/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEvent),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data._id) {
          alert("Event Successfully Added!");
          setNewEvent({
            Date: "",
            Title: "",
            Description: "",
            ScheduleName: specialSchedules[0].Name,
          });

          setEvents((prev) => {
            return [...prev, { ...newEvent, _id: data._id }];
          });
        }
      });
  };

  const handleDelete = (id) => {
    fetch("/api/schedule/events/", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
      }),
    }).then((res) => {
      if (res.status == 200) {
        setEvents((prev) => {
          const newEvents = [...prev];
          newEvents.splice(
            newEvents.findIndex((a) => a._id == id),
            1
          );
          return newEvents;
        });
      }
    });
  };

  if (!events || !specialSchedules) {
    return (
      <div className="flex w-full h-100vh items-center justify-center">
        <ReactLoading type="spin" color="#101010" />
      </div>
    );
  }
  return (
    <>
      <Head>
        <title>Events</title>
      </Head>
      <div className="flex flex-nowrap mb-8 w-full">
        <div className="flex flex-col w-fit justify-center px-5">
          <h1 className="text-lg font-semibold mb-2">Events</h1>
          <div>
            {events.map((event) => (
              <div className="py-2 px-5 bg-gray-100 rounded-lg mb-3">
                <div className="flex justify-between items-center">
                  <h1 className="text-lg font-light">{event.Title}</h1>
                  <svg
                    onClick={() => handleDelete(event._id)}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-red-600 cursor-pointer hover:text-red-800"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                </div>
                <h1 className="text-sm mb-1">{event.Date}</h1>
                <h1 className="text-sm">
                  <span className="font-semibold">Schedule:</span>{" "}
                  {event.ScheduleName}
                </h1>
                <h1 className="text-sm w-fit">
                  <span className="font-semibold">Description:</span>{" "}
                  {event.Description}
                </h1>
                {event.NoSchoolText && (
                  <h1 className="text-sm w-fit">
                    <span className="font-semibold">No School Text:</span>{" "}
                    {event.NoSchoolText}
                  </h1>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="w-full mr-5 flex">
          <form
            onSubmit={handleSubmit}
            className="py-2 px-5 bg-gray-100 h-fit rounded-lg min-w-[25rem]"
          >
            <h1 className="text-lg font-semibold mb-3">New Event</h1>
            <div className="flex flex-col gap-y-2 ">
              <div>
                <h1 className="mb-1">Date:</h1>
                <input
                  required
                  id="Date"
                  type="date"
                  value={newEvent.Date}
                  className="rounded-md py-1 "
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <h1 className="mb-1">Title:</h1>
                <input
                  required
                  id="Title"
                  type="text"
                  value={newEvent.Title}
                  className="rounded-md w-full py-1 px-1"
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <h1 className="mb-1">Description:</h1>
                <input
                  required
                  id="Description"
                  type="text"
                  value={newEvent.Description}
                  className="rounded-md w-full py-1 px-1"
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <label className="hover:cursor-pointer">
                  <input
                    type="checkbox"
                    id="noSchool"
                    onChange={handleFormChange}
                  />
                  {"  "}
                  No School Day
                </label>
              </div>
              <div
                className={newEvent.NoSchoolText != null ? "block" : "hidden"}
              >
                <h1 className="mb-1">No School Text:</h1>
                <input
                  required
                  id="NoSchoolText"
                  type="text"
                  value={newEvent.NoSchoolText}
                  className="rounded-md w-full"
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <h1 className="mb-1">Special Schedule:</h1>
                <select
                  required
                  id="ScheduleName"
                  type="choose"
                  value={newEvent.ScheduleName}
                  className="rounded-md w-full py-1 px-1 disabled:bg-slate-400"
                  onChange={handleFormChange}
                  disabled={newEvent.NoSchoolText != null}
                >
                  {specialSchedules.map((schedule) => (
                    <option value={schedule.Name}>{schedule.Name}</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="px-3 py-2 bg-blue-600 mt-5 text-white rounded-lg mb-1"
            >
              Submit
            </button>
          </form>
          <div className="w-full flex justify-center">
            {newEvent.ScheduleName &&
              specialSchedules
                .filter((schedule) => schedule.Name === newEvent.ScheduleName)
                .map((schedule) => {
                  return (
                    <div className="flex flex-col items-center">
                      <h1 className="text-lg font-light mb-3">
                        {schedule.Name} - {schedule.SpecialType}
                      </h1>
                      {schedule.data.map((period) => {
                        return (
                          !period.isPassing && (
                            <div className="flex flex-col gap-y-1">
                              <h1 className="text-sm font-semibold">
                                {period.periodName}
                              </h1>
                              <h1 className="text-sm ml-2">
                                {period.startTime} - {period.endTime}
                              </h1>
                              {period.lunchPeriods &&
                                Object.keys(period.lunchPeriods).map((key) => {
                                  return (
                                    <div className="ml-5">
                                      <h1 className="text-sm font-semibold">
                                        {key} Lunch
                                      </h1>
                                      <h1 className="text-sm ml-2">
                                        {period.lunchPeriods[key].startTime} -{" "}
                                        {period.lunchPeriods[key].endTime}
                                      </h1>
                                    </div>
                                  );
                                })}
                            </div>
                          )
                        );
                      })}
                    </div>
                  );
                })}
          </div>
        </div>
      </div>
    </>
  );
}
