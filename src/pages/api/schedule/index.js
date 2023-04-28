// Import the custom database connection library
import connectDB from "@/lib/schedule.db";

// Define the handler function for the API route
export default async function handler(req, res) {
  // Connect to the database using the connectDB function
  const client = await connectDB();
  // Access the "Data" database
  const db = client.db("Data");
  // Access the "Schedules" collection within the "Data" database
  const collection = db.collection("Schedules");

  // If the request method is "GET", retrieve all schedules
  if (req.method == "GET") {
    const schedules = await collection.find().toArray();
    res.status(200).json(schedules);
  }
  // If the request method is "PUT", update the schedules
  else if (req.method == "PUT") {
    const schedule = req.body;

    // Loop through each day in the schedule array
    schedule.map(async (day) => {
      // Update or insert the schedule for the specified day
      await collection.updateOne(
        { Type: day.Type },
        { $set: { data: day.data } },
        { upsert: true }
      );
    });

    // Return a success message
    res.status(200).json({ message: "Schedule updated" });
  }

  // Close the database connection after a short delay (1500ms)
  setTimeout(() => {
    client.close();
  }, 1500);
}
