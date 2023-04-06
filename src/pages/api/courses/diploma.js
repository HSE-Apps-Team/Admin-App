import { ObjectId } from "mongodb";

import connectDB from "@/lib/courses.db";

export default async function handler(req, res) {
  const client = await connectDB();
  const db = client.db("CourseData");
  const collection = db.collection("Diplomas");

  if (req.method == "GET") {
    const diplomas = await collection.find().toArray();
    res.status(200).json(diplomas);
  } else if (req.method == "PUT") {
    const diplomas = req.body;
    await collection.deleteMany({});
    await collection.insertMany(diplomas);
    res.status(200).json({ message: "Diplomas updated" });
  }

  setTimeout(() => {
    client.close();
  }, 1500);
}
