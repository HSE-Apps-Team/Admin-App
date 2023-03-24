import React, { useEffect, useState } from "react";
import Head from "next/head";

import ReactLoading from "react-loading";

export default function AnnouncementPage() {
  const [announcements, setAnnouncements] = useState(null);

  useEffect(() => {
    fetch("/api/schedule/announcements").then((res) => {
      res.json().then((data) => {
        setAnnouncements(data);
      });
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("/api/schedule/announcements", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Date: new Date(e.target[0].value).toLocaleDateString("en-US", {
          timeZone: "UTC",
        }),
        Title: e.target[1].value,
        Content: e.target[2].value,
      }),
    }).then((res) => {
      if (res.status == 200) {
        alert("Announcement Successfully Added!");
        e.target[0].value = "";
        e.target[1].value = "";
        e.target[2].value = "";
      }
    });
  };

  const handleDelete = (id) => {
    fetch("/api/schedule/announcements/", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
      }),
    }).then((res) => {
      if (res.status == 200) {
        alert("Announcement Successfully Deleted!");
        setAnnouncements((prev) => {
          const newAnnouncements = [...prev];
          newAnnouncements.splice(
            newAnnouncements.findIndex((a) => a._id == id),
            1
          );
          return newAnnouncements;
        });
      }
    });
  };

  if (!announcements) {
    return (
      <div className="flex w-full h-100vh items-center justify-center">
        <ReactLoading type="spin" color="#101010" />
      </div>
    );
  }
  return (
    <>
      <Head>
        <title>Announcements</title>
      </Head>

      <div className="flex flex-nowrap justify-between mb-8 ">
        <form
          onSubmit={handleSubmit}
          className="py-2 px-5 bg-gray-100 h-fit rounded-lg min-w-[20rem]"
        >
          <h1 className="text-lg font-semibold mb-3">New Announcement</h1>
          <div className="flex flex-col gap-y-2 ">
            <div>
              <h1 className="mb-1">Date:</h1>
              <input required id="date" type="date" className="rounded-md" />
            </div>
            <div>
              <h1 className="mb-1">Title:</h1>
              <input
                required
                id="title"
                type="text"
                className="rounded-md w-full"
              />
            </div>
            <div>
              <h1 className="mb-1">Content:</h1>
              <textarea required id="content" className="w-full pb-32" />
            </div>
          </div>
          <button
            type="submit"
            className="px-3 py-2 bg-blue-600 mt-5 text-white rounded-lg mb-1"
          >
            Submit
          </button>
        </form>

        <div className="flex w-fit justify-center px-5">
          <div>
            <h1 className="text-lg font-semibold mb-2">Announcements</h1>
            {announcements.map((announcement) => (
              <div className="py-2 px-5 bg-gray-100 rounded-lg mb-3">
                <div className="flex gap-x-3 items-center">
                  <h1 className="text-lg font-light">{announcement.Title}</h1>
                  <svg
                    onClick={() => handleDelete(announcement._id)}
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
                <h1 className="text-sm mb-1">{announcement.Date}</h1>
                <p className="text-sm w-fit">{announcement.Content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
