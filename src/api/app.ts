import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import "reflect-metadata";
import buildAppRoutes from "./routes/init.route";
import ReqLogger from "../api/middlewares/req-logger.middleware";

dotenv.config();
const app = express();

app.use(cors());
app.use(ReqLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

buildAppRoutes(app);

export default app;