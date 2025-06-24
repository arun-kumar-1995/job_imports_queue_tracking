import mongoose from "mongoose";
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL, {
      dbName: process.env.DB_NAME,
    });
    console.log("Database connected :", conn.connection.host);
  } catch (err) {
    console.log("Error connecting database", err);
    process.exit(1);
  }
};
