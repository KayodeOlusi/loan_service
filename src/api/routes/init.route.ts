import { Express } from "express";
import { ApiBuilders } from "../api.builders";
import { HttpStatusCodes } from "../../lib/codes";
import { AccountRoute, LoanRoute, OtpRoute, RepaymentRoute, TransactionRoute, UserRoute } from ".";

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
    app.use(baseRoutes("/account"), AccountRoute());
    app.use(baseRoutes("/otp"), OtpRoute());
    app.use(baseRoutes("/loan"), LoanRoute());
    app.use(baseRoutes("/transaction"), TransactionRoute());
    app.use(baseRoutes("/repayment"), RepaymentRoute());
  })();
}

export default buildAppRoutes;
