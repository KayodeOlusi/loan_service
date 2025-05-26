import { LoanDao } from "../dao";
import { FindOptions } from "sequelize";
import { autoInjectable } from "tsyringe";
import { LoanAttributes, Tier } from "../../typings/loan";
import { LoanConstants } from "../../utils/constants";

@autoInjectable()
class LoanService {
  private readonly LoanDAO: LoanDao;
  private readonly LoanConstants: LoanConstants;

  constructor(_loanDao: LoanDao, _loanConstants: LoanConstants) {
    this.LoanDAO = _loanDao;
    this.LoanConstants = _loanConstants;
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

  getAllLoanTiers() {
    return this.LoanConstants.getConfig().interestRateTiers;
  }

  getLoanTier(tier: Tier) {
    return this.LoanConstants.getConfig().interestRateTiers.find(
      t => t.tier === tier
    );
  }
}

export default LoanService;