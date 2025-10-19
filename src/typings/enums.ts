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

enum LoanTypes {
  LOAN_PAYMENT = "Loan Payment",
  LOAN_REPAYMENT = "Loan Repayment",
  REPAYMENT = "Repayment"
}

enum AlertTypes {
  EMAIL_ALERT = "Email Alert",
}

enum OtpTypes {
  VERIFY_EMAIL = "VERIFY_EMAIL",
  FORGOT_PASSWORD = "FORGOT_PASSWORD",
  RESET_PASSWORD = "RESET_PASSWORD",
  CHANGE_PASSWORD = "CHANGE_PASSWORD"
}

enum LoanEmailTypes {
  LOAN_PAYMENT = "LOAN_PAYMENT",
  LOAN_REPAYMENT = "LOAN_REPAYMENT",
  REPAYMENT = "REPAYMENT"
}

enum EmailMalfunctionTypes {
  ERROR = "ERROR"
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

enum TransactionStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED"
}

enum TransactionTypes {
  LOAN = "LOAN",
  REPAYMENT = "REPAYMENT",
  FEE = "FEE",
}

enum RepaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  LATE = "LATE",
}

export {
  AccountStatus,
  OtpTypes,
  EmailTypes,
  LoanStatus,
  LoanRepaymentFrequency,
  TransactionStatus,
  TransactionTypes,
  RepaymentStatus,
  LoanEmailTypes,
  LoanTypes,
  EmailMalfunctionTypes,
  AlertTypes,
}
