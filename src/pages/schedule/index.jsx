import React, { useEffect, useState } from "react";
import Head from "next/head";

import ReactLoading from "react-loading";

export default function MainSchedule() {
  const [mainSchedules, setMainSchedules] = useState(null);

  useEffect(() => {
    fetch("/api/schedule").then((res) =>
      res.json().then((data) => {
        setMainSchedules(data);
      })
    );
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    fetch("/api/schedule", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mainSchedules),
    }).then((res) => {
      if (res.status == 200) {
        alert("Schedule Successfully Saved!");
      }
    });
  };

  const handleReset = (e) => {
    e.preventDefault();
    fetch("/api/schedule/cache").then((res) => {
      if(res.status == 200){
        alert("Schedule Cache Reset!");
      }
    })
  }

  const onPeriodChange = (e, index, periodIndex) => {
    setMainSchedules((prev) => {
      const newSchedules = [...prev];
      newSchedules[index].data[periodIndex][e.target.id] = e.target.value;
      return newSchedules;
    });
  };

  const onLunchPeriodChange = (e, index, periodIndex, lunchType) => {
    setMainSchedules((prev) => {
      const newSchedules = [...prev];
      newSchedules[index].data[periodIndex].lunchPeriods[lunchType][
        e.target.id
      ] = e.target.value;
      return newSchedules;
    });
  };

  if (!mainSchedules) {
    return (
      <div className="flex w-full h-100vh items-center justify-center">
        <ReactLoading type="spin" color="#101010" />
      </div>
    );
  }
  return (
    <>
      <Head>
        <title>Main Schedule</title>
      </Head>
      <div className="flex w-full flex-nowrap justify-around mb-8">
        {mainSchedules.map((schedule, index) => (
          <div className="flex flex-col">
            <h1 className="font-semibold text-xl text-center">
              {schedule.Type}
            </h1>
            {schedule.data.map((period, periodIndex) => (
              <>
                <h1 className="text-lg text-blue-600 mt-2 mb-1">
                  {period.periodName}
                </h1>
                <div className="flex items-center justify-between gap-x-3">
                  <input
                    type="text"
                    className="w-[5rem] border-slate-500 border-2 rounded-lg p-1"
                    id="startTime"
                    value={period.startTime}
                    onChange={(e) => {
                      onPeriodChange(e, index, periodIndex);
                    }}
                  />
                  <h1>-</h1>
                  <input
                    type="text"
                    className="w-[5rem] border-slate-500 border-2 rounded-lg p-1"
                    id="endTime"
                    value={period.endTime}
                    onChange={(e) => {
                      onPeriodChange(e, index, periodIndex);
                    }}
                  />
                </div>
                {period.lunchPeriods &&
                  Object.keys(period.lunchPeriods).map((lunchType) => (
                    <div className="ml-5">
                      <h1 className="text-lg text-blue-400 mt-2 mb-1">
                        {lunchType} Lunch
                      </h1>
                      <div className="flex items-center justify-between gap-x-3">
                        <input
                          type="text"
                          className="w-[5rem] border-slate-500 border-2 rounded-lg p-1"
                          id="startTime"
                          value={period.lunchPeriods[lunchType].startTime}
                          onChange={(e) => {
                            onLunchPeriodChange(
                              e,
                              index,
                              periodIndex,
                              lunchType
                            );
                          }}
                        />
                        <h1>-</h1>
                        <input
                          type="text"
                          className="w-[5rem] border-slate-500 border-2 rounded-lg p-1"
                          id="endTime"
                          value={period.lunchPeriods[lunchType].endTime}
                          onChange={(e) => {
                            onLunchPeriodChange(
                              e,
                              index,
                              periodIndex,
                              lunchType
                            );
                          }}
                        />
                      </div>
                    </div>
                  ))}
              </>
            ))}
          </div>
        ))}
      </div>
      <div className="fixed right-8 bottom-8">
        <button
          className="py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-lg mr-2"
          onClick={handleReset}
        >
          Reset Cache
        </button>
        <button
          className="py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-lg"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </>
  );
}
