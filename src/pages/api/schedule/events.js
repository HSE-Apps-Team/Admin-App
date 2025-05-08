// Import the ObjectId type from the MongoDB library
import { ObjectId } from "mongodb";

// Import the connectDB function from the custom database connection library
import connectDB from "../../../lib/schedule.db";

// Define the handler function for the API route
export default async function handler(req, res) {
  // Connect to the database using the connectDB function
  const client = await connectDB();
  // Access the "Data" database
  const db = client.db("Data");
  // Access the "Events" collection within the "Data" database
  const collection = db.collection("Events");

  // If the request method is "GET", retrieve all events
  if (req.method == "GET") {
    const events = await collection.find().toArray();
    res.status(200).json(events);
  }
  // If the request method is "POST", create a new event
  else if (req.method == "POST") {
    const event = req.body;
    const resp = await collection.insertOne(event);
    res.status(200).json({ message: "Event created", _id: resp.insertedId });
  }
  // If the request method is "DELETE", delete the specified event
  else if (req.method == "DELETE") {
    const id = req.body.id;
    await collection.deleteOne({ _id: new ObjectId(id) });
    res.status(200).json({ message: "Event deleted" });
  }

  // Close the database connection after a short delay (1500ms)
  setTimeout(() => {
    client.close();
  }, 1500);
}
