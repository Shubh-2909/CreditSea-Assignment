import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { connectToDb } from "./src/utils/db";

dotenv.config();

const application = express();
connectToDb();

application.use(cors());
application.use(express.json());
application.use(express.urlencoded({ extended: true }));

application.get("/", (req: any, res: any) => {
  res.send("Hello World");
});

application.listen(process.env.PORT, () => {
  console.log("Server is running on:", process.env.PORT);
});

//TODO:- ADD USER AUTHENTICATION TO CHECK FOR LOGGED IN USERS FOR THEM TO CHECK FOR ROUTES.
