import { ObjectId } from "mongodb";

import connectDB from "@/lib/schedule.db";

export default async function handler(req, res) {
  const client = await connectDB();
  const db = client.db("Data");
  const collection = db.collection("RollingCache");

  if (req.method == "GET") {
    const id = '6102efb170c1efe78344a9ff';

    const cache = await collection.findOne({ _id: new ObjectId(id) });
    if(cache.PrevType == "Royal"){
        cache.PrevType = "Gray";
    } else {
        cache.PrevType = "Royal";
    }

    collection.findOneAndReplace({ _id: new ObjectId(id) }, cache);
    res.status(200).json({ message: "Cache updated" });
  } 


  setTimeout(() => {
    client.close();
  }, 1500);
}
