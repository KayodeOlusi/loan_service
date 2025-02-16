enum AccountStatus {
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED"
}

enum EmailTypes {
  SIGN_UP = "Welcome",
  VERIFY_EMAIL = "Verify email",
  FORGOT_PASSWORD = "Forgot Password",
  RESET_PASSWORD = "Reset Password",
  CHANGE_PASSWORD = "Change Password"
}

enum OtpTypes {
  VERIFY_EMAIL = "VERIFY_EMAIL",
  FORGOT_PASSWORD = "FORGOT_PASSWORD",
  RESET_PASSWORD = "RESET_PASSWORD",
  CHANGE_PASSWORD = "CHANGE_PASSWORD"
}

export {
  AccountStatus,
  OtpTypes,
  EmailTypes
}