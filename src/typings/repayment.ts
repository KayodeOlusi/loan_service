import { RepaymentStatus } from "./enums";

export type RepaymentAttributes = {
  id: string;
  loan_id: string;
  due_date: Date;
  amount_due: number;
  amount_paid: number;
  date_paid: Date;
  status: RepaymentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface RepaymentCreationBody extends Omit<RepaymentAttributes, "id" | "createdAt" | "updatedAt"> {
}