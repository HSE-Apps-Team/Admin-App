import React, { useEffect, useState } from "react";
import Head from "next/head";

import ReactLoading from "react-loading";

const Diploma = () => {
  const [diplomas, setDiplomas] = useState(null);
  const [selectedDiploma, setSelectedDiploma] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

  useEffect(() => {
    fetch("/api/courses/diploma")
      .then((res) => res.json())
      .then((data) => {
        setDiplomas(data);
      });
  }, []);

  useEffect(() => {
    setSelectedSubject(null);
  }, [selectedDiploma]);

  const handleSave = () => {
    fetch("/api/courses/diploma", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(diplomas),
    }).then((res) => {
      if (res.status == 200) {
        alert("Diploma(s) Successfully Saved!");
      }
    });
  };

  const handleNewRequirement = () => {
    const newReq = {
      _id: `${Math.floor(Date.now() / 1000).toString(16)}${Array(16)
        .fill(0)
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join("")}`,
      name: "",
      credits: 0,
    };

    setDiplomas(
      diplomas.map((d) =>
        d._id === selectedDiploma
          ? {
              ...d,
              subjects: d.subjects.map((s) =>
                s._id === selectedSubject
                  ? {
                      ...s,
                      requirements: [...s.requirements, newReq],
                    }
                  : s
              ),
            }
          : d
      )
    );
  };

  const handleRequirementDelete = (id) => {
    setDiplomas(
      diplomas.map((d) =>
        d._id === selectedDiploma
          ? {
              ...d,
              subjects: d.subjects.map((s) =>
                s._id === selectedSubject
                  ? {
                      ...s,
                      requirements: s.requirements.filter((r) => r._id !== id),
                    }
                  : s
              ),
            }
          : d
      )
    );
  };

  const handleRequirementChange = (e, reqId) => {
    if (e.target.id == "name") {
      setDiplomas(
        diplomas.map((d) =>
          d._id === selectedDiploma
            ? {
                ...d,
                subjects: d.subjects.map((s) =>
                  s._id === selectedSubject
                    ? {
                        ...s,
                        requirements: s.requirements.map((r) =>
                          r._id === reqId ? { ...r, name: e.target.value } : r
                        ),
                      }
                    : s
                ),
              }
            : d
        )
      );
    }
    if (e.target.id == "credits") {
      const fullReqCreds = diplomas
        .find((d) => d._id === selectedDiploma)
        .subjects.find((s) => s._id === selectedSubject)
        .requirements.filter((req) => req._id !== reqId)
        .reduce((sum, req) => sum + req.credits, 0);

      const fullDipCredits = diplomas
        .find((d) => d._id === selectedDiploma)
        .subjects.filter((sub) => sub._id !== selectedSubject)
        .reduce((sum, req) => sum + req.credits, 0);

      const newCredit = !e.target.value ? 0 : parseInt(e.target.value);

      setDiplomas(
        diplomas.map((d) =>
          d._id === selectedDiploma
            ? {
                ...d,
                credits: parseInt(fullDipCredits + newCredit),
                subjects: d.subjects.map((s) =>
                  s._id === selectedSubject
                    ? {
                        ...s,
                        credits: parseInt(fullReqCreds + newCredit),
                        requirements: s.requirements.map((r) =>
                          r._id === reqId ? { ...r, credits: newCredit } : r
                        ),
                      }
                    : s
                ),
              }
            : d
        )
      );
    }
  };

  if (!diplomas) {
    return (
      <div className="flex w-full h-100vh items-center justify-center">
        <ReactLoading type="spin" color="#101010" />
      </div>
    );
  }
  return (
    <>
      <Head>
        <title>Diplomas</title>
      </Head>
      <div className="flex flex-nowrap mb-8 w-full">
        <div className="flex min-w-fit w-fit justify-center px-5">
          <div>
            <h1 className="text-lg font-semibold mb-2 whitespace-nowrap">
              Diplomas
            </h1>
            {diplomas.map((diploma) => (
              <div
                onClick={() => setSelectedDiploma(diploma._id)}
                className={`py-2 px-5 bg-gray-100 hover:cursor-pointer hover:bg-gray-200 rounded-lg mb-3 ${
                  selectedDiploma == diploma._id && "bg-gray-300"
                }`}
              >
                <div className="flex gap-x-3 items-center justify-between">
                  <h1 className="text-lg font-light">
                    {diploma.name} |{" "}
                    <span className="font-semibold">{diploma.credits}</span>
                  </h1>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedDiploma && (
          <div className="flex min-w-fit justify-center px-5">
            <div>
              <h1 className="text-lg font-semibold mb-2 whitespace-nowrap">
                Subjects
              </h1>
              {diplomas
                .find((a) => a._id == selectedDiploma)
                .subjects.map((subject) => (
                  <div
                    onClick={() => setSelectedSubject(subject._id)}
                    className={`py-2 px-5 bg-gray-100 hover:cursor-pointer hover:bg-gray-200 rounded-lg mb-3 ${
                      selectedSubject == subject._id && "bg-gray-300"
                    }`}
                  >
                    <div className="flex gap-x-3 items-center justify-between">
                      <h1 className="text-lg font-light">
                        {subject.name} |{" "}
                        <span className="font-semibold">{subject.credits}</span>
                      </h1>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {selectedSubject && (
          <div className="flex w-full justify-center px-5">
            <div className="w-full">
              <h1 className="text-lg font-semibold mb-2 whitespace-nowrap">
                Requirements
              </h1>
              <div
                className={`flex gap-x-2 items-center py-2 px-5 bg-gray-100 hover:cursor-pointer hover:bg-gray-200 rounded-lg mb-3`}
                onClick={handleNewRequirement}
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

                <h1 className="text-lg font-light">New Requirement</h1>
              </div>
              {selectedDiploma &&
                diplomas
                  .find((a) => a._id == selectedDiploma)
                  ?.subjects.find((a) => a._id == selectedSubject)
                  ?.requirements.map((requirement) => (
                    <div
                      className={`w-full py-2 px-5 bg-gray-100 rounded-lg mb-3`}
                    >
                      <div className="w-full flex gap-x-3 items-center justify-between">
                        <div className="w-full">
                          <textarea
                            id="name"
                            className="h-20 rounded-md w-full py-1 px-1 mb-2"
                            onChange={(e) =>
                              handleRequirementChange(e, requirement._id)
                            }
                            value={requirement.name}
                          />
                          <input
                            onChange={(e) =>
                              handleRequirementChange(e, requirement._id)
                            }
                            value={requirement.credits}
                            id="credits"
                            type="number"
                            className="rounded-md w-full py-1 px-1"
                          />
                        </div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5 text-red-600 cursor-pointer hover:text-red-800 flex-shrink-0"
                          onClick={() => {
                            handleRequirementDelete(requirement._id);
                          }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          />
                        </svg>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        )}
      </div>
      <div className="fixed right-8 bottom-8">
        <button
          className="py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-lg"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </>
  );
};

export default Diploma;
