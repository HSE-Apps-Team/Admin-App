import { ObjectId } from "mongodb";

import connectDB from "@/lib/courses.db";

export default async function handler(req, res) {
  const client = await connectDB();
  const db = client.db("CourseData");
  const collection = db.collection("Courses");

  if (req.method == "GET") {
    const courses = await collection.find().toArray();
    res.status(200).json(courses);
  } else if (req.method == "POST") {
    const course = req.body;
    const resp = await collection.insertOne(course);
    res.status(200).json({ message: "Course created", _id: resp.insertedId });
  } else if (req.method == "PATCH") {
    const id = req.body._id;
    const course = req.body;
    await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          tags: course.tags,
          credit: course.credit,
          grade_level: course.grade_level,
          name: course.name,
          course_id: course.course_id,
          url: course.url,
          semesters: course.semesters,
          max_semesters: course.max_semesters,
          weight: course.weight,
          contact: course.contact,
          description: course.description,
          requirements: course.requirements,
          additional_info: course.additional_info,
        },
      }
    );
    res.status(200).json({ message: "Course updated" });
  } else if (req.method == "DELETE") {
    await collection.deleteOne({ _id: new ObjectId(req.body._id) });
    res.status(200).json({ message: "Course deleted" });
  }

  setTimeout(() => {
    client.close();
  }, 1500);
}
