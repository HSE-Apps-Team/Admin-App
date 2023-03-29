import { ObjectId } from "mongodb";

import connectDB from "@/lib/schedule.db";

export default async function handler(req, res) {
  const client = await connectDB();
  const db = client.db("Data");
  const collection = db.collection("Special Schedules");

  if (req.method == "GET") {
    const specialSchedules = await collection.find().toArray();
    res.status(200).json(specialSchedules);
  } else if (req.method == "POST") {
    const newSpecialSchedule = req.body;
    const resp = await collection.insertOne(newSpecialSchedule);
    res
      .status(200)
      .json({ _id: resp.insertedId, message: "Special Schedule added" });
  } else if (req.method == "PATCH") {
    const newSpecialSchedule = req.body;
    await collection.updateOne(
      { _id: new ObjectId(newSpecialSchedule._id) },
      {
        $set: {
          data: newSpecialSchedule.data,
          Name: newSpecialSchedule.Name,
          SpecialType: newSpecialSchedule.SpecialType,
        },
      }
    );
    res.status(200).json({ message: "Special Schedule updated" });
  } else if (req.method == "DELETE") {
    const newSpecialSchedule = req.body;
    await collection.deleteOne({ _id: new ObjectId(newSpecialSchedule._id) });
    res.status(200).json({ message: "Special Schedule deleted" });
  }

  setTimeout(() => {
    client.close();
  }, 1500);
}
