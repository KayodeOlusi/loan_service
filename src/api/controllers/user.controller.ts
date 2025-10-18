import { autoInjectable } from "tsyringe";
import { ApiBuilders } from "../api.builders";
import { Request, Response } from "express";
import { HttpStatusCodes } from "../../lib/codes";
import { UserAttributes, UserCreationBody } from "../../typings/user";
import { AccountStatus, OtpTypes } from "../../typings/enums";
import { handleError } from "../../utils/handlers/error.handler";
import { Exception, ValidationException } from "../../lib/errors";
import { AccountService, EncryptService, MailService, OtpService, UserService } from "../services";
import { Queue } from "../../lib/queue";

@autoInjectable()
class UserController {
  private UserService: UserService;
  private AccountService: AccountService;
  private EncryptService: EncryptService;
  private OtpService: OtpService;
  private MailService: MailService;

  constructor(
    _userService: UserService,
    _accountService: AccountService,
    _encryptService: EncryptService,
    _otpService: OtpService,
    _mailService: MailService
  ) {
    this.UserService = _userService;
    this.AccountService = _accountService;
    this.EncryptService = _encryptService;
    this.OtpService = _otpService;
    this.MailService = _mailService;
  }

  private async _createUserRecord(data: UserCreationBody) {
    const user = await this.UserService.createUser(data);
    if (!user) throw new Exception("Error creating user account. Try again later");

    return user;
  }

  private async _verifyUserByField(where: string, target: string) {
    const user = await this.UserService.getUserByField({
      [where]: target
    });
    if (!user) throw new ValidationException("User does not exist!");

    return user;
  }

  register = async (req: Request, res: Response) => {
    try {
      const body: UserCreationBody = req.body;

      let email = body.email.trim().toLocaleLowerCase();
      let phone_number = body.phone_number;
      const emailExists = await this.UserService.getUserByField({
        email
      });
      const phoneExists = await this.UserService.getUserByField({
        phone_number
      });

      if (emailExists) {
        return ApiBuilders.buildResponse(res, {
          status: false,
          code: HttpStatusCodes.BAD_REQUEST,
          message: "User already exists",
          data: null
        });
      }

      if (phoneExists) {
        return ApiBuilders.buildResponse(res, {
          status: false,
          code: HttpStatusCodes.BAD_REQUEST,
          message: "Phone number already exists",
          data: null
        });
      }

      const data = {
        is_verified: false,
        first_name: body.first_name,
        last_name: body.last_name,
        phone_number: body.phone_number,
        account_status: AccountStatus.ACTIVE,
        email: body.email.toLocaleLowerCase(),
        password: this.EncryptService.hash(body.password),
      };

      const user = await this._createUserRecord(data);
      await this.AccountService.createAccount(user.id);

      let newUser = { ...user.toJSON() };
      delete (newUser as Partial<UserAttributes>).password;

      const verificationCode = await this.OtpService.createOtp({
        user_id: newUser.id,
        type: OtpTypes.VERIFY_EMAIL
      });

      Queue.channel.publish(
        Queue.emailQueue.exchange,
        Queue.emailQueue.routingKey,
        Buffer.from(JSON.stringify({
          to: newUser.email,
          code: verificationCode,
          type: OtpTypes.VERIFY_EMAIL
        }))
      );
      // await this.MailService.sendMail({
      //   to: newUser.email,
      //   code: verificationCode,
      //   type: OtpTypes.VERIFY_EMAIL
      // });

      return ApiBuilders.buildResponse(res, {
        status: true,
        data: newUser,
        code: HttpStatusCodes.RESOURCE_CREATED,
        message: "User account has been created successfully"
      });

    } catch (e) {
      const error = e as Exception;
      handleError(error, res);
    }
  }

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const user = await this.UserService.getUserWithAllAttributes({ email });
      if (!user) {
        return ApiBuilders.buildResponse(res, {
          status: false,
          code: HttpStatusCodes.NOT_FOUND,
          data: null,
          message: "User does not exist"
        });
      }

      const passwordMatch = await this.EncryptService.compare(password, user.password);
      if (!passwordMatch) {
        return ApiBuilders.buildResponse(res, {
          status: false,
          code: HttpStatusCodes.VALIDATION_ERROR,
          message: "Invalid login details",
          data: null,
        });
      }

      const JwtData: Partial<UserAttributes> = {
        email: user.email,
        id: user.id,
        account_status: user.account_status,
        is_verified: user.is_verified
      };

      const token = this.EncryptService.generateJWT(JwtData);

      return ApiBuilders.buildResponse(res, {
        data: JwtData,
        addOns: { token },
        code: HttpStatusCodes.SUCCESSFUL_REQUEST,
        message: "User logged in successfully",
        status: true
      })
    } catch (e) {
      const error = e as Exception;
      handleError(error, res);
    }
  }

  changePassword = async (req: Request, res: Response) => {
    const { new_password, old_password } = req.body;
    const locals = res.locals.user;

    try {
      const user = await this.UserService.getUserWithAllAttributes({
        id: locals.id
      });
      if (!user) {
        return ApiBuilders.buildResponse(res, {
          status: false,
          code: HttpStatusCodes.NOT_FOUND,
          data: null,
          message: "User does not exist"
        });
      }


      const isValidOldPassword = await this.EncryptService.compare(
        old_password,
        user.password
      );
      if (!isValidOldPassword) {
        return ApiBuilders.buildResponse(res, {
          status: false,
          code: HttpStatusCodes.VALIDATION_ERROR,
          data: null,
          message: "Old password does not match. Try again"
        });
      }

      const newPassword = this.EncryptService.hash(new_password);
      await this.UserService.update(
        { password: newPassword },
        { where: { id: user.id } }
      );

      return ApiBuilders.buildResponse(res, {
        status: true,
        data: null,
        message: "Password updated successfully",
        code: HttpStatusCodes.SUCCESSFUL_REQUEST
      });
    } catch (e) {
      const error = e as Exception;
      handleError(error, res);
    }
  }

  resetPassword = async (req: Request, res: Response) => {
    const { password, email, code, type } = req.body;
    try {
      const user = await this._verifyUserByField("email", email.trim().toLocaleLowerCase());
      await this.OtpService.verifyOtp({
        user_id: user.id,
        code,
        type
      });

      const newPassword = this.EncryptService.hash(password);
      await this.UserService.update(
        { password: newPassword },
        { where: { id: user.id } }
      );

      return ApiBuilders.buildResponse(res, {
        status: true,
        data: null,
        message: "Password has been reset successfully",
        code: HttpStatusCodes.SUCCESSFUL_REQUEST
      });
    } catch (e) {
      const error = e as Exception;
      handleError(error, res);
    }
  }

  verify = async (req: Request, res: Response) => {
    try {
      const { email, otp, type } = req.body;
      const user = await this._verifyUserByField("email", email.trim().toLocaleLowerCase());
      await this.OtpService.verifyOtp({
        code: otp,
        type,
        user_id: user.id
      });

      await this.UserService.update(
        { is_verified: true },
        { where: { id: user.id } }
      );

      return ApiBuilders.buildResponse(res, {
        status: true,
        data: null,
        message: "User account verified successfully",
        code: HttpStatusCodes.SUCCESSFUL_REQUEST
      });
    } catch (e) {
      const error = e as Exception;
      handleError(error, res);
    }
  }
}

export default UserController;
