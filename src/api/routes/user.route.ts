import express from "express";
import { container } from "tsyringe";
import validator from "../../lib/validators";
import { UserController } from "../controllers";
import RateLimiter from "../middlewares/rate-limit.middleware";
import UserValidatorSchema from "../../lib/validators/user-validator.schema";

const router = express.Router();
const Controller = container.resolve(UserController);

function createUserRoute() {
  router.post(
    "/register",
    [RateLimiter({}), validator(UserValidatorSchema.RegisterUser)],
    Controller.register
  );
  router.post(
    "/login",
    [RateLimiter({}), validator(UserValidatorSchema.LoginUser)],
    Controller.login
  );
  router.post(
    "/reset-password",
    [RateLimiter({}), validator(UserValidatorSchema.ResetPassword)],
    Controller.resetPassword
  );
  router.post(
    "/change-password",
    [RateLimiter({}), validator(UserValidatorSchema.ChangePassword)],
    Controller.changePassword
  );

  return router;
}

export default createUserRoute;