import { UserAttributes } from "./user";

declare global {
  namespace Express {
    export interface Request {
      user?: UserAttributes;
    }
  }
}