import { container } from "tsyringe";
import { UserAttributes } from "../../typings/user";
import { NextFunction, Request, Response } from "express";
import { EncryptService, UserService } from "../services";
import { handleError } from "../../utils/handlers/error.handler";
import { Exception, NotFoundException, UnauthorizedException } from "../../lib/errors";
import { HttpStatusCodes } from "../../lib/codes";

const userService = container.resolve(UserService);

function verifyReqToken(data: string = "") {
  let token = data.split(" ")[1] ?? "";
  let decodedJwt =
    new EncryptService().verifyJWT(token, process.env.TOKEN_ID as string) as Partial<UserAttributes>;

  if (!decodedJwt) throw new UnauthorizedException("Invalid token. Try again");
  return decodedJwt;
}

async function verifyUserDetails(email: string = "") {
  const user = await userService.getUserByField({ email });
  if (!user) throw new NotFoundException("User does not exist");

  return user;
}

async function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  try {
    const tokenHeader = req.headers.authorization || req.headers["Authorization"] as string;
    const jwtDecoded = verifyReqToken(tokenHeader);
    const user = await verifyUserDetails(jwtDecoded.email);

    res.locals.user = user.toJSON();
    next();
  } catch (e) {
    let error = e as Exception;
    error.code = HttpStatusCodes.UNAUTHORIZED;
    handleError(error, res);
  }
}

export default isAuthenticated;