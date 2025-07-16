/* This is a database connection function with improved error handling and retries */
import mongoose from "mongoose";

const connection = {}; /* creating connection object*/

async function dbConnect(retryCount = 0) {
  /* check if we have connection to our database */
  if (connection.isConnected) {
    return;
  }

  try {
    /* connecting to our database with improved options */
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // Timeout after 10 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
      maxPoolSize: 10, // Maintain up to 10 socket connections
    });

    connection.isConnected = db.connections[0].readyState;
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);

    // Retry logic for connection issues
    if (retryCount < 3) {
      console.log(`Retrying connection (attempt ${retryCount + 1} of 3)...`);
      // Wait with exponential backoff
      const waitTime = Math.pow(2, retryCount) * 1000;
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      return await dbConnect(retryCount + 1);
    }

    throw new Error(
      `Failed to connect to MongoDB after ${retryCount} retries. ${error.message}`
    );
  }
}

// Add a function to handle graceful disconnection
async function dbDisconnect() {
  if (!connection.isConnected) {
    return;
  }

  try {
    await mongoose.disconnect();
    connection.isConnected = false;
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error disconnecting from MongoDB:", error);
    throw error;
  }
}

export { dbDisconnect };
export default dbConnect;
