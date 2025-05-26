import { autoInjectable } from "tsyringe";
import { Request, Response } from "express";
import { Exception, NotFoundException } from "../../lib/errors";
import { LoanService, TransactionService, UserService } from "../services";
import { handleError } from "../../utils/handlers/error.handler";
import { LoanStatus } from "../../typings/enums";
import { ApiBuilders } from "../api.builders";
import { HttpStatusCodes } from "../../lib/codes";
import { Tier } from "../../typings/loan";

@autoInjectable()
class LoanController {
  private readonly LoanService: LoanService;
  private readonly TransactionService: TransactionService;
  private readonly UserService: UserService;

  private async getUser(id: string) {
    const user = await this.UserService.getUserById(id);
    if (!user) throw new NotFoundException("User not found");

    return user;
  }

  private getTierDetails(tier: Tier) {
    const tierConfig = this.LoanService.getLoanTier(tier);
    if (!tierConfig) throw new NotFoundException("Tier configuration not found");

    return tierConfig;
  }

  constructor(_loanService: LoanService, _transactionService: TransactionService, _userService: UserService) {
    this.LoanService = _loanService;
    this.TransactionService = _transactionService;
    this.UserService = _userService;
  }

  checkUserEligibility = async (req: Request, res: Response) => {
    try {
      const userId = req.params.user_id;
      const user = await this.getUser(userId);

      const totalCompletedLoanAmount = await this.LoanService.sumLoans({
        status: LoanStatus.PAID_OFF,
        user_id: user.id
      });

      const eligibilityStatus = this.LoanService.getEligibilityStatus(totalCompletedLoanAmount);

      return ApiBuilders.buildResponse(res, {
        status: true,
        data: eligibilityStatus,
        code: HttpStatusCodes.SUCCESSFUL_REQUEST,
        message: "User eligibility status fetched successfully",
      });
    } catch (e) {
      const error = e as Exception;
      return handleError(error, res);
    }
  }

  getTierConfig = async (req: Request, res: Response) => {
    try {
      const tier = req.query.tier as Tier;
      const config = this.getTierDetails(tier);

      return ApiBuilders.buildResponse(res, {
        status: true,
        data: config,
        code: HttpStatusCodes.SUCCESSFUL_REQUEST,
        message: "Tier configuration fetched successfully",
      });
    } catch (e) {
      const error = e as Exception;
      return handleError(error, res);
    }
  }

  getAllTiersConfig = async (req: Request, res: Response) => {
    try {
      const tiers = this.LoanService.getAllLoanTiers();

      return ApiBuilders.buildResponse(res, {
        status: true,
        data: tiers,
        code: HttpStatusCodes.SUCCESSFUL_REQUEST,
        message: "All loan tiers configuration fetched successfully",
      });
    } catch (e) {
      const error = e as Exception;
      return handleError(error, res);
    }
  }
}

export default LoanController;