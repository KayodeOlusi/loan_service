import { Response } from "express";
import { HttpStatusCodes } from "../lib/codes";

type HttpResponse = {
  code: HttpStatusCodes;
  message: string;
  status: boolean;
  data: any;
}

type HttpResponseData = {
  status: boolean;
  message: string;
  data?: any;
}

class ApiBuilders {
  static buildResponse(res: Response, obj: HttpResponse) {
    let result: Partial<HttpResponseData> = {};

    result.status = obj.status;
    result.message = obj.message;
    if (obj.data) result.data = obj.data;

    res.status(obj.code).json(result);
  }
}

export {
  ApiBuilders
}