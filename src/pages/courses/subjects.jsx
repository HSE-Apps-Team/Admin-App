import React, { useEffect, useState } from "react";
import Head from "next/head";

import ReactLoading from "react-loading";

const Subjects = () => {
  const [tags, setTags] = useState(null);
  const [subjects, setSubjects] = useState(null);

  useEffect(() => {
    fetch("/api/courses/defaults")
      .then((res) => res.json())
      .then((data) => {
        setTags(data.tags);
        setSubjects(data.credits);
      });
  }, []);

  /**
   * Saves a new or existing subject or tag to the backend.
   * Sends a POST request if the item is new or a PUT request if it already exists.
   * @param {string} type - The type of item being saved ("subject" or "tag").
   * @param {string} id - The id of the item being saved.
   */
  const handleSave = (type, id) => {
    let value;
    if (type == "subject") {
      value = subjects.find((subject) => subject._id === id);
    } else if (type == "tag") {
      value = tags.find((tag) => tag._id === id);
    }

    if (value.new) {
      fetch("/api/courses/subjects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type, id, value }),
      })
        .then((res) => res.json())
        .then((data) => {
          alert(data.message);
          let newVal;
          if (type == "subject") {
            newVal = subjects.find((subject) => subject._id === id);
            newVal._id = data._id;
            setSubjects([...subjects]);
          } else if (type == "tag") {
            newVal = tags.find((tag) => tag._id === id);
            newVal._id = data._id;
            setTags([...tags]);
          }
        });
    } else {
      fetch("/api/courses/subjects", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type, id, value }),
      })
        .then((res) => res.json())
        .then((data) => {
          alert(data.message);
        });
    }
  };

  /**
   * Updates the value of a subject or tag's attribute based on the input field
   * that triggered the change event.
   * @param {Event} e - The change event triggered by the input field.
   * @param {string} id - The id of the item being edited.
   * @param {string} type - The type of item being edited ("subject" or "tag").
   */
  const handleChange = (e, id, type) => {
    if (type === "subject") {
      const value = subjects.find((subject) => subject._id === id);
      value[e.target.id] = e.target.value;
      setSubjects([...subjects]);
    } else if (type === "tag") {
      const value = tags.find((tag) => tag._id === id);
      value[e.target.id] = e.target.value;
      setTags([...tags]);
    }
  };

  /**
   * Creates a new subject or tag and adds it to the corresponding state array.
   * @param {string} type - The type of item being created ("subject" or "tag").
   */
  const handleNew = (type) => {
    if (type == "subject") {
      setSubjects([
        ...subjects,
        {
          _id: `${Math.floor(Date.now() / 1000).toString(16)}${Array(16)
            .fill(0)
            .map(() => Math.floor(Math.random() * 16).toString(16))
            .join("")}`,
          name: "",
          tip: "",
          new: true,
        },
      ]);
    } else if (type == "tag") {
      setTags([
        ...tags,
        {
          _id: `${Math.floor(Date.now() / 1000).toString(16)}${Array(16)
            .fill(0)
            .map(() => Math.floor(Math.random() * 16).toString(16))
            .join("")}`,
          name: "",
          tip: "",
          new: true,
        },
      ]);
    }
  };

  /**
   * Deletes a subject or tag from the backend and removes it from the corresponding state array.
   * @param {string} type - The type of item being deleted ("subject" or "tag").
   * @param {string} id - The id of the item being deleted.
   */
  const handleDelete = (type, id) => {
    let value;
    if (type == "subject") {
      value = subjects.find((subject) => subject._id === id);
    } else if (type == "tag") {
      value = tags.find((tag) => tag._id === id);
    }

    fetch("/api/courses/subjects", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type, id, value }),
    });

    if (type == "subject") {
      setSubjects(subjects.filter((subject) => subject._id !== id));
    } else if (type == "tag") {
      setTags(tags.filter((tag) => tag._id !== id));
    }
  };

  if (!tags || !subjects) {
    return (
      <div className="flex w-full h-100vh items-center justify-center">
        <ReactLoading type="spin" color="#101010" />
      </div>
    );
  }
  return (
    <>
      <Head>
        <title>Subjects and Tags</title>
      </Head>
      <div className="flex flex-nowrap mb-8 w-full">
        <div className="flex flex-nowrap mb-8 w-full">
          <div className="flex w-full justify-center px-5">
            <div className="w-full">
              <h1 className="text-lg font-semibold mb-2 whitespace-nowrap">
                Subjects
              </h1>
              <div
                className={`flex gap-x-2 items-center py-2 px-5 bg-gray-100 hover:cursor-pointer hover:bg-gray-200 rounded-lg mb-3`}
                onClick={() => handleNew("subject")}
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

                <h1 className="text-lg font-light">New Subject</h1>
              </div>
              {subjects.map((subject) => (
                <div className="w-full py-2 px-5 bg-gray-100 rounded-lg mb-3 ">
                  <div className="w-full flex gap-x-3 items-center justify-between">
                    <div className="w-full">
                      <input
                        id="name"
                        type="text"
                        className="rounded-md w-full py-1 px-1 mb-2"
                        value={subject.name}
                        onChange={(e) =>
                          handleChange(e, subject._id, "subject")
                        }
                      />
                      <textarea
                        id="tip"
                        className="h-20 rounded-md w-full py-1 px-1 mb-2"
                        value={subject.tip}
                        onChange={(e) =>
                          handleChange(e, subject._id, "subject")
                        }
                      />
                    </div>
                    <div className="flex flex-col justify-around items-center gap-y-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5 text-red-600 cursor-pointer hover:text-red-800 flex-shrink-0"
                        onClick={() => handleDelete("subject", subject._id)}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-6 h-6 text-green-600 cursor-pointer hover:text-green-800 flex-shrink-0"
                        onClick={() => handleSave("subject", subject._id)}
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex w-full justify-center px-5">
          <div className="w-full">
            <h1 className="text-lg font-semibold mb-2 whitespace-nowrap">
              Tags
            </h1>
            <div
              className={`flex gap-x-2 items-center py-2 px-5 bg-gray-100 hover:cursor-pointer hover:bg-gray-200 rounded-lg mb-3`}
              onClick={() => handleNew("tag")}
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

              <h1 className="text-lg font-light">New Tag</h1>
            </div>
            {tags.map((tag) => (
              <div className={`w-full py-2 px-5 bg-gray-100 rounded-lg mb-3`}>
                <div className="w-full flex gap-x-3 items-center justify-between">
                  <div className="w-full">
                    <input
                      id="name"
                      type="text"
                      className="rounded-md w-full py-1 px-1 mb-2"
                      value={tag.name}
                      onChange={(e) => handleChange(e, tag._id, "tag")}
                    />
                    <textarea
                      id="tip"
                      className="h-20 rounded-md w-full py-1 px-1"
                      value={tag.tip}
                      onChange={(e) => handleChange(e, tag._id, "tag")}
                    />
                  </div>
                  <div className="flex flex-col justify-around items-center gap-y-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 text-red-600 cursor-pointer hover:text-red-800 flex-shrink-0"
                      onClick={() => handleDelete("tag", tag._id)}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-6 h-6 text-green-600 cursor-pointer hover:text-green-800 flex-shrink-0"
                      onClick={() => handleSave("tag", tag._id)}
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Subjects;
