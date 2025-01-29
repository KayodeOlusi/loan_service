import { HttpStatusCodes } from "../codes";
import { Schema, ValidationError } from "yup";
import { ApiBuilders } from "../../api/api.builders";
import { NextFunction, Request, Response } from "express";

function validator(schema: Schema<any>) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      await schema.validate(req.body, { abortEarly: false });
      next();
    } catch (error: any) {
      let e = error as ValidationError;
      return ApiBuilders.buildResponse(res, {
        status: false,
        code: HttpStatusCodes.VALIDATION_ERROR,
        data: e.errors,
        message: e.message
      })
    }
  }
}

export default validator;