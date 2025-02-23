import express from "express";
import { container } from "tsyringe";
import { RateLimiter } from "../middlewares";
import validator from "../../lib/validators";
import { OtpController } from "../controllers";
import OtpValidatorSchema from "../../lib/validators/otp-validator.schema";

const router = express.Router();
const Controller = container.resolve(OtpController);

function createOtpRoute() {
  router.post(
    "/verify",
    [RateLimiter({ exp: 30, max: 1 }), validator(OtpValidatorSchema.VerifyOtp)],
    Controller.verifyOtp
  );

  router.post(
    "/request",
    [RateLimiter({ exp: 30, max: 1 }), validator(OtpValidatorSchema.RequestOtp)],
    Controller.requestOtp
  );

  router.post(
    "/resend",
    [RateLimiter({ exp: 30, max: 2 }), validator(OtpValidatorSchema.ResendOtp)],
    Controller.resendOtp
  );

  return router;
}

export default createOtpRoute;