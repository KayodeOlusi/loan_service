import * as yup from "yup";
import { OtpTypes } from "../../typings/enums";

const UserValidatorSchema = {
  RegisterUser: yup.object({
    first_name: yup.string().trim().required(),
    last_name: yup.string().trim().required(),
    password: yup.string().min(8).required(),
    email: yup.string().lowercase().email().trim().required(),
    phone_number: yup.string().trim().matches(/^\d{6,13}$/).required()
  }),
  LoginUser: yup.object({
    email: yup.string().lowercase().email().trim().required(),
    password: yup.string().trim().required()
  }),
  ResetPassword: yup.object({
    email: yup.string().lowercase().email().trim().required(),
    code: yup.string().trim().length(4),
    password: yup.string().min(8).required(),
    type: yup.mixed<OtpTypes>().oneOf([OtpTypes.RESET_PASSWORD]).required(),
  }),
  ChangePassword: yup.object({
    old_password: yup.string().min(8).required(),
    new_password: yup.string().min(8).required(),
  }),
  VerifyUser: yup.object({
    otp: yup.string().trim().length(4).required(),
    email: yup.string().email().required(),
    otpType: yup.mixed<OtpTypes>().oneOf(Object.values(OtpTypes)).required()
  }),
}

export default UserValidatorSchema;

