import { LoanRepaymentFrequency, LoanStatus } from "./enums";

export type LoanAttributes = {
  id: string;
  user_id: string;
  amount: number;
  interest_rate: number;
  status: LoanStatus;
  repayment_frequency: LoanRepaymentFrequency;
  purpose: string;
  start_date: Date;
  end_date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum Tier {
  TIER_ONE = "tier_one",
  TIER_TWO = "tier_two",
  TIER_THREE = "tier_three",
  TIER_FOUR = "tier_four",
  TIER_FIVE = "tier_five"
}

export interface LoanCreationBody extends Omit<LoanAttributes, "id" | "createdAt" | "updatedAt"> {
}