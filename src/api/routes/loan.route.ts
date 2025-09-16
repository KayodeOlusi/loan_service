import express from "express";
import { container } from "tsyringe";
import { LoanController } from "../controllers";
import { isAuthenticated, RateLimiter } from "../middlewares";
import validator from "../../lib/validators";
import LoanValidatorSchema from "../../lib/validators/loan-validator.schama";

const router = express.Router();
const Controller = container.resolve(LoanController);

function createLoanRoute() {
  router.get(
    "/all",
    [RateLimiter({ max: 10 }), isAuthenticated],
    Controller.getAllLoans
  );
  router.get(
    "/user/all",
    [RateLimiter({ max: 10 }), isAuthenticated],
    Controller.getAllUserLoans
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
  );
  router.post(
    "/request",
    [RateLimiter({ max: 5, exp: 120 }), validator(LoanValidatorSchema.RequestLoan), isAuthenticated],
    Controller.requestLoan
  );
  router.get(
    "/:id",
    [RateLimiter({ max: 10 }), isAuthenticated],
    Controller.getLoan
  );

  return router;
}

export default createLoanRoute;
