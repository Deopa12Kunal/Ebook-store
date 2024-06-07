import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
     console.log("reqdata",req.body);
     return res.json({});
  const { name, email, password } = req.body;
  // validation
  if (!name || !email || !password) {
    const error = createHttpError(400, "All fields are required");
    return next(error);
   
  }
//    return res.json({ message: "All fields must be filled." });
  //process
  //resonse
  res.json({ message: "User Created" });
};
export { createUser };
