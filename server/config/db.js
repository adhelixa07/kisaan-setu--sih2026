import mongoose from 'mongoose';

export async function connectDatabase(uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kisaan-setu') {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB connection failed:', error?.message || error);
    throw error;
  }
}

export default connectDatabase;
