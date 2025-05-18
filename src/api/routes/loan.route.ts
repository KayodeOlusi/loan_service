import express from "express";
import { isAuthenticated, RateLimiter } from "../middlewares";

const router = express.Router();

function createLoanRoute() {
  router.get(
    "/all",
    [RateLimiter({ max: 10 }), isAuthenticated],
    () => {}
  );
  router.get(
    "/:loan_id",
    [RateLimiter({ max: 10 }), isAuthenticated],
    () => {}
  );
  router.get(
    "/:user_id",
    [RateLimiter({ max: 10 }), isAuthenticated],
    () => {}
  );
  router.get(
    "/eligibility/:user_id",
    [RateLimiter({ max: 10 }), isAuthenticated],
    () => {}
  );

  return router;
}

export default createLoanRoute;