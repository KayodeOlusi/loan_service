import express from "express";
import { container } from "tsyringe";
import { TransactionController } from "../controllers";
import { isAuthenticated, RateLimiter } from "../middlewares";

const router = express.Router();
const Controller = container.resolve(TransactionController);

function createTransactionRoute() {
  router.get(
    "/all",
    [RateLimiter({ max: 10 }), isAuthenticated],
    Controller.getAllTransactions
  );
  router.get(
    "/export-transactions",
    [RateLimiter({ max: 10 }), isAuthenticated],
    Controller.exportTransactions
  );
  router.get(
    "/:transaction_id",
    [RateLimiter({ max: 10 }), isAuthenticated],
    () => {}
  );

  return router;
}

export default createTransactionRoute;