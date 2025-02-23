import { OtpDao } from "../dao";
import { EncryptService } from ".";
import { autoInjectable } from "tsyringe";
import { OtpTypes } from "../../typings/enums";
import { NotFoundException, ValidationException } from "../../lib/errors";
import { DestroyOptions } from "sequelize";
import { OtpAttributes } from "../../typings/otp";

@autoInjectable()
class OtpService {
  private OtpDao: OtpDao;
  private EncryptService: EncryptService;

  private _generateCode(l: number) {
    let code = "";
    for (let i = 0; i < l; i++) {
      code += Math.floor(Math.random() * 10).toString();
    }
    return code;
  }

  private _encryptCode(code: string) {
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
      const code = this._generateCode(4);
      const encrypted = this._encryptCode(code);

      await this.OtpDao.delete({
        where: { user_id, otp_type: type }
      });
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

  async verifyOtp({ user_id, type, code }: {
    user_id: string;
    type: OtpTypes;
    code: string;
  }) {
    const otp = await this.OtpDao.fetchOne({
      where: { otp_type: type, user_id }
    });

    if (!otp) throw new NotFoundException("Otp does not exist");

    const otpMatch = await this.EncryptService.compare(code, otp.code);
    if (!otpMatch) throw new NotFoundException("Otp does not exist");

    const currentTime = new Date();
    const expiryDate = new Date(otp.expires_at);
    if (currentTime > expiryDate) throw new ValidationException("Otp has expired.");

    await this.OtpDao.delete({
      where: {
        user_id,
        otp_type: type,
        code: otp.code
      }
    });
  }

  async deleteOtp(record: Partial<OtpAttributes>, opts?: DestroyOptions) {
    try {
      await this.OtpDao.delete({
        where: { ...record },
        ...opts,
      });
    } catch (e) {
      throw e;
    }
  }
}

export default OtpService