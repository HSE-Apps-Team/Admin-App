import { ObjectId } from "mongodb";
import connectDB from "../../../lib/schedule.db";

export default async function handler(req, res) {
	const client = await connectDB();
	const db = client.db("Data");
	const collection = db.collection("EventTypes");

	if (req.method === "GET") {
		const eventTypes = await collection.find().toArray();
		res.status(200).json(eventTypes);
	}
	else if (req.method === "POST") {
		const eventType = req.body;
		if (!eventType.name) eventType.name = "";
		const resp = await collection.insertOne(eventType);
		res.status(200).json({ message: "Event type created", _id: resp.insertedId });
	}
	else if (req.method === "PUT") {
		const { id, ...update } = req.body;
		if (!id) {
			res.status(400).json({ message: "Missing event type id" });
			return;
		}
		if (update._id) {
			delete update._id;
		}
		await collection.updateOne(
			{ _id: new ObjectId(id) },
			{ $set: update }
		);
		res.status(200).json({ message: "Event type updated" });
	}
	else if (req.method === "DELETE") {
		const id = req.body.id;
		await collection.deleteOne({ _id: new ObjectId(id) });
		res.status(200).json({ message: "Event type deleted" });
	}

	setTimeout(() => {
		client.close();
	}, 1500);
}
