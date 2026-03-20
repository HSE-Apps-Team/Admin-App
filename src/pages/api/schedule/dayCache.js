import { ObjectId } from "mongodb";
import connectDB from "../../../lib/schedule.db";

// Helper to get month and year from a date
function getMonthYear(date) {
		const d = new Date(date);
		// Use local month/year to match user-local scheduling (avoid UTC offset issues)
		return { month: d.getMonth() + 1, year: d.getFullYear() };
}

// Helper to get all dates between two dates
function getDatesInRange(startDate, endDate) {
		// Parse date-only strings (YYYY-MM-DD) without timezone shifts
		function parseDateOnly(input) {
			if (!input) return null;
			if (input instanceof Date) return new Date(input.getFullYear(), input.getMonth(), input.getDate());
			if (typeof input === 'string') {
				// If string matches YYYY-MM-DD, construct as local date (no timezone)
				const m = input.match(/^(\d{4})-(\d{2})-(\d{2})$/);
				if (m) {
					const y = parseInt(m[1], 10);
					const mo = parseInt(m[2], 10) - 1;
					const d = parseInt(m[3], 10);
					return new Date(y, mo, d);
				}
				// Fallback: let Date parse it (could include time or timezone)
				return new Date(input);
			}
			// Fallback for other types
			return new Date(input);
		}

		const dates = [];
		let current = parseDateOnly(startDate);
		const last = parseDateOnly(endDate);
		if (!current || !last) return dates;
		while (current <= last) {
			// Always push a new Date object to avoid mutation issues
			dates.push(new Date(current.getFullYear(), current.getMonth(), current.getDate()));
			current.setDate(current.getDate() + 1);
		}
		return dates;
}

export default async function handler(req, res) {
	const client = await connectDB();
	const db = client.db("Data");
	const collection = db.collection("DayCache");

	if (req.method === "GET") {
		// Get all months or a specific month/year
		const { month, year } = req.query;
		let query = {};
		if (month && year) {
			query = { month: parseInt(month), year: parseInt(year) };
		}
		const months = await collection.find(query).toArray();
		res.status(200).json(months);
	}
	else if (req.method === "POST") {
		// Accept either a single range or an array of ranges
		const { ranges, startDate, endDate, dayType } = req.body;
		let allRanges = [];
		if (Array.isArray(ranges)) {
			allRanges = ranges;
		} else if (startDate && endDate && dayType) {
			allRanges = [{ startDate, endDate, dayType }];
		} else {
			res.status(400).json({ message: "Missing startDate, endDate, dayType, or ranges" });
			return;
		}
		for (const range of allRanges) {
			const { startDate, endDate, dayType } = range;
			const dates = getDatesInRange(startDate, endDate);
			// Group dates by month/year
			const monthMap = {};
			dates.forEach(date => {
				const { month, year } = getMonthYear(date);
				// Use local day to avoid UTC vs local-day mismatches for "today"
				const day = date.getDate();
				const key = `${year}-${month}`;
				if (!monthMap[key]) monthMap[key] = { month, year, days: [] };
				monthMap[key].days.push({ day, dayType });
			});
			// Upsert each month
			for (const key in monthMap) {
				const { month, year, days } = monthMap[key];
				for (const { day, dayType } of days) {
					// Remove any existing entry for this day
					await collection.updateOne(
						{ month, year },
						{ $pull: { days: { day } } }
					);
					// Add the new entry
					await collection.updateOne(
						{ month, year },
						{ $addToSet: { days: { day, dayType } } },
						{ upsert: true }
					);
				}
			}
		}
		res.status(200).json({ message: "Days added/updated" });
	}
	else if (req.method === "PUT") {
		// Update dayType for specific days in range
		const { startDate, endDate, dayType } = req.body;
		if (!startDate || !endDate || !dayType) {
			res.status(400).json({ message: "Missing startDate, endDate, or dayType" });
			return;
		}
		const dates = getDatesInRange(startDate, endDate);
		for (const date of dates) {
			const { month, year } = getMonthYear(date);
			const day = date.getDate();
			// Update dayType for this day
			await collection.updateOne(
				{ month, year, "days.day": day },
				{ $set: { "days.$.dayType": dayType } }
			);
		}
		res.status(200).json({ message: "Days updated" });
	}
	else if (req.method === "DELETE") {
		// Delete days in range
		const { startDate, endDate } = req.body;
		if (!startDate || !endDate) {
			res.status(400).json({ message: "Missing startDate or endDate" });
			return;
		}
		const dates = getDatesInRange(startDate, endDate);
		for (const date of dates) {
			const { month, year } = getMonthYear(date);
			const day = date.getDate();
			await collection.updateOne(
				{ month, year },
				{ $pull: { days: { day } } }
			);
		}
		res.status(200).json({ message: "Days deleted" });
	}

	setTimeout(() => {
		client.close();
	}, 1500);
}
