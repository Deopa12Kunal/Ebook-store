import { config as conf } from "dotenv";
conf();

const _config = {
  port: process.env.PORT,
  databaseUrl: process.env.MONGO_CONNECTION_STRING,
  env: process.env.NODE_ENV,
  cloudinaryCloud: process.env.CLOUDINARY_CLOUD,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinarySecret: process.env.CLOUDINARY_API_SECRET,

  // SPECIAL ENV VARIABLES IS USED TO IDENTIFY WHICH ENV IT IS DEV OR PRODUCTION
  // jwtSecret: process.env.JWT_SECRET,
};

export const config = Object.freeze(_config);
