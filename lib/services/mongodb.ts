import mongoose from 'mongoose';

// MongoDB connection string from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

// Connection state interface
interface Connection {
  isConnected?: number;
}

// Global connection state variable
const connection: Connection = {};


/**
 * Connect to MongoDB database
 */
async function connectToDatabase() {
  // If connection already exists, use it
  if (connection.isConnected) {
    return;
  }

  // Check if MONGODB_URI is defined
  if (!MONGODB_URI) {
    console.error('MongoDB URI is not defined. Please check your environment variables.');
    return Promise.reject(new Error('Please define the MONGODB_URI environment variable'));
  }

  // Connect to MongoDB
  try {
    const db = await mongoose.connect(MONGODB_URI);
    
    // Set connection status based on readyState
    // 1 = connected
    connection.isConnected = db.connections[0].readyState;
    
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export { connectToDatabase };
