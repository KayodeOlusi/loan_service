import { NextFunction, Request, Response } from "express";
import { ApiBuilders } from "../api.builders";
import { HttpStatusCodes } from "../../lib/codes";
import Logger from "../../lib/logger";

function error(err: TypeError, req: Request, res: Response, next: NextFunction) {
  try {
    if (err) {
      Logger.error(err.message, err);
      return ApiBuilders.buildResponse(res, {
        status: false,
        data: null,
        code: HttpStatusCodes.SERVER_ERROR,
        message: err.message
      });
    }
  } catch (e) {
  }
}

function notfound(req: Request, res: Response, next: NextFunction) {
  return ApiBuilders.buildResponse(res, {
    status: false,
    data: null,
    code: HttpStatusCodes.NOT_FOUND,
    message: `Route does not exist: ${req.originalUrl}`
  });
}

export {
  error,
  notfound
}