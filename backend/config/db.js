const mongoose = require("mongoose");

const connectDB = async () => {
  console.log("MONGO_URI seen by app:", process.env.MONGO_URI);
  if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI is missing. Create backend/.env and add your Atlas string.");
    process.exit(1);
  }
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;