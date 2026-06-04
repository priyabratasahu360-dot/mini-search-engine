import mongoose from "mongoose";

export const connectDB = async() => {
    try{
        await mongoose.connect(process.env.MONGO_CONN_URL)
        console.log("Database connected");
    }
    catch(error){
        console.log("Failed to connect database", error);
    }
}