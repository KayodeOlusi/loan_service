import { EmailTypes, OtpTypes } from "../../typings/enums";
import * as EmailTransporter from "../../lib/transports/email";

class MailService {
  private mailTransport = EmailTransporter.transporter;

  private getMailContent(type: OtpTypes, code: string = "") {
    switch (type) {
      case OtpTypes.VERIFY_EMAIL:
        return `Your code to verify your email is ${code}. It expires in 5 minutes.`;
        case OtpTypes.RESET_PASSWORD:
        return `Your code to reset your password is ${code}. It expires in 5 minutes.`;
      default:
        return ``;
    }
  }

  private _getEmailType(type: OtpTypes) {
    switch (type) {
      case OtpTypes.VERIFY_EMAIL:
        return EmailTypes.VERIFY_EMAIL;
      case OtpTypes.CHANGE_PASSWORD:
        return EmailTypes.CHANGE_PASSWORD;
      case OtpTypes.FORGOT_PASSWORD:
        return EmailTypes.FORGOT_PASSWORD
      case OtpTypes.RESET_PASSWORD:
        return EmailTypes.RESET_PASSWORD;
      default:
        return EmailTypes.SIGN_UP;
    }
  }

  async sendMail({ to, code, type }: {
    to: string;
    type: OtpTypes;
    code?: string;
  }) {
    try {
      return await this.mailTransport.sendMail({
        to,
        subject: this._getEmailType(type),
        from: "Loan Service",
        html: this.getMailContent(type, code)
      });
    } catch (e) {
      throw e;
    }
  }
}

export default MailService;