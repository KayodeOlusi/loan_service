import Logger from "../../lib/logger";
import { autoInjectable } from "tsyringe";
import { Exception } from "../../lib/errors";
import { ApiBuilders } from "../api.builders";
import { Request, Response } from "express";
import { HttpStatusCodes } from "../../lib/codes";
import { UserCreationBody } from "../../typings/user";
import { AccountStatus, OtpTypes } from "../../typings/enums";
import { AccountService, EncryptService, MailService, OtpService, UserService } from "../services";

@autoInjectable()
class UserController {
  private UserService: UserService;
  private AccountService: AccountService;
  private EncryptService: EncryptService;
  private OtpService: OtpService;
  private MailService: MailService;

  constructor(_userService: UserService, _accountService: AccountService, _encryptService: EncryptService, _otpService: OtpService, _mailService: MailService) {
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
      delete (newUser as any).password;

      return ApiBuilders.buildResponse(res, {
        status: true,
        data: newUser,
        code: HttpStatusCodes.RESOURCE_CREATED,
        message: "User account has been created successfully"
      });

    } catch (e) {
      const error = e as Exception;

      Logger.error(error.message, error);
      return ApiBuilders.buildResponse(res, {
        status: false,
        code: error.code || HttpStatusCodes.SERVER_ERROR,
        message: error.message || "An error occurred, Try again later",
        data: null
      });
    }
  }

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const user = await this.UserService.getUserByField({
        email: email.trim().toLocaleLowerCase()
      });
      if (!user) {
        return ApiBuilders.buildResponse(res, {
          status: false,
          code: HttpStatusCodes.BAD_REQUEST,
          message: "User does not exist",
          data: null
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

      const _token = this.EncryptService.generateToken(user);
      const data = {
        token: _token,
        ...user.toJSON()
      };

      delete (data as any).password;
      return ApiBuilders.buildResponse(res, {
        data,
        code: HttpStatusCodes.SUCCESSFUL_REQUEST,
        message: "User logged in successfully",
        status: true
      })
    } catch (e) {
      const error = e as Exception;

      Logger.error(error.message, error);
      return ApiBuilders.buildResponse(res, {
        status: false,
        code: error.code || HttpStatusCodes.SERVER_ERROR,
        message: error.message || "An error occurred, Try again later",
        data: null
      });
    }
  }

  changePassword = async (req: Request, res: Response) => {

  }

  forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
      const user = await this.UserService.getUserByField({ email });
      if (!user) {
        return ApiBuilders.buildResponse(res, {
          data: null,
          message: "User does not exist",
          code: HttpStatusCodes.NOT_FOUND,
          status: false
        });
      }

      /*
      * TODO:
      *   1. Verify code
      *   2. Change user password
      * */
    } catch (e) {
      const error = e as Exception;
      Logger.error(error.message, error);
      return ApiBuilders.buildResponse(res, {
        status: false,
        code: error.code || HttpStatusCodes.SERVER_ERROR,
        message: "An error occurred. Try again later",
        data: null
      });
    }
  }
}

export default UserController;