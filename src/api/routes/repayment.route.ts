import express from "express";
import { container } from "tsyringe";
import validator from "../../lib/validators";
import { RepaymentController } from "../controllers";
import { isAuthenticated, RateLimiter } from "../middlewares";
import RepaymentValidatorSchema from "../../lib/validators/repayment-validator.schema";

const router = express.Router();
const Controller = container.resolve(RepaymentController);

function createRepaymentRoute() {
  router.get(
    "/all",
    [RateLimiter({ max: 10 }), isAuthenticated],
     Controller.getAllRepayments
  );

  // List repayments for the authenticated user
  router.get(
    "/user/all",
    [RateLimiter({ max: 10 }), isAuthenticated],
    Controller.getUserRepayments
  );

  // Get a repayment by its id
  router.get(
    "/:id",
    [RateLimiter({ max: 15 }), isAuthenticated],
    Controller.getRepaymentById
  );

  // List repayments for a specific loan
  router.get(
    "/loan/:loan_id",
    [RateLimiter({ max: 15 }), isAuthenticated],
    Controller.getLoanRepayments
  );

  // Get repayment schedule for a loan
  router.get(
    "/schedule/:loan_id",
    [RateLimiter({ max: 10 }), isAuthenticated],
    Controller.getLoanRepaymentSchedule
  );

  // Upcoming repayments for current user
  router.get(
    "/due/upcoming",
    [RateLimiter({ max: 10 }), isAuthenticated],
    Controller.getUpcomingRepayments
  );

  // Overdue repayments for current user
  router.get(
    "/due/overdue",
    [RateLimiter({ max: 10 }), isAuthenticated],
    Controller.getUserOverDueRepayments
  );

  // Make a repayment against a specific repayment item (e.g., pay installment)
  router.post(
    "/:id/pay",
    [RateLimiter({ max: 20, exp: 120 }), validator(RepaymentValidatorSchema.MakeRepayment), isAuthenticated],
    Controller.makeRepayment
  );

  // Update repayment status (e.g., mark as confirmed/failed) — staff/admin
  router.patch(
    "/:id/status",
    [RateLimiter({ max: 5, exp: 120 }), validator(RepaymentValidatorSchema.UpdateRepayment), isAuthenticated],
    Controller.updateRepaymentStatus
  );

  return router;
}

export default createRepaymentRoute;
