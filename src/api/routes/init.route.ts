import { UserRoute } from ".";
import { Express } from "express";
import { ApiBuilders } from "../api.builders";
import { HttpStatusCodes } from "../../lib/codes";

function baseRoutes(route: string = "") {
  return "/api" + route;
}

function buildAppRoutes(app: Express) {
  (function () {
    app.get(baseRoutes("/"), (req, res) => {
      return ApiBuilders.buildResponse(res, {
        status: true,
        code: HttpStatusCodes.SUCCESSFUL_REQUEST,
        message: "Hello world!!!",
        data: null
      });
    });

    app.use(baseRoutes("/user"), UserRoute());
  })();
}

export default buildAppRoutes;