import { autoInjectable } from "tsyringe";
import { Request, Response } from "express";
import { ApiBuilders } from "../api.builders";
import { HttpStatusCodes } from "../../lib/codes";
import { LoanAttributes, Tier } from "../../typings/loan";
import { CreateOptions } from "sequelize";
import { UserAttributes } from "../../typings/user";
import { LoanConstants } from "../../utils/constants";
import { DataHelpers } from "../../utils/helpers";
import { LoanCreationAttributes } from "../../db/models/loan";
import { handleError } from "../../utils/handlers/error.handler";
import {
  LoanRepaymentFrequency,
  LoanStatus,
  TransactionStatus,
  TransactionTypes
} from "../../typings/enums";
import { LoanService, TransactionService, UserService, AccountService } from "../services";
import { Exception, NotFoundException, UnprocessableEntityException } from "../../lib/errors";
import { TransactionCreationBody } from "../../typings/transaction";
import Logger from "../../lib/logger";

@autoInjectable()
class LoanController {
  private readonly LoanService: LoanService;
  private readonly LoanConstants: LoanConstants;
  private readonly TransactionService: TransactionService;
  private readonly UserService: UserService;
  private readonly AccountService: AccountService;
  private readonly DataHelpers: DataHelpers;

  private async sequelizeTransaction() {
    return await this.LoanService.dbTransactionInstance();
  }

  private async getUser(id: string) {
    const user = await this.UserService.getUserById(id);
    if (!user) throw new NotFoundException("User not found");

    return user;
  }

  private async getUserAccount(user_id: string) {
    const account = await this.AccountService.getAccount({ user_id });
    if (!account) throw new NotFoundException("User account not found");

    return account;
  }

  private getTierDetails(tier: Tier) {
    const tierConfig = this.LoanService.getLoanTier(tier);
    if (!tierConfig) throw new NotFoundException("Tier configuration not found");

    return tierConfig;
  }

  private async checkTotalUnpaidLoans(userId: string) {
    const unpaidLoans = await this.LoanService.getLoans({
      user_id: userId,
      status: LoanStatus.PENDING
    });

    if (unpaidLoans.length >= 3) {
      throw new UnprocessableEntityException(
        "You have too many unpaid loans. Please pay off some loans before requesting a new one."
      );
    }
  }

  private async checkUserTier(userId: string, amount: number) {
    const completedLoansAmount = await this.LoanService.sumLoans({
      status: LoanStatus.PAID_OFF,
      user_id: userId,
    });
    const userTierEligibilityStatus = this.LoanService.getEligibilityStatus(
      completedLoansAmount
    );

    if (userTierEligibilityStatus.currentTier !== Tier.TIER_FIVE) {
      const currentTier = userTierEligibilityStatus.currentTier as Tier;
      if (amount > this.getTierDetails(currentTier).max) {
        throw new UnprocessableEntityException(
          "You are not eligible for this amount based on your current tier."
        );
      }
    }
  }

  private getRepaymentFrequency(obj: Partial<LoanCreationAttributes>) {
    try {
      const totalWeeks = this.DataHelpers.noOfWeeks(obj.start_date, obj.end_date);
      const paymentFreq = obj.repayment_frequency as LoanRepaymentFrequency;

      return {
        noOfWeeks: totalWeeks,
        paymentFrequency: paymentFreq
      }
    } catch (e) {
      throw e;
    }
  }

  private async createLoanRecord(body: LoanCreationAttributes, user: UserAttributes, opts?: CreateOptions) {
    const tier = this.LoanService.getTierFromAmount(body.amount);
    if (!tier) {
      throw new UnprocessableEntityException(
        "The amount you are requesting does not match any of the loan tiers."
      );
    }

    return await this.LoanService.createLoan({
      user_id: user.id,
      status: LoanStatus.PENDING,
      amount: body.amount,
      purpose: body.purpose,
      start_date: body.start_date,
      end_date: body.end_date,
      repayment_frequency: body.repayment_frequency,
      interest_rate: tier.interest
    }, opts);
  }

  private async createRepaymentRecords(
    loan: LoanAttributes,
    repaymentConfig: { noOfWeeks: number, paymentFrequency: LoanRepaymentFrequency },
    opts?: CreateOptions
  ) {
    try {
      const records = this.LoanService.generateRepaymentRecords(
        loan,
        repaymentConfig.noOfWeeks,
        repaymentConfig.paymentFrequency
      );

      for (const record of records) {
        await this.LoanService.createRepayment(record, opts);
      }
    } catch (e) {
      throw e;
    }
  }

  private async createTransactionRecordForLoan(
    data: { userId: string; loan: LoanAttributes; type: TransactionTypes },
    opts?: CreateOptions
  ) {
    const account = await this.getUserAccount(data.userId);
    const record: TransactionCreationBody = {
      user_id: data.userId,
      account_id: account.id,
      loan_id: data.loan.id,
      type: data.type,
      status: TransactionStatus.PENDING,
      amount: data.loan.amount,
      fee: 0,
    };

    return this.TransactionService.createTransaction(record, opts);
  }

  constructor(
    _loanService: LoanService,
    _transactionService: TransactionService,
    _userService: UserService,
    _accountService: AccountService,
    _loanConstants: LoanConstants,
    _dataHelpers: DataHelpers
  ) {
    this.LoanService = _loanService;
    this.TransactionService = _transactionService;
    this.UserService = _userService;
    this.LoanConstants = _loanConstants;
    this.DataHelpers = _dataHelpers;
    this.AccountService = _accountService;
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

  /**
   * Steps
   * 1. Check if a user is eligible for a loan ✅
   *     - If a user's account is active and is verified ✅
   *     - If a user has up to 3 unpaid loans, they are not eligible ✅
   * 2. Check the tier configuration for user ✅
   * 3. Check the payment frequency and the amount the user wants to borrow
   * 4. Create a loan record and transaction record and repayment record based on the payment frequency
   * */
  requestLoan = async (req: Request, res: Response) => {
    let t;
    try {
      const user: UserAttributes = res.locals.user;
      const body = req.body;
      t = await this.sequelizeTransaction();

      await this.checkTotalUnpaidLoans(user.id);
      await this.checkUserTier(user.id, req.body.amount);

      const repaymentConfig = this.getRepaymentFrequency(body);
      if (!repaymentConfig) {
        return ApiBuilders.buildResponse(res, {
          data: null,
          status: false,
          message: "Could not determine repayment configuration. Please check your start and end dates.",
          code: HttpStatusCodes.UNPROCESSABLE_ENTITY
        });
      }

      const loan = await this.createLoanRecord(body, user, {
        transaction: t
      });
      await this.createRepaymentRecords(loan, repaymentConfig, {
        transaction: t
      });
      await this.createTransactionRecordForLoan(
        {
          userId: user.id,
          type: TransactionTypes.LOAN,
          loan
        },
        { transaction: t }
      );

      await t.commit();
      Logger.info(`Loan request created successfully for user ${user.id}`);

      return ApiBuilders.buildResponse(res, {
        status: true,
        data: loan,
        code: HttpStatusCodes.SUCCESSFUL_REQUEST,
        message: "Loan request created successfully",
      });
    } catch (e) {
      if (t) t.rollback();
      const error = e as Exception;
      return handleError(error, res);
    }
  }
}

export default LoanController;
