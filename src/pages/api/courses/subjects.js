import { ObjectId } from "mongodb";

import connectDB from "@/lib/courses.db";

export default async function handler(req, res) {
  const client = await connectDB();
  const db = client.db("CourseData");
  const creditsCollection = db.collection("CreditsTags");
  const coursesCollection = db.collection("Courses");

  if (req.method == "PUT") {
    const { type, id, value } = req.body;

    if (type == "subject") {
      const subject = await creditsCollection.findOne(
        { "list._id": new ObjectId(id) },
        { projection: { "list.$": 1 } }
      );

      const oldSubjectName = subject.list[0].name;

      console.log(type, id, value);

      await creditsCollection.updateOne(
        { "list._id": new ObjectId(id) },
        { $set: { "list.$.name": value.name, "list.$.tip": value.tip } }
      );

      await coursesCollection.updateMany(
        { credit: oldSubjectName },
        { $set: { "credit.$[element]": value.name } },
        { arrayFilters: [{ element: oldSubjectName }] }
      );

      res.status(200).json({ message: "Subject updated" });
    }
    if (type == "tag") {
      const tag = await creditsCollection.findOne(
        { "list._id": new ObjectId(id) },
        { projection: { "list.$": 1 } }
      );

      const oldTagName = tag.list[0].name;

      console.log(type, id, value);

      await creditsCollection.updateOne(
        { "list._id": new ObjectId(id) },
        { $set: { "list.$.name": value.name, "list.$.tip": value.tip } }
      );

      await coursesCollection.updateMany(
        { tags: oldTagName },
        { $set: { "tags.$[element]": value.name } },
        { arrayFilters: [{ element: oldTagName }] }
      );

      res.status(200).json({ message: "Tag updated" });
    }
  }
  if (req.method == "POST") {
    const { type, value } = req.body;
    delete value.new;
    value._id = new ObjectId();

    if (type == "subject") {
      await creditsCollection.updateOne(
        { type: "credits" },
        { $push: { list: value } }
      );

      res.status(200).json({ message: "Subject added", _id: value._id });
    }
    if (type == "tag") {
      await creditsCollection.updateOne(
        { type: "tags" },
        { $push: { list: value } }
      );

      res.status(200).json({ message: "Tag added", _id: value._id });
    }
  } else if (req.method == "DELETE") {
    const { type, id, value } = req.body;

    console.log(type, id, value);

    if (type == "tag") {
      await creditsCollection.updateOne(
        { "list._id": new ObjectId(id) },
        { $pull: { list: { _id: new ObjectId(id) } } }
      );

      await coursesCollection.updateMany(
        { tags: value.name },
        { $pull: { tags: value.name } }
      );

      res.status(200).json({ message: "Tag deleted" });
    } else if (type == "subject") {
      await creditsCollection.updateOne(
        { "list._id": new ObjectId(id) },
        { $pull: { list: { _id: new ObjectId(id) } } }
      );

      await coursesCollection.updateMany(
        { credit: value.name },
        { $pull: { credit: value.name } }
      );

      res.status(200).json({ message: "Subject deleted" });
    }
  }

  setTimeout(() => {
    client.close();
  }, 1500);
}
