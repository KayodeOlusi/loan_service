import { Tier } from "../../typings/loan";
import { LoanRepaymentFrequency } from "../../typings/enums";

class LoanConstants {
  private readonly MINIMUM_LOAN_AMOUNT: number = 10_000;
  private readonly MAXIMUM_LOAN_AMOUNT: number = 10_000_000;

  private readonly TIER_ONE_MAX_LOAN_AMOUNT: number = 100_000;
  private readonly TIER_ONE_INTEREST_RATE: number = 5.25;

  private readonly TIER_TWO_MIN_LOAN_AMOUNT: number = 100_001;
  private readonly TIER_TWO_MAX_LOAN_AMOUNT: number = 500_000;
  private readonly TIER_TWO_INTEREST_RATE: number = 6.25;

  private readonly TIER_THREE_MIN_LOAN_AMOUNT: number = 500_001;
  private readonly TIER_THREE_MAX_LOAN_AMOUNT: number = 1_000_000;
  private readonly TIER_THREE_INTEREST_RATE: number = 7.25;

  private readonly TIER_FOUR_MIN_LOAN_AMOUNT: number = 1_000_001;
  private readonly TIER_FOUR_MAX_LOAN_AMOUNT: number = 5_000_000;
  private readonly TIER_FOUR_INTEREST_RATE: number = 8.25;

  private readonly TIER_FIVE_MIN_LOAN_AMOUNT: number = 5_000_001;
  private readonly TIER_FIVE_MAX_LOAN_AMOUNT: number = this.MAXIMUM_LOAN_AMOUNT;
  private readonly TIER_FIVE_INTEREST_RATE: number = 9.25;

  private readonly config = {
    interestRateTiers: [
      {
        tier: Tier.TIER_ONE,
        min: this.MINIMUM_LOAN_AMOUNT,
        max: this.TIER_ONE_MAX_LOAN_AMOUNT,
        interest: this.TIER_ONE_INTEREST_RATE
      },
      {
        tier: Tier.TIER_TWO,
        min: this.TIER_TWO_MIN_LOAN_AMOUNT,
        max: this.TIER_TWO_MAX_LOAN_AMOUNT,
        interest: this.TIER_TWO_INTEREST_RATE
      },
      {
        tier: Tier.TIER_THREE,
        min: this.TIER_THREE_MIN_LOAN_AMOUNT,
        max: this.TIER_THREE_MAX_LOAN_AMOUNT,
        interest: this.TIER_THREE_INTEREST_RATE
      },
      {
        tier: Tier.TIER_FOUR,
        min: this.TIER_FOUR_MIN_LOAN_AMOUNT,
        max: this.TIER_FOUR_MAX_LOAN_AMOUNT,
        interest: this.TIER_FOUR_INTEREST_RATE
      },
      {
        tier: Tier.TIER_FIVE,
        min: this.TIER_FIVE_MIN_LOAN_AMOUNT,
        max: this.MAXIMUM_LOAN_AMOUNT,
        interest: this.TIER_FIVE_INTEREST_RATE
      }
    ],
    tierOrder: {
      tier_one: {
        min: this.MINIMUM_LOAN_AMOUNT,
        max: this.TIER_ONE_MAX_LOAN_AMOUNT,
        interest: this.TIER_ONE_INTEREST_RATE,
        next: Tier.TIER_TWO
      },
      tier_two: {
        min: this.TIER_TWO_MIN_LOAN_AMOUNT,
        max: this.TIER_TWO_MAX_LOAN_AMOUNT,
        interest: this.TIER_TWO_INTEREST_RATE,
        next: Tier.TIER_THREE
      },
      tier_three: {
        min: this.TIER_THREE_MIN_LOAN_AMOUNT,
        max: this.TIER_THREE_MAX_LOAN_AMOUNT,
        interest: this.TIER_THREE_INTEREST_RATE,
        next: Tier.TIER_FOUR
      },
      tier_four: {
        min: this.TIER_FOUR_MIN_LOAN_AMOUNT,
        max: this.TIER_FOUR_MAX_LOAN_AMOUNT,
        interest: this.TIER_FOUR_INTEREST_RATE,
        next: Tier.TIER_FIVE
      },
      tier_five: {
        min: this.TIER_FIVE_MIN_LOAN_AMOUNT,
        max: this.MAXIMUM_LOAN_AMOUNT,
        interest: this.TIER_FIVE_INTEREST_RATE,
        next: ""
      }
    }
  }

  getConfig() {
    return this.config;
  }

  getTiersMinMaxAmount() {
    return {
      tierOne: {
        min: this.MINIMUM_LOAN_AMOUNT,
        max: this.TIER_ONE_MAX_LOAN_AMOUNT
      },
      tierTwo: {
        min: this.TIER_TWO_MIN_LOAN_AMOUNT,
        max: this.TIER_TWO_MAX_LOAN_AMOUNT
      },
      tierThree: {
        min: this.TIER_THREE_MIN_LOAN_AMOUNT,
        max: this.TIER_THREE_MAX_LOAN_AMOUNT
      },
      tierFour: {
        min: this.TIER_FOUR_MIN_LOAN_AMOUNT,
        max: this.TIER_FOUR_MAX_LOAN_AMOUNT
      },
      tierFive: {
        min: this.TIER_FIVE_MIN_LOAN_AMOUNT,
        max: this.TIER_FIVE_MAX_LOAN_AMOUNT
      },
    }
  }
}

export default LoanConstants;