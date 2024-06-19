import express from "express";
import { createBook } from "./bookController";
import path from 'node:path';
import multer from "multer";
const bookRouter = express.Router();

const upload =multer({
dest:path.resolve(__dirname,'../../public/data/uploads'),
limits:{fieldSize: 3e7} // defines the size that is 30 mb
})
// routes
bookRouter.post("/",upload.fields([
{name:'coverImage',maxCount:1},
{name: "file", maxCount:1},
]), createBook);

export default bookRouter;
