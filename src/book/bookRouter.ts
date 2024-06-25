import express from "express";
import { createBook, listBooks, updateBook } from "./bookController";
import path from 'node:path';
import multer from "multer";
import authenticate from "../middlewares/authenticate";
const bookRouter = express.Router();

const upload =multer({
dest:path.resolve(__dirname,'../../public/data/uploads'),
//todo put limit as 10MB for user
limits:{fieldSize: 3e7} // defines the size that is 30 mb
})
// routes
bookRouter.post("/",
    authenticate,
    upload.fields([
{name:'coverImage',maxCount:1},
{name: "file", maxCount:1},
]), 
createBook);

bookRouter.patch(
  "/:bookId",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  updateBook
);
bookRouter.get('/',listBooks);

export default bookRouter;
