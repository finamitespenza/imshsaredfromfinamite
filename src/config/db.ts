import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(import.meta.env.VITE_MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;