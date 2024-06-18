import { config as conf } from "dotenv";
conf();

const _config = {
  port: process.env.PORT,
  databaseUrl: process.env.MONGO_CONNECTION_STRING,
  env: process.env.NODE_ENV,
  // SPECIAL ENV VARIABLES IS USED TO IDENTIFY WHICH ENV IT IS DEV OR PRODUCTION
  // jwtSecret: process.env.JWT_SECRET,
};

export const config = Object.freeze(_config);
