import express from "express";
import { RateLimiter } from "../middlewares";
import validator from "../../lib/validators";
import OtpValidatorSchema from "../../lib/validators/otp-validator.schema";

const router = express.Router();

function createOtpRoute() {
  router.post(
    "/verify",
    [RateLimiter({ exp: 30, max: 1 }), validator(OtpValidatorSchema.VerifyOtp)]
  );

  router.post(
    "/resend",
    [RateLimiter({ exp: 30, max: 2 }), validator(OtpValidatorSchema.ResendOtp)]
  );

  return router;
}

export default createOtpRoute;