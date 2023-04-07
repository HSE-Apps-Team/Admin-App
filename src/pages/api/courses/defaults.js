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
      .findOne({ type: "tags" })
      .then((doc) => doc.list);
    defaults.credits = await collection
      .findOne({ type: "credits" })
      .then((doc) => doc.list);

    res.status(200).json(defaults);
  }

  setTimeout(() => {
    client.close();
  }, 1500);
}
