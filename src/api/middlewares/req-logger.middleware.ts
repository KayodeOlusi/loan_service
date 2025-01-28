import Logger from "../../lib/logger";
import { Request, Response, NextFunction } from "express";

function reqLogger(req: Request, res: Response, next: NextFunction) {
  const { method, originalUrl, headers, socket } = req;
  const ip = headers["x-forwarded-for"] || socket.remoteAddress || headers["cf-connecting-ip"];
  const agent = headers["user-agent"];

  Logger.info(`${method} | ${originalUrl} | IP: ${ip} | Agent: ${agent}`);

  next();
}

export default reqLogger;