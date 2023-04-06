import React, { useEffect, useState } from "react";
import Head from "next/head";

import ReactLoading from "react-loading";

export default function CoursePage() {
  const [defaults, setDefaults] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState(null);
  const [nameSearch, setNameSearch] = useState("");
  const [idSearch, setIdSearch] = useState("");

  useEffect(() => {
    fetch("/api/courses/defaults").then((res) => {
      res
        .json()
        .then((data) => {
          data.tags = data.tags.map((tag) => tag.name);
          data.credits = data.credits.map((subject) => subject.name);
          return data;
        })
        .then((data) => {
          setDefaults(data);
          setSelectedCourse(data.course);
        });
    });

    fetch("/api/courses").then((res) => {
      res.json().then((data) => {
        setCourses(data);
      });
    });
  }, []);

  const handleCourseSelect = (course) => {
    if (course._id) {
      setSelectedCourse(course);
    } else {
      setSelectedCourse(defaults.course);
    }
  };

  const handleMultiSelect = (e, type) => {
    let options = selectedCourse[type];
    if (options.includes(e.target.id)) {
      options = options.filter((option) => option !== e.target.id);
    } else {
      options.push(e.target.id);
    }
    setSelectedCourse((course) => ({
      ...course,
      [type]: options,
    }));
  };

  const handleCourseEdit = (e) => {
    setSelectedCourse((course) => ({
      ...course,
      [e.target.id]: e.target.value,
    }));
  };

  const handleCourseSave = (e) => {
    e.preventDefault();
    console.log("clicked");
    if (!selectedCourse._id) {
      fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedCourse),
      }).then((res) =>
        res.json().then((data) => {
          if (data._id) {
            alert("Course Successfully Added!");
            setCourses((prev) => {
              return [...prev, { ...selectedCourse, _id: data._id }];
            });
          }
        })
      );
    } else {
      fetch("/api/courses", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedCourse),
      }).then((res) => {
        if (res.status == 200) {
          alert("Course Successfully Saved!");
          setCourses((prev) => {
            return prev.map((course) => {
              if (course._id == selectedCourse._id) {
                return selectedCourse;
              } else {
                return course;
              }
            });
          });
        }
      });
    }
  };

  const handleCourseDelete = (id) => {
    fetch("/api/courses", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id: id }),
    }).then((res) => {
      if (res.status == 200) {
        setCourses((prev) => {
          return prev.filter((course) => course._id != id);
        });
      }
    });
  };

  if (!courses || !defaults || !selectedCourse) {
    return (
      <div className="flex w-full h-100vh items-center justify-center">
        <ReactLoading type="spin" color="#101010" />
      </div>
    );
  }
  return (
    <>
      <Head>
        <title>Courses Editor</title>
      </Head>
      <div className="flex flex-nowrap mb-8 w-full">
        <div className="flex flex-col w-fit justify-start px-5">
          <h1 className="text-lg font-semibold mb-2">Events</h1>
          <div>
            <div className="flex gap-x-2 items-center py-2 px-5 bg-gray-100 rounded-lg mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-11 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
              <input
                className="rounded-md w-full disabled:bg-gray-300 py-1 px-1"
                placeholder="Search By Name"
                disabled={idSearch != ""}
                onChange={(e) => setNameSearch(e.target.value)}
                value={nameSearch}
              />
              <input
                className="rounded-md w-full disabled:bg-gray-300 py-1 px-1"
                placeholder="Search By ID"
                disabled={nameSearch != ""}
                onChange={(e) => setIdSearch(e.target.value)}
                value={idSearch}
              />
            </div>
            <div
              className={`flex gap-x-2 items-center py-2 px-5 bg-gray-100 hover:cursor-pointer hover:bg-gray-200 rounded-lg mb-3 ${
                !selectedCourse._id && "bg-gray-300"
              }`}
              onClick={handleCourseSelect}
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

              <h1 className="text-lg font-light">New Course</h1>
            </div>
            {courses
              .filter(
                (course) =>
                  course.name
                    .toLowerCase()
                    .includes(nameSearch.toLowerCase()) &&
                  course.course_id
                    .toLowerCase()
                    .includes(idSearch.toLowerCase())
              )
              .map((course) => (
                <div
                  className={`py-2 px-5 bg-gray-100 rounded-lg mb-3 hover:bg-gray-200 cursor-pointer ${
                    selectedCourse._id == course._id && "bg-gray-300"
                  }`}
                  onClick={() => {
                    handleCourseSelect(course);
                  }}
                >
                  <div className="flex justify-between items-center">
                    <h1 className="text-lg font-light">
                      {course.name} | {course.course_id}
                    </h1>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 text-red-600 cursor-pointer hover:text-red-800"
                      onClick={() => {
                        handleCourseDelete(course._id);
                      }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </div>
                  <h1 className="text-sm mb-1">{course.credit.join(" | ")}</h1>
                  <h1 className="text-sm mb-1">
                    {course.grade_level.join(" | ")}
                  </h1>

                  <h1 className="text-sm w-fit">{course.description}</h1>
                </div>
              ))}
          </div>
        </div>

        <div className="py-2 px-3 mr-5 bg-gray-100 h-fit rounded-lg w-full">
          <form
            onSubmit={handleCourseSave}
            className="py-2 px-5 bg-gray-100 h-fit rounded-lg min-w-[20rem]"
          >
            <h1 className="text-lg font-semibold mb-3">Edit Courses</h1>
            <div className="flex flex-col gap-y-2 ">
              <div>
                <h1 className="mb-1">Name:</h1>
                <input
                  required
                  id="name"
                  type="text"
                  className="rounded-md w-full py-1 px-1"
                  value={selectedCourse.name}
                  onChange={handleCourseEdit}
                />
              </div>
              <div>
                <h1 className="mb-1">Description:</h1>
                <textarea id="description" className="w-full pb-32" />
              </div>
              <div>
                <h1 className="mb-1">Additional Info:</h1>
                <input
                  id="description"
                  type="text"
                  className="rounded-md w-full py-1 px-1"
                  value={selectedCourse.description}
                  onChange={handleCourseEdit}
                />
              </div>
              <div>
                <h1 className="mb-1">Requirements:</h1>
                <input
                  required
                  id="requirements"
                  type="text"
                  className="rounded-md w-full py-1 px-1"
                  value={selectedCourse.requirements}
                  onChange={handleCourseEdit}
                />
              </div>
              <div>
                <h1 className="mb-1">Contact:</h1>
                <input
                  required
                  id="contact"
                  type="email"
                  className="rounded-md w-full py-1 px-1"
                  value={selectedCourse.contact}
                  onChange={handleCourseEdit}
                />
              </div>
              <div className="flex gap-x-3">
                <div>
                  <h1 className="mb-1">Course ID:</h1>
                  <input
                    required
                    id="course_id"
                    type="number"
                    className="rounded-md w-full py-1 px-1"
                    value={selectedCourse.course_id}
                    onChange={handleCourseEdit}
                  />
                </div>
                <div>
                  <h1 className="mb-1">Semesters:</h1>
                  <input
                    required
                    id="semesters"
                    type="number"
                    className="rounded-md w-full py-1 px-1"
                    value={selectedCourse.semesters}
                    onChange={handleCourseEdit}
                  />
                </div>
                <div>
                  <h1 className="mb-1">Max Semesters:</h1>
                  <input
                    required
                    id="max_semesters"
                    type="number"
                    className="rounded-md w-full py-1 px-1"
                    value={selectedCourse.max_semesters}
                    onChange={handleCourseEdit}
                  />
                </div>
                <div>
                  <h1 className="mb-1">Course URL:</h1>
                  <input
                    required
                    id="url"
                    type="text"
                    className="rounded-md w-full py-1 px-1"
                    value={selectedCourse.url}
                    onChange={handleCourseEdit}
                  />
                </div>
              </div>
              <div className="flex">
                <div className="w-1/4">
                  <h1 className="mb-1">Grades:</h1>
                  <div className="flex flex-wrap justify-center w-fit gap-y-2">
                    {defaults.grades.map((grade) => (
                      <div
                        key={grade}
                        className="form-check form-check-inline border p-3 rounded-xl hover:border-blue-600"
                      >
                        <label className="form-check-label inline-block text-gray-800">
                          {grade}
                        </label>
                        <input
                          className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                          type="checkbox"
                          id={grade}
                          checked={selectedCourse.grade_level.includes(grade)}
                          onClick={(e) => {
                            handleMultiSelect(e, "grade_level");
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="w-3/4">
                  <h1 className="mb-1">Tags:</h1>
                  <div className="flex flex-wrap justify-center w-fit gap-y-2 gap-x-2">
                    {defaults.tags.map((tag) => (
                      <div
                        key={tag}
                        className="form-check form-check-inline border p-3 rounded-xl hover:border-blue-600"
                      >
                        <label className="form-check-label inline-block text-gray-800">
                          {tag}
                        </label>
                        <input
                          className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                          type="checkbox"
                          id={tag}
                          checked={selectedCourse.tags.includes(tag)}
                          onClick={(e) => {
                            handleMultiSelect(e, "tags");
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <h1 className="mb-1">Subjects:</h1>
                <div className="flex flex-wrap justify-center w-fit gap-x-2 gap-y-2">
                  {defaults.credits.map((subject) => (
                    <div
                      key={subject}
                      className="form-check form-check-inline border p-3 rounded-xl hover:border-blue-600"
                    >
                      <label className="form-check-label inline-block text-gray-800">
                        {subject}
                      </label>
                      <input
                        className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                        type="checkbox"
                        id={subject}
                        checked={selectedCourse.credit.includes(subject)}
                        onClick={(e) => {
                          handleMultiSelect(e, "credit");
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="px-3 py-2 bg-blue-600 mt-5 text-white rounded-lg mb-1"
            >
              Save
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
