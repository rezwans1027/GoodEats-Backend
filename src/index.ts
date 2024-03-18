import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import myUserRoutes from "./routes/MyUserRoutes";

const app = express();

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("Connected to MongoDB!"));

app.use(express.json());
app.use(cors());

app.get("/health", (req: Request, res: Response) => {
  res.send("Health OK");
});

app.use("/api/my/user", myUserRoutes);

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
