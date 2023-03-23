import { ObjectId } from "mongodb";

import connectDB from "@/lib/schedule.db";

export default async function handler(req, res) {
  const client = await connectDB();
  const db = client.db("Data");
  const collection = db.collection("Special Schedules");

  if (req.method == "GET") {
    const specialSchedules = await collection.find().toArray();
    res.status(200).json(specialSchedules);
  }

  setTimeout(() => {
    client.close();
  }, 1500);
}
