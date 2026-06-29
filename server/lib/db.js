import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectDB = async() => {
    try{
        await mongoose.connect(process.env.MONGO_CONN_URL)
        console.log("Database connected");
    }
    catch(error){
        console.log("Failed to connect database", error);
    }
}