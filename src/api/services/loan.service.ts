import { LoanDao, RepaymentDao } from "../dao";
import { CreateOptions, FindOptions } from "sequelize";
import { autoInjectable } from "tsyringe";
import { LoanAttributes, Tier } from "../../typings/loan";
import { LoanConstants } from "../../utils/constants";
import { LoanCreationAttributes } from "../../db/models/loan";
import { LoanRepaymentFrequency, RepaymentStatus } from "../../typings/enums";
import { RepaymentAttributes, RepaymentCreationBody } from "../../typings/repayment";

@autoInjectable()
class LoanService {
  private readonly LoanDAO: LoanDao;
  private readonly LoanConstants: LoanConstants;
  private readonly RepaymentDAO: RepaymentDao;

  constructor(_loanDao: LoanDao, _loanConstants: LoanConstants, _repaymentDao: RepaymentDao) {
    this.LoanDAO = _loanDao;
    this.LoanConstants = _loanConstants;
    this.RepaymentDAO = _repaymentDao;
  }

  async createLoan(data: LoanCreationAttributes, opts?: CreateOptions) {
    return await this.LoanDAO.create(
      data,
      opts
    );
  }

  async dbTransactionInstance() {
    return await this.LoanDAO.transaction();
  }

  async sumLoans(where: Partial<LoanAttributes>, opts?: FindOptions): Promise<number> {
    return await this.LoanDAO.func("sum", "amount", {
      where,
      ...opts
    });
  }

  async getLoans(where: Partial<LoanAttributes>, opts?: FindOptions) {
    return await this.LoanDAO.fetchAll({
      where,
      ...opts
    });
  }

  getEligibilityStatus(total: number = 0) {
    const status: Record<string, string | number> = {};
    const tiersMaxMinAmount = this.LoanConstants.getTiersMinMaxAmount();
    const tiers = this.LoanConstants.getConfig().interestRateTiers;

    status.minimumEligibilityAmount = tiersMaxMinAmount.tierOne.min;

    for (const tier of tiers) {
      if (total > tiersMaxMinAmount.tierFive.max) {
        status.highestEligibileTier = Tier.TIER_FIVE;
        status.currentTier = Tier.TIER_FIVE;
        break;
      } else {
        if (total >= tier.min && total <= tier.max) {
          const currentTier = tier.tier;
          const nextTierName = this.LoanConstants.getConfig().tierOrder[currentTier].next;
          const nextEligibleTier = this.LoanConstants.getConfig().tierOrder[nextTierName as Tier];

          status.currentTier = currentTier;
          if (nextEligibleTier) {
            status.maximumEligibileAmount = nextEligibleTier.max;
            status.highestEligibileTier = nextTierName;
          } else {
            status.maximumEligibileAmount = this.LoanConstants.getTiersMinMaxAmount().tierFive.max;
            status.highestEligibileTier = Tier.TIER_FIVE;
          }
          break;
        }
      }
    }
    return status;
  }

  getTierFromAmount(amount: number) {
    const config = this.LoanConstants.getConfig();
    return config.interestRateTiers.find(
      t => amount >= t.min && amount <= t.max
    );
  }

  getAllLoanTiers() {
    return this.LoanConstants.getConfig().interestRateTiers;
  }

  getLoanTier(tier: Tier) {
    return this.LoanConstants.getConfig().interestRateTiers.find(
      t => t.tier === tier
    ) || this.LoanConstants.getConfig().interestRateTiers[0];
  }

  generateRepaymentRecords(loan: LoanAttributes, weeks: number, frequency: LoanRepaymentFrequency) {
    const oneDay = 1000 * 60 * 60 * 24;
    const startDate = loan.start_date ? new Date(loan.start_date) : new Date();

    let count: number;
    let intervalDays: number; // default set in switch

    switch (frequency) {
      case LoanRepaymentFrequency.WEEKLY:
        count = Math.max(1, weeks);
        intervalDays = 7;
        break;
      case LoanRepaymentFrequency.BI_WEEKLY:
        count = Math.max(1, Math.ceil(weeks / 2));
        intervalDays = 14;
        break;
      case LoanRepaymentFrequency.MONTHLY:
        count = Math.max(1, Math.ceil(weeks / 4));
        intervalDays = 30;
        break;
      case LoanRepaymentFrequency.QUARTERLY:
        count = Math.max(1, Math.ceil(weeks / 13));
        intervalDays = 91;
        break;
      case LoanRepaymentFrequency.YEARLY:
        count = Math.max(1, Math.ceil(weeks / 52));
        intervalDays = 365;
        break;
      default:
        count = Math.max(1, weeks);
        intervalDays = 7;
    }

    const totalAmount = Number(loan.amount) || 0;
    const perInstRaw = totalAmount / count;
    const perInst = Math.floor(perInstRaw * 100) / 100;
    const records: RepaymentCreationBody[] = [];

    for (let i = 1; i <= count; i++) {
      const dueDate = new Date(startDate.getTime() + i * intervalDays * oneDay);

      let amountDue = perInst;
      if (i === count) {
        const accumulated = perInst * (count - 1);
        amountDue = +(totalAmount - accumulated).toFixed(2);
      } else {
        amountDue = +perInst.toFixed(2);
      }

      records.push({
        loan_id: loan.id,
        amount_due: amountDue,
        amount_paid: 0,
        status: RepaymentStatus.PENDING,
        due_date: dueDate
      });
    }

    return records;
  }

  async createRepayment(data: RepaymentCreationBody, opts?: CreateOptions) {
    return await this.RepaymentDAO.create(
      data,
      opts
    );
  }
}

export default LoanService;
