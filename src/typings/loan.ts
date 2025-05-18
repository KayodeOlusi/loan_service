import { LoanRepaymentFrequency, LoanStatus } from "./enums";

export type LoanAttributes = {
  id: string;
  user_id: string;
  amount: number;
  interest_rate: number;
  status: LoanStatus;
  tenure_months: number;
  repayment_frequency: LoanRepaymentFrequency;
  purpose: string;
  start_date: Date;
  end_date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoanCreationBody extends Omit<LoanAttributes, "id" | "createdAt" | "updatedAt"> {
}