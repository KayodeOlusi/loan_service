import { Request, Response } from 'express';
import { autoInjectable } from "tsyringe";
import { ApiBuilders } from "../api.builders";
import { HttpStatusCodes } from "../../lib/codes";
import { AccountService, LoanService, RepaymentService, TransactionService } from '../services';
import { Exception, NotFoundException } from "../../lib/errors";
import { handleError } from "../../utils/handlers/error.handler";
import {
  LoanEmailTypes,
  LoanStatus,
  RepaymentStatus,
  TransactionStatus,
  TransactionTypes
} from "../../typings/enums";
import { CreateOptions, Op } from "sequelize";
import { RepaymentAttributes } from "../../typings/repayment";
import { TransactionCreationBody } from "../../typings/transaction";
import EmailQueueWorker from "../../utils/workers/email-queue.worker";

@autoInjectable()
class RepaymentController {
  private readonly RepaymentService;
  private readonly LoanService;
  private readonly TransactionService;
  private readonly AccountService;

  private async verifyAndGetLoan(loan_id: string) {
    const loan = await this.LoanService.getLoanById(loan_id);
    if (!loan) {
      throw new NotFoundException("Loan not found");
    }
    return loan;
  }

  private async initializeTransactionInstance() {
    return await this.RepaymentService.dbTransactionInstance();
  }

  private async verifyAndGetRepaymentById(id: string) {
    const repayment = await this.RepaymentService.getById(id);
    if (!repayment) {
      throw new NotFoundException("Repayment not found");
    }
    return repayment;
  }

  private async getAccount(user_id: string) {
    const account = await this.AccountService.getAccount({ user_id });
    if (!account) throw new NotFoundException("User account not found");

    return account;
  }

  private async createTransactionRecordForRepayment(
    data: { userId: string; loan_id: string, type: TransactionTypes, amount: number, repayment_id: string },
    opts?: CreateOptions
  ) {
    const account = await this.getAccount(data.userId);
    const record: TransactionCreationBody = {
      user_id: data.userId,
      account_id: account.id,
      repayment_id: data.repayment_id,
      loan_id: data.loan_id,
      type: data.type,
      status: TransactionStatus.SUCCESS,
      amount: data.amount,
      fee: 0,
    };

    return this.TransactionService.createTransaction(record, opts);
  }

  constructor(
    _repaymentService: RepaymentService,
    _loanService: LoanService,
    _transactionService: TransactionService,
    _accountService: AccountService
  ) {
    this.AccountService = _accountService;
    this.TransactionService = _transactionService;
    this.RepaymentService = _repaymentService;
    this.LoanService = _loanService;
  }

  getAllRepayments = async (req: Request, res: Response) => {
    try {
      const repayments = await this.RepaymentService.getRepayments({});

      return ApiBuilders.buildResponse(res, {
        data: repayments,
        message: "All repayments fetched successfully",
        code: HttpStatusCodes.SUCCESSFUL_REQUEST,
        status: true
      });
    } catch (e) {
      const error = e as Exception;
      handleError(error, res);
    }
  }

  getUserRepayments = async (req: Request, res: Response) => {
    try {
      const user = res.locals.user;
      const [repayments] = await this.RepaymentService.queryRepayments(
        `
            SELECT r.*
            FROM Repayment r
                     INNER JOIN Loan l ON loan_id = l.id
            WHERE l.user_id = :user_id
        `,
        { user_id: user.id }
      );

      const data = repayments ?? [];
      return ApiBuilders.buildResponse(res, {
        data,
        message: "User repayments fetched successfully",
        code: HttpStatusCodes.SUCCESSFUL_REQUEST,
        status: true
      });
    } catch (e) {
      const error = e as Exception;
      handleError(error, res);
    }
  }

  getRepaymentById = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;

      const repayment = await this.RepaymentService.getById(id);
      if (!repayment) {
        return ApiBuilders.buildResponse(res, {
          data: null,
          message: "Repayment not found",
          code: HttpStatusCodes.NOT_FOUND,
          status: false
        });
      }

      return ApiBuilders.buildResponse(res, {
        data: repayment,
        message: "Repayment fetched successfully",
        code: HttpStatusCodes.SUCCESSFUL_REQUEST,
        status: true
      });
    } catch (e) {
      const error = e as Exception;
      handleError(error, res);
    }
  }

  getLoanRepayments = async (req: Request, res: Response) => {
    try {
      const loan_id = req.params.loan_id;
      const repayments = await this.RepaymentService.getRepayments({
        loan_id
      });

      return ApiBuilders.buildResponse(res, {
        data: repayments,
        message: "Loan repayments fetched successfully",
        code: HttpStatusCodes.SUCCESSFUL_REQUEST,
        status: true
      });
    } catch (e) {
      const error = e as Exception;
      handleError(error, res);
    }
  }

  getLoanRepaymentSchedule = async (req: Request, res: Response) => {
    try {
      const loan_id = req.params.loan_id;
      await this.verifyAndGetLoan(loan_id);

      const repayments = await this.RepaymentService.getRepayments(
        { loan_id },
        {
          attributes: [
            ["createdAt", "date_initiated"],
            "due_date",
            "date_paid"
          ],
          order: [["due_date", "ASC"]]
        }
      );

      return ApiBuilders.buildResponse(res, {
        data: repayments,
        message: "Loan repayment schedule fetched successfully",
        code: HttpStatusCodes.SUCCESSFUL_REQUEST,
        status: true
      });
    } catch (e) {
      const error = e as Exception;
      handleError(error, res);
    }
  }

  getUpcomingRepayments = async (req: Request, res: Response) => {
    try {
      const user = res.locals.user;

      const outstandingLoan = await this.LoanService.getLoan({
        status: LoanStatus.PENDING,
        user_id: user.id,
      });
      if (!outstandingLoan) {
        return ApiBuilders.buildResponse(res, {
          data: [],
          message: "No upcoming repayments",
          code: HttpStatusCodes.SUCCESSFUL_REQUEST,
          status: true
        });
      }
      const [repayments] = await this.RepaymentService.queryRepayments(
        `
            SELECT r.*
            FROM Repayment r
            WHERE r.loan_id = :loan_id
              AND r.status IN (:statuses)
            ORDER BY r.due_date ASC
        `,
        { loan_id: outstandingLoan.id, statuses: [RepaymentStatus.PENDING, RepaymentStatus.LATE] }
      );

      const data = repayments ?? [];
      return ApiBuilders.buildResponse(res, {
        data,
        message: "Upcoming repayments fetched successfully",
        code: HttpStatusCodes.SUCCESSFUL_REQUEST,
        status: true
      });
    } catch (e) {
      const error = e as Exception;
      handleError(error, res);
    }
  }

  updateRepaymentStatus = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const { status } = req.body;

      await this.RepaymentService.updateRepayment(
        { status },
        { where: { id } }
      );

      return ApiBuilders.buildResponse(res, {
        data: null,
        message: "Repayment status updated successfully",
        code: HttpStatusCodes.SUCCESSFUL_REQUEST,
        status: true
      });
    } catch (e) {
      const error = e as Exception;
      handleError(error, res);
    }
  }

  getUserOverDueRepayments = async (req: Request, res: Response) => {
    try {
      const user = res.locals.user;
      const [repayments] = await this.RepaymentService.queryRepayments(
        `
            SELECT r.*
            FROM Repayment r
                     INNER JOIN Loan l ON r.loan_id = l.id
            WHERE l.user_id = :user_id
              AND r.status = :status
            ORDER BY r.due_date ASC
        `,
        { user_id: user.id, status: RepaymentStatus.LATE }
      );

      const data = repayments ?? [];
      return ApiBuilders.buildResponse(res, {
        data,
        message: "User overdue repayments fetched successfully",
        code: HttpStatusCodes.SUCCESSFUL_REQUEST,
        status: true
      });
    } catch (e) {
      const error = e as Exception;
      handleError(error, res);
    }
  }

  makeRepayment = async (req: Request, res: Response) => {
    let _trx;
    try {
      const repayment_id = req.params.id;
      const body = req.body;
      const user = res.locals.user;

      const repayment = await this.verifyAndGetRepaymentById(repayment_id);
      if (!([RepaymentStatus.PENDING, RepaymentStatus.LATE].includes(repayment.status))) {
        return ApiBuilders.buildResponse(res, {
          data: null,
          message: "Repayment cannot be made on this repayment item",
          code: HttpStatusCodes.UNPROCESSABLE_ENTITY,
          status: false
        });
      }

      const loan = await this.verifyAndGetLoan(repayment.loan_id);
      if (loan.status !== LoanStatus.PENDING) {
        return ApiBuilders.buildResponse(res, {
          data: null,
          message: "Repayment cannot be made on this loan",
          code: HttpStatusCodes.UNPROCESSABLE_ENTITY,
          status: false
        });
      }
      if (loan.user_id !== user.id) {
        return ApiBuilders.buildResponse(res, {
          data: null,
          message: "You are not authorized to make a repayment on this loan",
          code: HttpStatusCodes.UNAUTHORIZED,
          status: false
        });
      }

      const unsettledRepayments = await this.RepaymentService.getRepayments({}, {
        where: {
          loan_id: loan.id,
          status: { [Op.in]: [RepaymentStatus.PENDING, RepaymentStatus.LATE] },
          due_date: { [Op.lt]: repayment.due_date }
        }
      });
      if (unsettledRepayments.length > 0) {
        return ApiBuilders.buildResponse(res, {
          data: null,
          message: "Please settle previous repayments before making this payment.",
          code: HttpStatusCodes.UNPROCESSABLE_ENTITY,
          status: false
        });
      }

      const [totalAmountPaidForLoan] = await this.RepaymentService.queryRepayments(
        `
            SELECT SUM(r.amount_paid)            as total_paid,
                   (SELECT SUM(amount_due)
                    FROM Repayment r2
                    WHERE r2.loan_id = :loan_id) as total_due
            FROM Repayment r
            WHERE r.loan_id = :loan_id
        `,
        { loan_id: loan.id }
      );

      if (totalAmountPaidForLoan) {
        let { total_due } = totalAmountPaidForLoan[0] as {
          total_paid: number,
          total_due: number
        };
        const totalDue = Number(total_due) ?? 0;
        if (body.amount > totalDue) {
          return ApiBuilders.buildResponse(res, {
            data: null,
            message: "Total amount paid exceeds total amount due for the loan.",
            code: HttpStatusCodes.BAD_REQUEST,
            status: false
          });
        }
      }

      const repaymentAmount = Number(repayment.amount_due);
      const amountPaid = body.amount;

      if (amountPaid < repaymentAmount) {
        return ApiBuilders.buildResponse(res, {
          data: null,
          message: "Amount paid is less than amount due.",
          code: HttpStatusCodes.BAD_REQUEST,
          status: false
        });
      }

      _trx = await this.initializeTransactionInstance();
      const amountToAssignToCurrentRepayment = Math.min(repaymentAmount, amountPaid);
      await this.RepaymentService.updateRepayment(
        {
          amount_paid: amountToAssignToCurrentRepayment,
          amount_due: 0,
          status: RepaymentStatus.PAID,
          date_paid: new Date()
        },
        {
          where: {
            id: repayment.id,
            status: { [Op.in]: [RepaymentStatus.PENDING, RepaymentStatus.LATE] }
          },
          transaction: _trx
        }
      );
      await this.createTransactionRecordForRepayment(
        {
          repayment_id: repayment.id,
          userId: user.id,
          loan_id: loan.id,
          type: TransactionTypes.REPAYMENT,
          amount: repayment.amount_due,
        },
        { transaction: _trx }
      );

      if (amountPaid > repaymentAmount) {
        const amountLeftToAllocate = amountPaid - repaymentAmount;
        const upcomingRepayments = await this.RepaymentService.getRepayments({}, {
          where: {
            loan_id: loan.id,
            status: { [Op.in]: [RepaymentStatus.PENDING, RepaymentStatus.LATE] },
            due_date: { [Op.gt]: repayment.due_date }
          },
          transaction: _trx
        });

        if (upcomingRepayments.length > 0) {
          let amountToAllocate = amountLeftToAllocate;

          for (const upcomingRepayment of upcomingRepayments) {
            if (amountToAllocate <= 0) break;
            try {
              const repaymentAmountDue = Number(upcomingRepayment.amount_due);
              const currentAmountPaid = Number(upcomingRepayment.amount_paid) || 0;
              const remainingAmountDue = repaymentAmountDue - currentAmountPaid;

              const amountToAllocateToThisRepayment = Math.min(amountToAllocate, remainingAmountDue);
              const newAmountPaid = currentAmountPaid + amountToAllocateToThisRepayment;
              const newAmountDue = repaymentAmountDue - amountToAllocateToThisRepayment;

              let updateData: Partial<RepaymentAttributes> = {
                amount_paid: newAmountPaid,
                date_paid: new Date(),
                amount_due: newAmountDue,
              };

              if (newAmountPaid >= repaymentAmountDue) {
                updateData.status = RepaymentStatus.PAID;
              }

              await this.RepaymentService.updateRepayment(
                updateData,
                {
                  where: { id: upcomingRepayment.id },
                  transaction: _trx
                }
              );
              await this.createTransactionRecordForRepayment(
                {
                  repayment_id: upcomingRepayment.id,
                  userId: user.id,
                  loan_id: loan.id,
                  type: TransactionTypes.REPAYMENT,
                  amount: amountToAllocateToThisRepayment,
                },
                { transaction: _trx }
              );

              amountToAllocate -= amountToAllocateToThisRepayment;
            } catch (e) {
              throw e;
            }
          }
        }
      }

      await this.RepaymentService.queryRepayments(
        `
          UPDATE Loan l
          SET l.status = :new_status
          WHERE l.status = :current_status
          AND NOT EXISTS (
              SELECT 1
              FROM Repayment r
              WHERE r.loan_id = l.id
              AND r.status <> :paid_status
          )
          AND EXISTS (
            SELECT 1
            FROM Repayment r
            WHERE r.loan_id = l.id
          )
        `,
        { new_status: LoanStatus.PAID_OFF, current_status: LoanStatus.PENDING, paid_status: RepaymentStatus.PAID },
        { transaction: _trx }
      );

      EmailQueueWorker.addToQueue({
        to: user.email,
        type: LoanEmailTypes.REPAYMENT,
        message: `
          Dear ${user.first_name},
          Your repayment of amount ₦${body.amount.toFixed(2)} for ${loan.purpose} loan has been received successfully.
        `
      });

      await _trx.commit();
      return ApiBuilders.buildResponse(res, {
        data: null,
        message: "Repayment made successfully",
        code: HttpStatusCodes.SUCCESSFUL_REQUEST,
        status: true
      });
    } catch (e) {
      if (_trx) await _trx.rollback();

      const error = e as Exception;
      handleError(error, res);
    }
  }
}

export default RepaymentController;
