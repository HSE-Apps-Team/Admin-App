import connectDB from "@/lib/schedule.db";

export default async function handler(req, res) {
  const client = await connectDB();
  const db = client.db("Data");
  const collection = db.collection("Schedules");

  if (req.method == "GET") {
    const schedules = await collection.find().toArray();
    res.status(200).json(schedules);
  } else if (req.method == "PUT") {
    const schedule = req.body;

    // Update the schedule for each day. The "Type" field is used to identify the day.

    schedule.map(async (day) => {
      await collection.updateOne(
        { Type: day.Type },
        { $set: { data: day.data } },
        { upsert: true }
      );
    });

    res.status(200).json({ message: "Schedule updated" });
  }
  setTimeout(() => {
    client.close();
  }, 1500);
}
