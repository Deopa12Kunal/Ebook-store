import express from "express";
// import createHttpError from "http-errors";
import { config } from "./config/config";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./users/userRouters";
import bookRouter from "./book/bookRouter";
import cors from "cors";
// import { config } from "dotenv";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: config.frontendDomain,
  })
);
// routes
//  app.use(express.json());
app.get("/", (req, res) => {
  //   const error = createHttpError(400, "Something went wrong");
  // throw error;

  res.json({ message: "Welcome to ebook api" });
});
app.use("/api/users", userRouter);
app.use("/api/books", bookRouter);
// global error handler
// should be at last of all routes
app.use(globalErrorHandler);
export default app;
