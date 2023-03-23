import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// In production mode, it's best to not use a global variable.

const connectDB = () => {
  const client = new MongoClient(uri, options);
  return client.connect();
};

export default connectDB;
