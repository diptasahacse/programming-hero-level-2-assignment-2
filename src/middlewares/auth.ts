import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import userService from "../modules/users/userServices";
const { getUserByEmail } = userService;
export const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { authorization } = req.headers;

      const token = (authorization || "").split(" ")[1];
      if (!token) {
        return res.status(401).json({
          message: "Unauthenticated",
          success: false,
        });
      }
      const decode = jwt.verify(token, config.jwt_secret) as JwtPayload;

      const authorized = roles.includes(decode.role);
      if (!authorized) {
        return res.status(403).json({
          message: "Unauthorized",
          success: false,
        });
      }

      const exist = await getUserByEmail(decode.email);
      if (!exist) {
        return res.status(403).json({
          message: "Unauthorized",
          success: false,
        });
      }

      req.user = decode;

      next();
    } catch (error: any) {
      res.status(500).json({
        message: error.message || "Internal Server error",
        success: false,
      });
    }
  };
};
