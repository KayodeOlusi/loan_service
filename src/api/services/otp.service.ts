import { OtpDao } from "../dao";
import { autoInjectable } from "tsyringe";
import { OtpTypes } from "../../typings/enums";
import { EncryptService } from ".";

@autoInjectable()
class OtpService {
  private OtpDao: OtpDao;
  private EncryptService: EncryptService;

  private generateCode(l: number) {
    let code = "";
    for (let i = 0; i < l; i++) {
      code += Math.floor(Math.random() * 10).toString();
    }
    return code;
  }

  private encryptCode(code: string) {
    try {
      return this.EncryptService.hash(code);
    } catch (e) {
      throw e;
    }
  }

  constructor(_otpDao: OtpDao, _encryptService: EncryptService) {
    this.OtpDao = _otpDao;
    this.EncryptService = _encryptService;
  }

  async createOtp({ user_id, type }: {
    user_id: string;
    type: OtpTypes
  }) {
    try {
      const code = this.generateCode(4);
      const encrypted = this.encryptCode(code);

      await this.OtpDao.create({
        user_id,
        otp_type: type,
        code: encrypted,
        expires_at: new Date(Date.now() + 5 * 60 * 1000)
      });

      return code;
    } catch (e) {
      throw e;
    }
  }
}

export default OtpService