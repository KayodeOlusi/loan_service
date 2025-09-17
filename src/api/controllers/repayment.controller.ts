import { Request, Response } from 'express';
import { autoInjectable } from "tsyringe";
import { ApiBuilders } from "../api.builders";
import { HttpStatusCodes } from "../../lib/codes";
import { LoanService, RepaymentService } from '../services';
import { Exception, NotFoundException } from "../../lib/errors";
import { handleError } from "../../utils/handlers/error.handler";
import { LoanStatus, RepaymentStatus } from "../../typings/enums";

@autoInjectable()
class RepaymentController {
  private readonly RepaymentService;
  private readonly LoanService;

  private async verifyAndGetLoan(loan_id: string) {
    const loan = await this.LoanService.getLoanById(loan_id);
    if (!loan) {
      throw new NotFoundException("Loan not found");
    }

    return loan;
  }

  constructor(_repaymentService: RepaymentService, _loanService: LoanService) {
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
          SELECT r.* FROM Repayment r
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
}

export default RepaymentController;
