import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";

dotenv.config();
const app = express();

mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });

app.use(cors());
app.use(cookieParser());
app.use(express.json());

//route
app.use("/v1/auth", authRoute);
app.use("/v1/user", userRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

