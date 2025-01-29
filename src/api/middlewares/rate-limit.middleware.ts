import Logger from "../../lib/logger";
import { ApiBuilders } from "../api.builders";
import { Exception } from "../../lib/errors";
import { redis } from "../../lib/pkg/redis";
import { HttpStatusCodes } from "../../lib/codes";
import { NextFunction, Request, Response } from "express";

type RateLimiterOptions = {
  exp?: number;
  max?: number;
}

function RateLimiter({
  exp = 60,
  max = 5
}: RateLimiterOptions) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      const ip =
        req.headers["x-forwarded-for"] || req.socket.remoteAddress || req.headers["cf-connecting-ip"];
      const key = `rl:${ip}-${req.originalUrl}`;
      const noOfRequests = await redis.incr(key);

      let ttl: number;
      if (noOfRequests === 1) {
        await redis.expire(key, exp);
        ttl = exp;
      } else {
        ttl = await redis.ttl(key);
      }

      if (noOfRequests > max) {
        return ApiBuilders.buildResponse(res, {
          data: null,
          status: false,
          code: HttpStatusCodes.TOO_MANY_REQUESTS,
          message: "Too many requests. Try again in a minute.",
        });
      }

      res.setHeader("X-RateLimit-Limit", max);
      res.setHeader("X-RateLimit-Remaining", max - noOfRequests);
      res.setHeader("X-RateLimit-Reset", ttl);

      next();
    } catch (e) {
      const error = e as Exception;

      Logger.error(error.message, error);
      return ApiBuilders.buildResponse(res, {
        data: null,
        status: false,
        code: HttpStatusCodes.SERVER_ERROR,
        message: "Internal server error",
      });
    }
  }
}

export default RateLimiter;