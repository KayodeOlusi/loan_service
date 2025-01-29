import { UserAttributes } from "./user";

declare global {
  namespace Express {
    interface Request {
      user?: UserAttributes;
    }
  }
}