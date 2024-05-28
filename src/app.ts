import express from "express";
const app = express();
// routes
//  app.use(express.json());
app.get("/", (req, res) => {
  res.json({ message: "Welcome to ebook api" });
});

export default app;
