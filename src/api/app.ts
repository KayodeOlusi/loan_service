import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import "reflect-metadata";
import buildAppRoutes from "./routes/init.route";
import * as  ErrorMiddleware from "./middlewares/error.middleware";
import ReqLogger from "../api/middlewares/req-logger.middleware";

dotenv.config();
const app = express();

app.use(cors());
app.use(ReqLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(ErrorMiddleware.error);

buildAppRoutes(app);
app.use(ErrorMiddleware.notfound);

export default app;