import express from "express";
import { isAuthenticated, RateLimiter } from "../middlewares";

const router = express.Router();

function createTransactionRoute() {
  router.get(
    "/all",
    [RateLimiter({ max: 10 }), isAuthenticated],
    () => {}
  );
  router.get(
    "/:transaction_id",
    [RateLimiter({ max: 10 }), isAuthenticated],
    () => {}
  );
  router.get(
    "/:account_id",
    [RateLimiter({ max: 10 }), isAuthenticated],
    () => {}
  );

  return router;
}

export default createTransactionRoute;