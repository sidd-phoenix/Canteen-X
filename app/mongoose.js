import mongoose from 'mongoose';

const connectMongo = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }
  console.log(process.env.MONGODB_URI);
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");
};

export default connectMongo; 