import { Response } from "express";
import Logger from "../../lib/logger";
import { Exception } from "../../lib/errors";
import { HttpStatusCodes } from "../../lib/codes";
import { ApiBuilders } from "../../api/api.builders";

export function handleError(error: Exception, res: Response) {
  Logger.error(error.message, error);
  return ApiBuilders.buildResponse(res, {
    status: false,
    code: error.code || HttpStatusCodes.SERVER_ERROR,
    message: error.message || "An error occurred, Try again later",
    data: null
  });
}