import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import myUserRoutes from "./routes/MyUserRoutes";
import myRestaurantRoutes from "./routes/MyRestaurantRoutes";
import restaurantRoutes from "./routes/RestaurantRoutes";
import orderRoute from "./routes/OrderRoutes";
import { v2 as cloudinary } from "cloudinary";

const app = express();

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("Connected to MongoDB!"));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(cors());

app.use("/api/order/checkout/webhook", express.raw({ type: "*/*" }));

app.use(express.json());

app.get("/health", (req: Request, res: Response) => {
  res.send("Health OK");
});

app.use("/api/my/user", myUserRoutes);
app.use("/api/my/restaurant", myRestaurantRoutes);
app.use("/api/restaurant", restaurantRoutes);
app.use("/api/order", orderRoute);

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
