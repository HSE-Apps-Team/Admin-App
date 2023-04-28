// Import the ObjectId type from the MongoDB library
import { ObjectId } from "mongodb";

// Import the connectDB function from the custom database connection library
import connectDB from "@/lib/courses.db";

// Define the handler function for the API route
export default async function handler(req, res) {
  // Connect to the database using the connectDB function
  const client = await connectDB();
  // Access the "CourseData" database
  const db = client.db("CourseData");
  // Access the "Courses" collection within the "CourseData" database
  const collection = db.collection("Courses");

  // If the request method is "GET", return all documents in the "Courses" collection
  if (req.method == "GET") {
    const courses = await collection.find().toArray();
    res.status(200).json(courses);
  }
  // If the request method is "POST", insert a new course document into the "Courses" collection
  else if (req.method == "POST") {
    const course = req.body;
    const resp = await collection.insertOne(course);
    res.status(200).json({ message: "Course created", _id: resp.insertedId });
  }
  // If the request method is "PATCH", update the specified course document in the "Courses" collection
  else if (req.method == "PATCH") {
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
  }
  // If the request method is "DELETE", delete the specified course document from the "Courses" collection
  else if (req.method == "DELETE") {
    await collection.deleteOne({ _id: new ObjectId(req.body._id) });
    res.status(200).json({ message: "Course deleted" });
  }

  // Close the database connection after a short delay (1500ms)
  setTimeout(() => {
    client.close();
  }, 1500);
}
