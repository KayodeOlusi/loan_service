import express from "express";
import { container } from "tsyringe";
import { LoanController } from "../controllers";
import { isAuthenticated, RateLimiter } from "../middlewares";

const router = express.Router();
const Controller = container.resolve(LoanController);

function createLoanRoute() {
  router.get(
    "/all",
    [RateLimiter({ max: 10 }), isAuthenticated],
    () => {}
  );
  router.get(
    "/eligibility/:user_id",
    [RateLimiter({ max: 10 }), isAuthenticated],
    Controller.checkUserEligibility
  );
  router.get(
    "/tier/config",
    [RateLimiter({ max: 10 }), isAuthenticated],
    Controller.getTierConfig
  );
  router.get(
    "/tier/config/all",
    [RateLimiter({ max: 10 }), isAuthenticated],
    Controller.getAllTiersConfig
  )

  return router;
}

export default createLoanRoute;