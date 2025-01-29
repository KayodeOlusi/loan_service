import * as yup from "yup";

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
  ForgotPassword: yup.object({
    email: yup.string().lowercase().email().trim().required()
  }),
  ChangePassword: yup.object({
    old_password: yup.string().min(8).required(),
    new_password: yup.string().min(8).required(),
  })
}

export default UserValidatorSchema;

