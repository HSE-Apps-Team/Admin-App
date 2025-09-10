import { ObjectId } from "mongodb";
import connectDB from "../../../lib/schedule.db";

export default async function handler(req, res) {
	const client = await connectDB();
	const db = client.db("Data");
	const collection = db.collection("Events2");

	if (req.method === "GET") {
		const { selectedDate, selectedEndDate } = req.query;
		if (selectedDate) {
			const start = new Date(selectedDate);
			const end = selectedEndDate ? new Date(selectedEndDate) : start;
			// Find events that overlap with the selected range
			const events = await collection.find({
				startDate: { $lte: end.toISOString() },
				endDate: { $gte: start.toISOString() }
			}).toArray();
			res.status(200).json(events);
		} else {
			const events = await collection.find().toArray();
			res.status(200).json(events);
		}
	}
		else if (req.method === "POST") {
			// Create a new event
			const event = req.body;
			// Ensure description field exists
			if (!('description' in event)) event.description = '';
			const resp = await collection.insertOne(event);
			res.status(200).json({ message: "Event created", _id: resp.insertedId });
		}
		else if (req.method === "PUT") {
			// Edit/update an existing event
			const { id, ...update } = req.body;
			if (!id) {
				res.status(400).json({ message: "Missing event id" });
				return;
			}
			// Remove _id from update object if present
			if (update._id) {
				delete update._id;
			}
			// Ensure description field exists
			if (!('description' in update)) update.description = '';
			await collection.updateOne(
				{ _id: new ObjectId(id) },
				{ $set: update }
			);
			res.status(200).json({ message: "Event updated" });
		}
		else if (req.method === "DELETE") {
			// Delete an event
			const id = req.body.id;
			await collection.deleteOne({ _id: new ObjectId(id) });
			res.status(200).json({ message: "Event deleted" });
		}

	setTimeout(() => {
		client.close();
	}, 1500);
}
