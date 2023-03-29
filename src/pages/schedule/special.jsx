import React, { useEffect, useState } from "react";
import Head from "next/head";

import ReactLoading from "react-loading";

export default function SpecialSchedules() {
  const [schedules, setSchedules] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState({
    Name: "Schedule Name",
    SpecialType: "Special Type",
    data: [],
  });
  const lunchTypes = ["A", "B", "C", "D"];

  useEffect(() => {
    fetch("/api/schedule/special").then((res) => {
      res.json().then((data) => {
        setSchedules(data);
      });
    });
  }, []);

  const handleAddPeriod = () => {
    setSelectedSchedule((prev) => ({
      ...prev,
      data: [
        ...prev.data,
        { periodName: "Period Name", startTime: "8:30 AM", endTime: "1:30 PM" },
      ],
    }));
  };

  const handleTitleChange = (e) => {
    setSelectedSchedule((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handlePeriodChange = (e, index) => {
    if (e.target.id == "isLunchPeriod") {
      if (e.target.checked) {
        setSelectedSchedule((prev) => {
          const newSchedule = { ...prev };
          newSchedule.data[index].lunchPeriods = {
            A: {
              startTime: "8:30 AM",
              endTime: "1:30 PM",
            },
          };
          return newSchedule;
        });
      } else {
        setSelectedSchedule((prev) => {
          const newSchedule = { ...prev };
          newSchedule.data[index].lunchPeriods = null;
          return newSchedule;
        });
      }
    }
    if (e.target.id == "isPassing") {
      setSelectedSchedule((prev) => {
        const newSchedule = { ...prev };
        newSchedule.data[index][e.target.id] = e.target.checked;
        newSchedule.data[index].periodName = "Passing Period";
        return newSchedule;
      });
      return;
    }
    setSelectedSchedule((prev) => {
      const newSchedule = { ...prev };
      newSchedule.data[index][e.target.id] = e.target.value;
      return newSchedule;
    });
  };

  const handleLunchChange = (e, index, lunchType) => {
    setSelectedSchedule((prev) => {
      const newSchedule = { ...prev };
      newSchedule.data[index].lunchPeriods[lunchType][e.target.id] =
        e.target.value;
      return newSchedule;
    });
  };

  const handleAddLunchType = (index) => {
    setSelectedSchedule((prev) => ({
      ...prev,
      data: [
        ...[...prev.data].slice(0, index),
        {
          ...prev.data[index],
          lunchPeriods: {
            ...prev.data[index].lunchPeriods,
            [lunchTypes[Object.keys(prev.data[index].lunchPeriods).length]]: {
              startTime: "8:30 AM",
              endTime: "1:30 PM",
            },
          },
        },
        ...[...prev.data].slice(index + 1),
      ],
    }));
  };

  const handleSave = () => {
    if (
      schedules.map((schedule) => schedule._id).includes(selectedSchedule._id)
    ) {
      fetch("/api/schedule/special", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedSchedule),
      }).then((res) => {
        if (res.status == 200) {
          alert("Schedule Successfully Saved!");
        }
      });

      setSchedules((prev) => {
        const newSchedules = [...prev];
        newSchedules[
          newSchedules.findIndex(
            (schedule) => schedule._id == selectedSchedule._id
          )
        ] = selectedSchedule;
        return newSchedules;
      });
    } else {
      fetch("/api/schedule/special", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedSchedule),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data._id) {
            alert("Schedule Successfully Saved!");
            setSchedules((prev) => [
              ...prev,
              { ...selectedSchedule, _id: data._id },
            ]);
          }
        });
    }
  };

  const handleSwitchSelected = (id) => {
    if (!id) {
      return setSelectedSchedule({
        Name: "Schedule Name",
        SpecialType: "Special Type",
        data: [],
      });
    }
    setSelectedSchedule(schedules.find((schedule) => schedule._id == id));
  };

  const handleDelete = (id) => {
    fetch("/api/schedule/special", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id: id }),
    });
    setSchedules((prev) => {
      const newSchedules = [...prev];
      newSchedules.splice(
        newSchedules.findIndex((schedule) => schedule._id == id),
        1
      );
      return newSchedules;
    });
  };
  if (!schedules) {
    return (
      <div className="flex w-full h-100vh items-center justify-center">
        <ReactLoading type="spin" color="#101010" />
      </div>
    );
  }
  return (
    <React.StrictMode>
      <Head>
        <title>Special Schedules</title>
      </Head>
      <div className="flex flex-nowrap mb-8 w-full">
        <div className="flex w-fit justify-center px-5">
          <div>
            <h1 className="text-lg font-semibold mb-2">Special Schedules</h1>
            <div
              onClick={() => {
                handleSwitchSelected(null);
              }}
              className={`flex gap-x-2 items-center py-2 px-5 bg-gray-100 hover:cursor-pointer hover:bg-gray-200 rounded-lg mb-3 ${
                !selectedSchedule._id && "bg-gray-300"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>

              <h1 className="text-lg font-light">New Schedule</h1>
            </div>
            {schedules.map((schedule) => (
              <div
                onClick={() => {
                  handleSwitchSelected(schedule._id);
                }}
                className={`py-2 px-5 bg-gray-100 hover:cursor-pointer hover:bg-gray-200 rounded-lg mb-3 ${
                  schedule._id == selectedSchedule._id && "bg-gray-300"
                }`}
              >
                <div className="flex gap-x-3 items-center justify-between">
                  <h1 className="text-lg font-light">{schedule.Name}</h1>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-red-600 cursor-pointer hover:text-red-800"
                    onClick={() => {
                      handleDelete(schedule._id);
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                </div>
                <p className="text-sm w-fit">{schedule.SpecialType}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full mr-5">
          <h1 className="text-lg font-semibold mb-2">Schedule Editor</h1>
          <div className="w-full flex flex-col items-center">
            <div className="flex gap-x-2 items-center mb-2">
              <input
                id="Name"
                className="font-semibold text-xl text-center w-[15rem] border-slate-500 border-2 rounded-lg p-1"
                value={selectedSchedule.Name}
                onChange={(e) => handleTitleChange(e)}
              />
              <h1>-</h1>
              <input
                id="SpecialType"
                className="font-semibold text-xl text-center w-[10rem] border-slate-500 border-2 rounded-lg p-1"
                value={selectedSchedule.SpecialType}
                onChange={(e) => handleTitleChange(e)}
              />
            </div>

            {selectedSchedule.data.map((period, periodIndex) => (
              <>
                <input
                  className="text-lg text-blue-600 mb-1 border-slate-500 border-2 rounded-lg p-1 mt-5"
                  value={period.periodName}
                  id="periodName"
                  onChange={(e) => handlePeriodChange(e, periodIndex)}
                />
                <div className="flex items-center justify-between gap-x-3 mb-1">
                  <input
                    type="text"
                    className="w-[5rem] border-slate-500 border-2 rounded-lg p-1"
                    value={period.startTime}
                    id="startTime"
                    onChange={(e) => handlePeriodChange(e, periodIndex)}
                  />
                  <h1>-</h1>
                  <input
                    type="text"
                    className="w-[5rem] border-slate-500 border-2 rounded-lg p-1"
                    value={period.endTime}
                    id="endTime"
                    onChange={(e) => handlePeriodChange(e, periodIndex)}
                  />
                </div>
                <div className="flex gap-x-5">
                  <label className="hover:cursor-pointer">
                    <input
                      disabled={period.lunchPeriods}
                      value={period.isPassing}
                      type="checkbox"
                      id="isPassing"
                      onChange={(e) => handlePeriodChange(e, periodIndex)}
                    />
                    {"  "}
                    Passing Period
                  </label>
                  <label className="hover:cursor-pointer">
                    <input
                      disabled={period.isPassing}
                      value={period.lunchPeriods}
                      type="checkbox"
                      id="isLunchPeriod"
                      onChange={(e) => handlePeriodChange(e, periodIndex)}
                    />
                    {"  "}
                    Lunch Period
                  </label>
                </div>
                {period.lunchPeriods &&
                  Object.keys(period.lunchPeriods).map((lunchType) => (
                    <div className="ml-5">
                      <h1 className="text-lg text-blue-400 mt-2">
                        {lunchType} Lunch
                      </h1>
                      <div className="flex items-center justify-between gap-x-3">
                        <input
                          type="text"
                          className="w-[5rem] border-slate-500 border-2 rounded-lg p-1"
                          id="startTime"
                          value={period.lunchPeriods[lunchType].startTime}
                          onChange={(e) =>
                            handleLunchChange(e, periodIndex, lunchType)
                          }
                        />
                        <h1>-</h1>
                        <input
                          type="text"
                          className="w-[5rem] border-slate-500 border-2 rounded-lg p-1"
                          id="endTime"
                          value={period.lunchPeriods[lunchType].endTime}
                          onChange={(e) =>
                            handleLunchChange(e, periodIndex, lunchType)
                          }
                        />
                      </div>
                    </div>
                  ))}
                <button
                  onClick={() => {
                    handleAddLunchType(periodIndex);
                  }}
                  disabled={
                    period.lunchPeriods &&
                    Object.keys(period.lunchPeriods).length == lunchTypes.length
                  }
                  className={`bg-blue-600 hover:bg-blue-500 py-2 px-3 rounded-lg text-white mt-3 disabled:bg-blue-300 ${
                    !period.lunchPeriods && "hidden"
                  }`}
                >
                  Add Lunch Type
                </button>
              </>
            ))}
            <button
              onClick={handleAddPeriod}
              className="bg-blue-600 hover:bg-blue-500 py-2 px-3 rounded-lg text-white mt-7"
            >
              Add Period
            </button>
          </div>
        </div>
        <div className="fixed right-8 bottom-8">
          <button
            className="py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-lg"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </React.StrictMode>
  );
}
