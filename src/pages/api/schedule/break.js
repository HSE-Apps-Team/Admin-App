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
  // Access the "Break Clock" collection within the "Data" database
  const collection = db.collection("Break Clock");

  // Define the id of the Break Clock document to read or update
  const id = "6578fa95d0c20fdf22902399";

  if (req.method === "GET") {
    // Retrieve the Break Clock document using the specified id
    const breakClock = await collection.findOne({ _id: new ObjectId(id) });

    // Check if the Break Clock document was found
    if (!breakClock) {
      res.status(404).json({ message: "Break Clock not found" });
      return;
    }

    // Return the found Break Clock document
    res.status(200).json(breakClock);
  } else if (req.method === "POST") {
    // Retrieve details from the request body
    const { Start_Date, End_Date, title } = req.body;

    // Validate the incoming data
    if (!Start_Date || !End_Date || !title) {
      res.status(400).json({ message: "Missing required fields: Start_Date, End_Date, or title" });
      return;
    }

    // Update the Break Clock document with the new details
    const updateResult = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { Start_Date: Start_Date, End_Date: End_Date, title: title } },
      { upsert: false } // Ensures no new document is created if one doesn't already exist
    );

    if (updateResult.matchedCount === 0) {
      res.status(404).json({ message: "Break Clock not found for update" });
      return;
    }

    // Return a success message if the document was updated
    res.status(200).json({ message: "Break Clock updated successfully", updatedCount: updateResult.modifiedCount });
  }

  // Close the database connection after a short delay (1500ms)
  setTimeout(() => {
    client.close();
  }, 1500);
}
