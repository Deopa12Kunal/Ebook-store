import app from "./src/app";
import { config } from "./src/config/config";
import connectBD from "./src/config/db";
const startServer = async () => {
   // connect database
  await connectBD();
  const port = config.port || 3001;
  app.listen(port, () => {
    console.log(`welcome from the server ${port}`);
  });
};
startServer();
