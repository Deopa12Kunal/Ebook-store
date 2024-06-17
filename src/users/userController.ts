import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt";
const createUser = async (req: Request, res: Response, next: NextFunction) => {
  //  console.log("reqdata",req.body);
  //  return res.json({});
  const { name, email, password } = req.body;
  // validation
  if (!name || !email || !password) {
    const error = createHttpError(400, "All fields are required");
    return next(error);
  }
  // database call
  const user = await userModel.findOne({ email });
  if (user) {
    const error = createHttpError(400, "user already exists with this email");
    return next(error);
  }
  //Todo: Hasing password using a library bcrypt
  const hashedPassword = await bcrypt.hash(password, 10);

  //    return res.json({ message: "All fields must be filled." });
  //process
  //resonse
  res.json({ message: "User Created" });
};
export { createUser };
