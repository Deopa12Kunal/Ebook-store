import { Request, Response, NextFunction } from "express-serve-static-core";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import fs from "fs";
import createHttpError from "http-errors";
import bookModel from "./bookModel";
import { AuthRequest } from "../middlewares/authenticate";
// import userModel from "../user/userModel";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;
  try {
    console.log("files", req.files);

    // Type casting req.files to the expected structure
    const files = req.files as { [filename: string]: Express.Multer.File[] };

    if (!files || !files.coverImage || !files.coverImage[0]) {
      throw new Error("Cover image is required");
    }

    const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
    const fileName = files.coverImage[0].filename;
    const filePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      fileName
    );
    // Ensure the file exists
    if (!fs.existsSync(filePath)) {
      throw new Error("File not found at path: " + filePath);
    }

    console.log(
      `Uploading file ${fileName} with MIME type ${coverImageMimeType} from ${filePath}`
    );
    // Uploading the file to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: fileName,
      folder: "book-covers",
      format: coverImageMimeType,
    });
    const bookFileName = files.file[0].filename;
    const bookFilePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      bookFileName
    );
    const bookFileUploadResult = await cloudinary.uploader.upload(
      bookFilePath,
      {
        resource_type: "raw",
        filename_override: bookFileName,
        folder: "book-pdfs",
        format: "pdf",
      }
    );
    // console.log("bookFileUploadResult", bookFileUploadResult);
    //"@ts-ignore"
    // console.log("uploadResult", uploadResult);
    // console.log("userId", req.userId);
    //todo creating book
    const _req = req as AuthRequest;
    const newBook = await bookModel.create({
      title,
      genre,
      author: _req.userId,
      coverImage: uploadResult.secure_url,
      file: bookFileUploadResult.secure_url,
    });
    // deleting temp file  using fs modulle
    // await fs.promises.unlink(filePath);
    // await fs.promises.unlink(bookFilePath);
    // Deleting temp files using fs module
    try {
      await fs.promises.unlink(filePath);
      console.log(`Deleted file at path: ${filePath}`);
    } catch (unlinkError) {
      console.error(`Failed to delete file at path: ${filePath}`, unlinkError);
    }

    try {
      await fs.promises.unlink(bookFilePath);
      console.log(`Deleted file at path: ${bookFilePath}`);
    } catch (unlinkError) {
      console.error(
        `Failed to delete file at path: ${bookFilePath}`,
        unlinkError
      );
    }

    // res.json({ message: "Book created successfully", uploadResult });
    // Sending a successful response
    res
      .status(201)
      .json({ id: newBook._id, message: "Book created successfully" });
  } catch (error) {
    // Passing the error to the next middleware (error handling middleware)
    return next(createHttpError(500, "Error while uploading the files"));
  }
};
const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;
  const bookId = req.params.bookId;
  const book = await bookModel.findOne({ _id: bookId });
  if (!book) {
    // return next()
    return next(createHttpError(404, "Book not found"));
  }
  //check access
  const _req = req as AuthRequest;
  if (book.author.toString() !== _req.userId) {
    return next(createHttpError(403, "Sorry Access denied to Update Book"));
  }
  // checking if imagefeild is exixts or not
  const files = req.files as { [filename: string]: Express.Multer.File[] };
  let completeCoverImage = "";
  // let coverMimeType = "";

  if (files.coverImage) {

    const filename = files.coverImage[0].filename;
     const coverMimeType = files.coverImage[0].mimetype.split("/").at(-1);
    // const coverMimeType = files.coverImage[0].mimetype.split("/").at(-1);
    //Sending files to cloudinary
    const filePath = path.resolve(
      __dirname,
      "../../public/data/uploads" + filename
    );
    completeCoverImage = filename;
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: completeCoverImage,
      folder: "book-covers",
      format: coverMimeType,
    });
    completeCoverImage = uploadResult.secure_url;
    await fs.promises.unlink(filePath);
  }
  // check if file feild is exists
  let completeFileName = "";
  if (files.file) {
    // const filename = files.file[0].filename;
    const bookFilePath = path.resolve(
      __dirname,
      "../../public/data/uploads" + path.sep + files.file[0].filename
    );
    const bookFileName = files.file[0].filename;
    completeFileName = bookFileName;
    const uploadResultPdf = await cloudinary.uploader.upload(bookFilePath, {
      resource_type: "raw",
      filename_override: completeFileName,
      folder: "book-covers",
      format: "pdf",
    });
    completeFileName = uploadResultPdf.secure_url;
    await fs.promises.unlink(bookFilePath);
  }
  const updatedBook = await bookModel.findOneAndUpdate(
    {
      _id: bookId,
    },
    {
      title: title,
      genre: genre,
      coverImage: 
      completeCoverImage ? completeCoverImage : book.coverImage,
      file: completeFileName ? completeFileName : book.file,
    },
    { new: true }
  );
  res.json(updatedBook);
};
 const listBooks = async (req: Request, res: Response, next: NextFunction) => {
   try{
    // this find will return all the records present in database, production sysstem we 
    // will not use this ,(  we will use pagination)

 const book = await bookModel.find();

      res.json({book});


   }catch(err){
return next(createHttpError(500,"error while creating a book"));
   }
 };
export { createBook, updateBook, listBooks };
