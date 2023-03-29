import { MongoClient } from "mongodb";

const uri = process.env.COURSES_MONGODB_URI;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const connectDB = () => {
  const client = new MongoClient(uri, options);
  return client.connect();
};

export default connectDB;
