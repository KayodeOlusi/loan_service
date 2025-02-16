import * as yup from "yup";
import { OtpTypes } from "../../typings/enums";

const OtpValidatorSchema = {
  VerifyOtp: yup.object({
    code: yup.string().trim().length(4).required(),
    email: yup.string().email().required(),
    otpType: yup.mixed<OtpTypes>().oneOf(Object.values(OtpTypes)).required()
  }),
  ResendOtp: yup.object({
    otpType: yup.mixed<OtpTypes>().oneOf(Object.values(OtpTypes)).required(),
    email: yup.string().email().required()
  }),
}

export default OtpValidatorSchema;