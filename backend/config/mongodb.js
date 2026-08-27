import mongoose from "mongoose";

const connectDB = async () => {
    mongoose.connection.on("connected", () => {
        console.log("MongoDB connected successfully");
    });

    mongoose.connection.on("error", (err) => {
        console.error("MongoDB connection error:", err.message);
    });

    if (!process.env.MONGODB_URI) {
        console.warn("MongoDB warning: MONGODB_URI environment variable is not set.");
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI, { dbName: "DocNode" });
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error.message);
    }
};

export default connectDB;