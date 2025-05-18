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

enum LoanStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  DISBURSED = "DISBURSED",
  PAID_OFF = "PAID_OFF"
}

enum LoanRepaymentFrequency {
  WEEKLY = "WEEKLY",
  BI_WEEKLY = "BI_WEEKLY",
  MONTHLY = "MONTHLY",
  QUARTERLY = "QUARTERLY",
  YEARLY = "YEARLY"
}

export {
  AccountStatus,
  OtpTypes,
  EmailTypes,
  LoanStatus,
  LoanRepaymentFrequency
}