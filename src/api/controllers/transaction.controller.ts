import { autoInjectable } from "tsyringe";
import { Request, Response } from "express";
import { TransactionService } from "../services";
import { ApiBuilders } from "../api.builders";
import { Exception, ValidationException } from "../../lib/errors";
import { handleError } from "../../utils/handlers/error.handler";
import { HttpStatusCodes } from "../../lib/codes";

@autoInjectable()
class TransactionController {
  private TransactionService: TransactionService;

  constructor(_transactionService: TransactionService) {
    this.TransactionService = _transactionService;
  }

  private getPagination(page: string, size: string) {
    if (isNaN(parseInt(page)) || isNaN(parseInt(size)))
      throw new ValidationException("Page and size must be numbers");

    const pageSize = parseInt(size);
    const pageNumber = parseInt(page);

    const limit = pageSize ? +pageSize : 10;
    const offset = pageNumber ? pageNumber * limit - limit : 0;

    return {
      limit,
      offset,
      pageSize,
      pageNumber,
    }
  }

  exportTransactions = async (req: Request, res: Response) => {
    try {
      const transactions = await this.TransactionService.getTransactions({});

      return ApiBuilders.buildResponse(res, {
        status: true,
        data: transactions,
        message: "Transactions fetched successfully",
        code: HttpStatusCodes.SUCCESSFUL_REQUEST
      });
    } catch (e) {
      const error = e as Exception;
      handleError(error, res);
    }
  }

  getAllTransactions = async (req: Request, res: Response) => {
    try {
      const { page, size } = req.query;
      const pagination = this.getPagination(page as string, size as string);

      const { rows, count } = await this.TransactionService.getPaginatedTransactions({}, {
        limit: pagination.limit,
        offset: pagination.offset,
        order: [["createdAt", "DESC"]],
      });

      return ApiBuilders.buildResponse(res, {
        status: true,
        code: HttpStatusCodes.SUCCESSFUL_REQUEST,
        message: "Transactions fetched successfully",
        data: rows,
        addOns: {
          total: count,
          page: pagination.pageNumber,
          size: pagination.pageSize
        }
      });
    } catch (e) {
      const error = e as Exception;
      handleError(error, res);
    }
  }
}

export default TransactionController;