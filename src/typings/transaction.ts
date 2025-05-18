import { TransactionStatus, TransactionTypes } from "./enums";

export type TransactionAttributes = {
  id: string;
  user_id: string;
  account_id: string;
  loan_id: string;
  repayment_id: string;
  amount: number;
  fee: number;
  metadata: Record<string, any>;
  reference: string;
  status: TransactionStatus;
  type: TransactionTypes;
  createdAt: Date;
  updatedAt: Date;
}

export interface TransactionCreationBody extends Omit<TransactionAttributes, "id" | "createdAt" | "updatedAt"> {
}