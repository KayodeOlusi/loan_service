import { OtpTypes } from "./enums";

export type OtpAttributes = {
  id: string;
  user_id: string;
  code: string;
  expires_at: Date;
  otp_type: OtpTypes;
  createdAt: Date;
  updatedAt: Date;
}

export interface OtpCreationBody
  extends Omit<OtpAttributes, "id" | "createdAt" | "updatedAt"> {
}