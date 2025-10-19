import { Request, Response } from "express";
import { autoInjectable } from "tsyringe";
import { ApiBuilders } from "../api.builders";
import { HttpStatusCodes } from "../../lib/codes";
import { OtpService, UserService } from "../services";
import { handleError } from "../../utils/handlers/error.handler";
import { Exception, ValidationException } from "../../lib/errors";
import EmailQueueWorker from "../../utils/workers/email-queue.worker";

@autoInjectable()
class OtpController {
  private OtpService: OtpService;
  private UserService: UserService;

  private async _getAndVerifyUserByField(where: string, target: string) {
    const user = await this.UserService.getUserByField({
      [where]: target
    });
    if (!user) throw new ValidationException("User does not exist!");

    return user;
  }

  constructor(_otpService: OtpService, _userService: UserService) {
    this.OtpService = _otpService;
    this.UserService = _userService;
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

      if (otpType === "VERIFY_EMAIL") {
        await this.UserService.update(
          { is_verified: true },
          { where: { email } }
        );
      }

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

      EmailQueueWorker.addToQueue({
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

  requestOtp = async (req: Request, res: Response) => {
    const { email, otpType } = req.body;
    try {
      const user = await this._getAndVerifyUserByField("email", email.trim().toLocaleLowerCase());
      await this.OtpService.deleteOtp({
        otp_type: otpType,
        user_id: user.id,
      });

      const code = await this.OtpService.createOtp({
        user_id: user.id,
        type: otpType
      });

      EmailQueueWorker.addToQueue({
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
