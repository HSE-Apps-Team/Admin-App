import { ObjectId } from "mongodb";

import connectDB from "@/lib/courses.db";

export default async function handler(req, res) {
  const client = await connectDB();
  const db = client.db("CourseData");
  const collection = db.collection("CreditsTags");

  if (req.method == "GET") {
    let defaults = {
      grades: ["Freshman", "Sophomore", "Junior", "Senior"],
      tags: [],
      course: {
        tags: [],
        credit: [],
        grade_level: [],
        name: "",
        course_id: "",
        url: "",
        semesters: 0,
        max_semesters: 0,
        weight: 0,
        contact: "",
        description: "",
        requirements: "",
        additional_info: "",
      },
    };
    defaults.tags = await collection
      .findOne({ _id: new ObjectId("5fb0b51daf2e9a5b5d311623") })
      .then((doc) => doc.list);
    defaults.credits = await collection
      .findOne({ _id: new ObjectId("63b70ae306141b8168a75362") })
      .then((doc) => doc.list);

    res.status(200).json(defaults);
  }

  setTimeout(() => {
    client.close();
  }, 1500);
}
