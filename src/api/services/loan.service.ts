import { LoanDao } from "../dao";
import { autoInjectable } from "tsyringe";

@autoInjectable()
class LoanService {
  private LoanDAO: LoanDao;

  constructor(_loanDao: LoanDao) {
    this.LoanDAO = _loanDao;
  }
}

export default LoanService;