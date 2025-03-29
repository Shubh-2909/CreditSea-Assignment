import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { connectToDb } from "./src/utils/db";
import userRoutes from "./src/routes/user.routes";
import applicationRoutes from "./src/routes/application.routes";

dotenv.config();

const application = express();
connectToDb();

application.use(express.json());
application.use(express.urlencoded({ extended: true }));
application.use(cors());

application.use("/users", userRoutes);
application.use("/application", applicationRoutes);

application.get("/", (req: any, res: any) => {
  res.send("Hello World");
});

application.listen(process.env.PORT, () => {
  console.log("Server is running on:", process.env.PORT);
});

//TODO:- ADD USER AUTHENTICATION TO CHECK FOR LOGGED IN USERS FOR THEM TO CHECK FOR ROUTES.
