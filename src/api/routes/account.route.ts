import express from "express";
import { container } from "tsyringe";
import { isAuthenticated, RateLimiter } from "../middlewares";
import { AccountController } from "../controllers";

const router = express.Router();
const Controller = container.resolve(AccountController);
function createAccountRoute() {
  router.get(
    "/all",
    [RateLimiter({ max: 10 }), isAuthenticated],
    Controller.getAllAccounts
  );
  router.get(
    "/:user_id",
    [RateLimiter({ max: 10 }), isAuthenticated],
    Controller.getAccount
  );

  return router;
}

export default createAccountRoute;