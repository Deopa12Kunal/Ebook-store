import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { User } from "./userTypes";
// import { config  } from "dotenv";
const createUser = async (req: Request, res: Response, next: NextFunction) => {
  //  console.log("reqdata",req.body);
  //  return res.json({});
  const { name, email, password } = req.body;
  // validation
  if (!name || !email || !password) {
    const error = createHttpError(400, "All fields are required");
    return next(error);
  }
  //todo error handling
  try {
    const user = await userModel.findOne({ email });
    if (user) {
      const error = createHttpError(400, "user already exists with this email");
      return next(error);
    }
  } catch (err) {
    return next(createHttpError(500, "Error while getting user"));
  }
  // database call

  //Todo: Hasing password using a library bcrypt
  const hashedPassword = await bcrypt.hash(password, 10);
  let newUser: User;
  try {
    newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });
  } catch (err) {
    return next(createHttpError(500, "error while creating error"));
  }
  try {
    // TODO : TOKEN GENERATION JWT TOKEN USING A LIBRARY jsonwebtoken
    // const token = sign({sub:newUser._id}, config.jwtSecret as string ,{expiresIn: "7d"});
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      const error = createHttpError(500, "JWT secret not defined");
      return next(error);
    }

    const token = sign({ sub: newUser._id }, jwtSecret as string, {
      expiresIn: "7d",
    });
    res.status(201).json({ accessToken: token });
  } catch (err) {
    return next(createHttpError(500, "error while signing jwt token "));
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(createHttpError(400, "All fields are required"));
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(createHttpError(400, "Invalid password or username"));
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return next(createHttpError(500, "JWT secret not defined"));
    }

    const token = sign({ sub: user._id }, jwtSecret, { expiresIn: "7d" });
    res.json({ accessToken: token });
  } catch (err) {
    return next(createHttpError(500, "Error while logging user in"));
  }
};

export { createUser, loginUser };
