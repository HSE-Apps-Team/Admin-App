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
  // Access the "CreditsTags" and "Courses" collections within the "CourseData" database
  const creditsCollection = db.collection("CreditsTags");
  const coursesCollection = db.collection("Courses");

  // If the request method is "PUT", update the specified subject or tag
  if (req.method == "PUT") {
    const { type, id, value } = req.body;

    if (type == "subject") {
      // Find the subject document with the specified ID
      const subject = await creditsCollection.findOne(
        { "list._id": new ObjectId(id) },
        { projection: { "list.$": 1 } }
      );

      const oldSubjectName = subject.list[0].name;

      // Update the subject document with the new values
      await creditsCollection.updateOne(
        { "list._id": new ObjectId(id) },
        { $set: { "list.$.name": value.name, "list.$.tip": value.tip } }
      );

      // Update the subject name in the related course documents
      await coursesCollection.updateMany(
        { credit: oldSubjectName },
        { $set: { "credit.$[element]": value.name } },
        { arrayFilters: [{ element: oldSubjectName }] }
      );

      res.status(200).json({ message: "Subject updated" });
    }
    if (type == "tag") {
      // Find the tag document with the specified ID
      const tag = await creditsCollection.findOne(
        { "list._id": new ObjectId(id) },
        { projection: { "list.$": 1 } }
      );

      const oldTagName = tag.list[0].name;

      // Update the tag document with the new values
      await creditsCollection.updateOne(
        { "list._id": new ObjectId(id) },
        { $set: { "list.$.name": value.name, "list.$.tip": value.tip } }
      );

      // Update the tag name in the related course documents
      await coursesCollection.updateMany(
        { tags: oldTagName },
        { $set: { "tags.$[element]": value.name } },
        { arrayFilters: [{ element: oldTagName }] }
      );

      res.status(200).json({ message: "Tag updated" });
    }
  }
  // If the request method is "POST", add a new subject or tag
  if (req.method == "POST") {
    const { type, value } = req.body;
    delete value.new;
    value._id = new ObjectId();

    if (type == "subject") {
      // Add the new subject document
      await creditsCollection.updateOne(
        { type: "credits" },
        { $push: { list: value } }
      );

      res.status(200).json({ message: "Subject added", _id: value._id });
    }
    if (type == "tag") {
      // Add the new tag document
      await creditsCollection.updateOne(
        { type: "tags" },
        { $push: { list: value } }
      );

      res.status(200).json({ message: "Tag added", _id: value._id });
    }
  }
  // If the request method is "DELETE", delete the specified subject or tag
  else if (req.method == "DELETE") {
    const { type, id, value } = req.body;

    if (type == "tag") {
      // Remove the tag document with the specified ID
      await creditsCollection.updateOne(
        { "list._id": new ObjectId(id) },
        { $pull: { list: { _id: new ObjectId(id) } } }
      );

      // Remove the tag from the related course documents
      await coursesCollection.updateMany(
        { tags: value.name },
        { $pull: { tags: value.name } }
      );

      res.status(200).json({ message: "Tag deleted" });
    } else if (type == "subject") {
      // Remove the subject document with the specified ID
      await creditsCollection.updateOne(
        { "list._id": new ObjectId(id) },
        { $pull: { list: { _id: new ObjectId(id) } } }
      );

      // Remove the subject from the related course documents
      await coursesCollection.updateMany(
        { credit: value.name },
        { $pull: { credit: value.name } }
      );

      res.status(200).json({ message: "Subject deleted" });
    }
  }

  // Close the database connection after a short delay (1500ms)
  setTimeout(() => {
    client.close();
  }, 1500);
}
