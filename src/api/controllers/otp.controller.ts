import { Request, Response } from "express";
import { ApiBuilders } from "../api.builders";
import { HttpStatusCodes } from "../../lib/codes";
import { Exception, ValidationException } from "../../lib/errors";
import { MailService, OtpService, UserService } from "../services";
import { handleError } from "../../utils/handlers/error.handler";

class OtpController {
  private OtpService: OtpService;
  private UserService: UserService;
  private MailService: MailService;

  private async _getAndVerifyUserByField(where: string, target: string) {
    const user = await this.UserService.getUserByField({
      [where]: target
    });
    if (!user) throw new ValidationException("User does not exist!");

    return user;
  }

  constructor(_otpService: OtpService, _userService: UserService, _mailService: MailService) {
    this.OtpService = _otpService;
    this.UserService = _userService;
    this.MailService = _mailService;
  }

  verifyOtp = async (req: Request, res: Response) => {
    const { email, code, otpType } = req.body;
    try {
      const user = await this._getAndVerifyUserByField("email", email.trim().toLocaleLowerCase());
      await this.OtpService.verifyOtp({
        user_id: user.id,
        type: otpType,
        code
      });

      return ApiBuilders.buildResponse(res, {
        status: true,
        code: HttpStatusCodes.SUCCESSFUL_REQUEST,
        data: null,
        message: "Otp verified successfully"
      });
    } catch (e) {
      const error = e as Exception;
      handleError(error, res);
    }
  };

  resendOtp = async (req: Request, res: Response) => {
    const { email, otpType } = req.body;
    try {
      const user = await this._getAndVerifyUserByField("email", email.trim().toLocaleLowerCase());
      await this.OtpService.deleteOtp({
        user_id: user.id,
        otp_type: otpType,
      });

      const code = await this.OtpService.createOtp({
        user_id: user.id,
        type: otpType
      });

      await this.MailService.sendMail({
        to: user.email,
        type: otpType,
        code
      });

      return ApiBuilders.buildResponse(res, {
        status: true,
        code: HttpStatusCodes.SUCCESSFUL_REQUEST,
        data: null,
        message: "Otp code has been sent to your email"
      });
    } catch (e) {
      const error = e as Exception;
      handleError(error, res);
    }
  }
}

export default OtpController