import connectDB from "@/lib/schedule.db";

export default async function handler(req, res) {
  const client = await connectDB();
  const db = client.db("Data");
  const collection = db.collection("Schedules");

  const events = await collection.find().toArray();

  res.status(200).json(events);
}
