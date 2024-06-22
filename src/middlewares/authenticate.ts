// import { config } from "dotenv";
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { verify } from "jsonwebtoken";
// import { config } from "dotenv";
export interface AuthRequest extends Request {
  userId: string;
}
const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization");
  if (!token) {
    return next(createHttpError(401, "Authentication token required"));
  }

  try {
    const parseToken = token.split(" ")[1];
    if (!parseToken) {
      return next(createHttpError(401, "Malformed token"));
    }
    const jwtSecret = process.env.JWT_SECRET;

    const decoded = verify(parseToken, jwtSecret as string);
    console.log("Decoded", decoded);
    const _req = req as AuthRequest;
    _req.userId = decoded.sub as string;
    next();
  } catch (err) {
    return next(createHttpError(401, "token expired"));
  }
};
export default authenticate;
