// Import the ObjectId type from the MongoDB library
import { ObjectId } from "mongodb";

// Import the custom database connection library
import connectDB from "../../../lib/schedule.db";

// Define the handler function for the API route
export default async function handler(req, res) {
  // Connect to the database using the connectDB function
  const client = await connectDB();
  // Access the "Data" database
  const db = client.db("Data");
  // Access the "Announcements" collection within the "Data" database
  const collection = db.collection("Announcements");

  // If the request method is "GET", retrieve all announcements
  if (req.method == "GET") {
    const announcements = await collection.find().toArray();
    res.status(200).json(announcements);
  }
  // If the request method is "POST", create a new announcement
  else if (req.method == "POST") {
    const announcement = req.body;
    const resp = await collection.insertOne(announcement);
    res
      .status(200)
      .json({ message: "Announcement created", _id: resp.insertedId });
  }
  // If the request method is "DELETE", delete an announcement by ID
  else if (req.method == "DELETE") {
    const id = req.body.id;
    await collection.deleteOne({ _id: new ObjectId(id) });
    res.status(200).json({ message: "Announcement deleted" });
  }

  // Close the database connection after a short delay (1500ms)
  setTimeout(() => {
    client.close();
  }, 1500);
}
