// Import the ObjectId type from the MongoDB library
import { ObjectId } from "mongodb";

// Import the custom database connection library
import connectDB from "@/lib/schedule.db";

// Define the handler function for the API route
export default async function handler(req, res) {
  // Connect to the database using the connectDB function
  const client = await connectDB();
  // Access the "Data" database
  const db = client.db("Data");
  // Access the "Calendar" collection within the "Data" database
  const collection = db.collection("Calendar");

  if (req.method === "POST") {
    // Retrieve the id and the new image URL from the request body
    const { id = "6617067453189d6d75cb0fb8", newImgUrl } = req.body;

    // Validate the incoming newImgUrl
    if (!newImgUrl) {
      res.status(400).json({ message: "No new image URL provided" });
      return;
    }

    // Update the calendar_img field in the document
    const updateResult = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { calendar_img: newImgUrl } },
      { upsert: false } // Ensures no new document is created if one doesn't already exist
    );

    if (updateResult.matchedCount === 0) {
      res.status(404).json({ message: "Calendar not found for update" });
      return;
    }

    // Return a success message if the document was updated
    res.status(200).json({ message: "Calendar image updated", updatedCount: updateResult.modifiedCount });
  } else if (req.method === "GET") {
    // Define the id of the calendar document to read
    const id = "6617067453189d6d75cb0fb8";

    // Retrieve the calendar document using the specified id
    const calendar = await collection.findOne({ _id: new ObjectId(id) });

    // Check if the calendar document was found
    if (!calendar) {
      res.status(404).json({ message: "Calendar not found" });
      return;
    }

    // Return the found calendar document
    res.status(200).json(calendar);
  }

  // Close the database connection after a short delay (1500ms)
  setTimeout(() => {
    client.close();
  }, 1500);
}
