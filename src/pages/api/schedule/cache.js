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
  // Access the "RollingCache" collection within the "Data" database
  const collection = db.collection("RollingCache");

  // If the request method is "GET", update the cache document
  if (req.method == "GET") {
    // Define the id of the cache document to update
    const id = "6102efb170c1efe78344a9ff";

    // Retrieve the cache document using the specified id
    const cache = await collection.findOne({ _id: new ObjectId(id) });

    // Toggle the "PrevType" field value between "Royal" and "Gray"
    if (cache.PrevType == "Royal") {
      cache.PrevType = "Gray";
    } else {
      cache.PrevType = "Royal";
    }

    // Replace the cache document with the updated cache object
    collection.findOneAndReplace({ _id: new ObjectId(id) }, cache);

    // Return a success message
    res.status(200).json({ message: "Cache updated" });
  }

  // Close the database connection after a short delay (1500ms)
  setTimeout(() => {
    client.close();
  }, 1500);
}
