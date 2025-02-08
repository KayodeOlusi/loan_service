import { autoInjectable } from "tsyringe";
import { AccountService } from "../services";
import { Request, Response } from "express";
import { Exception } from "../../lib/errors";
import { handleError } from "../../utils/handlers/error.handler";
import { ApiBuilders } from "../api.builders";
import { HttpStatusCodes } from "../../lib/codes";

@autoInjectable()
class AccountController {
  private AccountService: AccountService;

  constructor(_accountService: AccountService) {
    this.AccountService = _accountService;
  }

  getAllAccounts = async (req: Request, res: Response) => {
    try {
      const accounts = await this.AccountService.getAccounts();
      return ApiBuilders.buildResponse(res, {
        status: true,
        data: accounts,
        message: "Accounts fetched successfully",
        code: HttpStatusCodes.SUCCESSFUL_REQUEST
      });
    } catch (e) {
      const error = e as Exception;
      handleError(error, res);
    }
  }

  getAccount = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const account = await this.AccountService.getAccount({
        id,
      });
      if (!account) {
        return ApiBuilders.buildResponse(res, {
          status: false,
          code: HttpStatusCodes.NOT_FOUND,
          data: null,
          message: "Account does not exist"
        });
      }

      return ApiBuilders.buildResponse(res, {
        status: true,
        data: account,
        message: "Account fetched successfully",
        code: HttpStatusCodes.SUCCESSFUL_REQUEST
      });
    } catch (e) {
      const error = e as Exception;
      handleError(error, res);
    }
  }
}

export default AccountController;