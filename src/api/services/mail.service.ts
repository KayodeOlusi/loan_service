import {
  AlertTypes,
  EmailMalfunctionTypes,
  EmailTypes,
  LoanEmailTypes,
  LoanTypes,
  OtpTypes
} from "../../typings/enums";
import * as EmailTransporter from "../../lib/transports/email";

class MailService {
  private mailTransport = EmailTransporter.transporter;

  private getMailContent(type: OtpTypes | LoanEmailTypes | EmailMalfunctionTypes, extra?: {
    code?: string;
    message?: string
  }): string {
    switch (type) {
      case OtpTypes.VERIFY_EMAIL:
        return `Your code to verify your email is ${extra?.code}. It expires in 5 minutes.`;
      case OtpTypes.RESET_PASSWORD:
        return `Your code to reset your password is ${extra?.code}. It expires in 5 minutes.`;
      case LoanEmailTypes.LOAN_PAYMENT:
      case LoanEmailTypes.LOAN_REPAYMENT:
      case LoanEmailTypes.REPAYMENT:
      case EmailMalfunctionTypes.ERROR:
        return `${extra?.message}`
      default:
        return ``;
    }
  }

  private _getEmailType(type: OtpTypes | LoanEmailTypes | EmailMalfunctionTypes) {
    switch (type) {
      case OtpTypes.VERIFY_EMAIL:
        return EmailTypes.VERIFY_EMAIL;
      case OtpTypes.CHANGE_PASSWORD:
        return EmailTypes.CHANGE_PASSWORD;
      case OtpTypes.FORGOT_PASSWORD:
        return EmailTypes.FORGOT_PASSWORD
      case OtpTypes.RESET_PASSWORD:
        return EmailTypes.RESET_PASSWORD;
      case LoanEmailTypes.LOAN_PAYMENT:
        return LoanTypes.LOAN_PAYMENT;
      case LoanEmailTypes.LOAN_REPAYMENT:
        return LoanTypes.LOAN_REPAYMENT;
      case LoanEmailTypes.REPAYMENT:
        return LoanTypes.REPAYMENT;
      case EmailMalfunctionTypes.ERROR:
        return AlertTypes.EMAIL_ALERT
      default:
        return EmailTypes.SIGN_UP;
    }
  }

  async sendMail({ to, code, type, message }: {
    to: string;
    type: OtpTypes | LoanEmailTypes | EmailMalfunctionTypes;
    code?: string;
    message?: string;
  }) {
    try {
      return await this.mailTransport.sendMail({
        to,
        subject: this._getEmailType(type),
        from: "Loan Service",
        html: this.getMailContent(type, {
          code,
          message
        })
      });
    } catch (e) {
      throw e;
    }
  }
}

export default MailService;
