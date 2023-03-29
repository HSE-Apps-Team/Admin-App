import { ObjectId } from "mongodb";

import connectDB from "@/lib/schedule.db";

export default async function handler(req, res) {
  const client = await connectDB();
  const db = client.db("Data");
  const collection = db.collection("Announcements");

  if (req.method == "GET") {
    const announcements = await collection.find().toArray();
    res.status(200).json(announcements);
  } else if (req.method == "POST") {
    const announcement = req.body;
    const resp = await collection.insertOne(announcement);
    res
      .status(200)
      .json({ message: "Announcement created", _id: resp.insertedId });
  } else if (req.method == "DELETE") {
    const id = req.body.id;
    await collection.deleteOne({ _id: new ObjectId(id) });
    res.status(200).json({ message: "Announcement deleted" });
  }

  setTimeout(() => {
    client.close();
  }, 1500);
}
