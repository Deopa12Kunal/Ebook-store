// import { Request, Response, NextFunction } from "express-serve-static-core";
// import cloudinary from "../config/cloudinary";
// import path from 'node:path';
// //data we received from req body
// // we will receive data in different forn that is (form-data) not json data
// const createBook = async (req: Request, res: Response, next: NextFunction) => {
//   //  const {} = req.body;
//   console.log("files", req.files);
//   // typescript can define it as null we will use this method we are type [casting it]
//   const files = req.files as { [filename:string]: Express.Multer.File[] };
//    // we can access it here using files
//   const coverImageMineType = files.coverImage[0].mimetype.split("/").at(-1);
//   const fileName = files.coverImage[0].fieldname;
//    const filePath = path.join(__dirname,'../../public/data/uploads', fileName);

//   //  we are trying to upload the result in cloudinary
//   const uploadResult = await cloudinary.uploader.upload(filePath, {
//     filename_override: fileName,
//     folder: "book-cover",
//     format: coverImageMineType,
//   });
//   console.log("uploadresult",uploadResult);
//   res.json({});
// };
// export { createBook };
import { Request, Response, NextFunction } from "express-serve-static-core";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import fs from "fs";
import createHttpError from "http-errors";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
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
 const bookFileUploadResult = await cloudinary.uploader.upload(bookFilePath,{

  resource_type: 'raw',
  filename_override: bookFileName,
  folder: "book-pdfs",
  format: 'pdf',
 });
  console.log("bookFileUploadResult", bookFileUploadResult);

 console.log("uploadResult", uploadResult);

    // Sending a successful response
    res.json({ message: "Book created successfully", uploadResult });
  } catch (error) {
    // Passing the error to the next middleware (error handling middleware)
   return next(createHttpError(500,'Error while uploading the files'));
  }
};

export { createBook };
