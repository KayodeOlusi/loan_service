import { AccountStatus } from "./enums";

export type UserAttributes = {
  id: string;
  first_name: string;
  last_name: string;
  account_status: AccountStatus;
  email: string;
  password: string;
  is_verified: boolean;
  phone_number: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreationBody
  extends Omit<UserAttributes, "id" | "createdAt" | "updatedAt"> {
}


