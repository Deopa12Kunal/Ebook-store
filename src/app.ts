import express from "express";
// import createHttpError from "http-errors";
// import { config } from "./config/config";
import globalErrorHandler from "./middlewares/globalErrorHandler";

const app = express();
// routes
//  app.use(express.json());
app.get("/", (req, res) => {
  //   const error = createHttpError(400, "Something went wrong");
  // throw error;

  res.json({ message: "Welcome to ebook api" });
});
// global error handler
// should be at last of all routes
app.use(globalErrorHandler);
export default app;
