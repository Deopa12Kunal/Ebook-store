import { Request, Response, NextFunction } from "express-serve-static-core";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import fs from "fs";
import createHttpError from "http-errors";
import bookModel from "./bookModel";

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
    console.log("bookFileUploadResult", bookFileUploadResult);
           //"@ts-ignore"
    console.log("uploadResult", uploadResult);
    // console.log("userId", req.userId);
    //todo creating book
    const newBook = await bookModel.create({
      title,
      genre,
      author: "66709103bf9da542f0b5dae9",
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

export { createBook };
