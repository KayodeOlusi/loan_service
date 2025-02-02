import { EmailTypes } from "../../typings/enums";
import * as EmailTransporter from "../../lib/transports/email";

class MailService {
  private mailTransport = EmailTransporter.transporter;

  async sendResetPasswordMail({ to, code }: {
    to: string;
    code: string
  }) {
    try {
      return await this.mailTransport.sendMail({
        to,
        subject: EmailTypes.FORGOT_PASSWORD,
        from: "Loan Service",
        html: `Your code to reset your password is ${code}. It expires in 5 minutes.`
      });
    } catch (e) {
      throw e;
    }
  }
}

export default MailService;