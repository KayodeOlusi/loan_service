import { autoInjectable } from "tsyringe";
import { LoanService, TransactionService } from "../services";

@autoInjectable()
class LoanController {
  private LoanService: LoanService;
  private TransactionService: TransactionService;

  constructor(_loanService: LoanService, _transactionService: TransactionService) {
    this.LoanService = _loanService;
    this.TransactionService = _transactionService;
  }
}

export default LoanController;