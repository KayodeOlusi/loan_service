import { EmailTypes, OtpTypes } from "../../typings/enums";
import * as EmailTransporter from "../../lib/transports/email";

class MailService {
  private mailTransport = EmailTransporter.transporter;

  private getMailContent(type: OtpTypes, code: string = "") {
    switch (type) {
      case OtpTypes.VERIFY_EMAIL:
        return `Your code to verify your email is ${code}. It expires in 5 minutes.`;
      default:
        return ``;
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
        subject: EmailTypes.FORGOT_PASSWORD,
        from: "Loan Service",
        html: this.getMailContent(type, code)
      });
    } catch (e) {
      throw e;
    }
  }
}

export default MailService;