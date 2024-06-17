import express from "express";
// import createHttpError from "http-errors";
// import { config } from "./config/config";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./users/userRouters";

const app = express();
app.use(express.json());
// routes
//  app.use(express.json());
app.get("/", (req, res) => {
  //   const error = createHttpError(400, "Something went wrong");
  // throw error;

  res.json({ message: "Welcome to ebook api" });
});
app.use("/api/users", userRouter);
// global error handler
// should be at last of all routes
app.use(globalErrorHandler);
export default app;
