// Import the ObjectId type from the MongoDB library
import { ObjectId } from "mongodb";

// Import the custom database connection library
import connectDB from "../../../lib/schedule.db";

// Define the handler function for the API route
export default async function handler(req, res) {
  // Connect to the database
  const client = await connectDB();
  const db = client.db("Data");
  const collection = db.collection("Images");

  try {
    if (req.method === "GET") {
      console.log("GET");
      // Fetch all images
      const images = await collection.find({}).toArray();
      res.status(200).json(images);
    } else if (req.method === "POST") {
      // Create a new image entry
      const imgUrl = req.body.image;
      const name = req.body.name;
      console.log(req.body);

      if (!imgUrl) {
        console.log(imgUrl);
        res.status(400).json({ message: "Image URL is required" });
        return;
      }

      const result = await collection.insertOne({ imgUrl, createdAt: new Date(), name });
      res.status(201).json({
        message: "Image added successfully",
        insertedId: result.insertedId,
      });
    } else if (req.method === "PUT") {
      // Update an image's URL
      const { id, newImgUrl } = req.body;
      if (!id || !newImgUrl) {
        res.status(400).json({ message: "Image ID and new URL are required" });
        return;
      }

      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { imgUrl: newImgUrl, updatedAt: new Date() } }
      );

      if (result.matchedCount === 0) {
        res.status(404).json({ message: "Image not found" });
        return;
      }

      res.status(200).json({
        message: "Image updated successfully",
        updatedCount: result.modifiedCount,
      });
    } else if (req.method === "DELETE") {
      // Delete an image by ID
      const { id } = req.body;
      if (!id) {
        res.status(400).json({ message: "Image ID is required" });
        return;
      }

      const result = await collection.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        res.status(404).json({ message: "Image not found" });
        return;
      }

      res.status(200).json({ message: "Image deleted successfully" });
    } else {
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).json({ message: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error("Error managing images collection:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    client.close();
  }
}
