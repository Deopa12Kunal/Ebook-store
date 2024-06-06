import mongoose, { connect } from "mongoose";
import { config } from "./config";
const connectBD = async () => {
  try {
    // we will register first 
     mongoose.connection.on("connected", () => {
       console.log("Connected  to database successfully");
     });
     mongoose.connection.on("error", (err) => {
       console.log("Failed to connect to database", err);
     });
    await mongoose.connect(config.databaseUrl as string);
   
  } catch (err) {
    console.log("Failed to connect to database", err);
    process.exit(1);
  }
};
export default connectBD;