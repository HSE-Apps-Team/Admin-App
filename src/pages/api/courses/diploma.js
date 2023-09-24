// Import the ObjectId type from the MongoDB library
import { ObjectId } from "mongodb";

// Import the connectDB function from the custom database connection library
import connectDB from "@/lib/courses.db";

// Define the handler function for the API route
export default async function handler(req, res) {
  // Connect to the database using the connectDB function
  const client = await connectDB();
  // Access the "CourseData" database
  const db = client.db("CourseData");
  // Access the "Diplomas" collection within the "CourseData" database
  const collection = db.collection("Diplomas");

  // If the request method is "GET", return all documents in the "Diplomas" collection
  if (req.method == "GET") {
    const diplomas = await collection.find().toArray();
    res.status(200).json(diplomas);
  }
  // If the request method is "PUT", update the "Diplomas" collection with the new data
  else if (req.method == "PUT") {
    const diplomas = req.body;
    // Delete all existing documents in the collection
    await collection.deleteMany({});
    // Insert the new diploma data
    await collection.insertMany(diplomas);
    // Send a success response
    res.status(200).json({ message: "Diplomas updated" });
  }

  // Close the database connection after a short delay (1500ms)
  setTimeout(() => {
    client.close();
  }, 1500);
}
