import mongoose from "mongoose";
import { ENV_VARS } from "./envVars.js";

export const connectDB = async () =>{

   try {
      //ket noi monggoDB
    const conn = await mongoose.connect(ENV_VARS.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
      
   } catch (error) {
    console.log("Error connecting to MongoDB: ", error);
    process.exit(1);
  
   }
}