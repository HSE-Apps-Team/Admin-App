import { ObjectId } from "mongodb";

import connectDB from "@/lib/schedule.db";

export default async function handler(req, res) {
  const client = await connectDB();
  const db = client.db("Data");
  const collection = db.collection("Events");

  if (req.method == "GET") {
    const events = await collection.find().toArray();
    res.status(200).json(events);
  } else if (req.method == "POST") {
    const event = req.body;
    const resp = await collection.insertOne(event);
    res.status(200).json({ message: "Event created", _id: resp.insertedId });
  } else if (req.method == "DELETE") {
    const id = req.body.id;
    await collection.deleteOne({ _id: new ObjectId(id) });
    res.status(200).json({ message: "Event deleted" });
  }

  setTimeout(() => {
    client.close();
  }, 1500);
}
