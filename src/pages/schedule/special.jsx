import React, { useEffect, useState } from "react";
import Head from "next/head";

export default function SpecialSchedules() {
  const [schedules, setSchedules] = useState(null);

  useEffect(() => {
    fetch("/api/schedule/special").then((res) => {
      res.json().then((data) => {
        console.log(data);
        setSchedules(data);
      });
    });
  }, []);

  if (!schedules) {
    return <h1>Loading...</h1>;
  }
  return (
    <>
      <Head>
        <title>Special Schedules</title>
      </Head>
      <div className="flex flex-nowrap mb-8 ">
        <div className="flex w-fit justify-center px-5">
          <div>
            <h1 className="text-lg font-semibold mb-2">Special Schedules</h1>
            {schedules.map((schedule) => (
              <div className="py-2 px-5 bg-gray-100 rounded-lg mb-3">
                <div className="flex gap-x-3 items-center">
                  <h1 className="text-lg font-light">{schedule.Name}</h1>
                  <svg
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
                s<p className="text-sm w-fit">{schedule.SpecialType}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
