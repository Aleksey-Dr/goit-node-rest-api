import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from 'dotenv';

import authRouter from "./routes/authRouter.js";
import contactsRouter from "./routes/contactsRouter.js";

dotenv.config();
const { DB_HOST, PORT = 3000 } = process.env;

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use('/users', authRouter);
app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

mongoose.connect(DB_HOST)
.then(() => {
  app.listen(PORT, () => {
    console.log(`Database connection successful. Use our API on port: ${PORT}`);
  });
})
.catch(error => {
  console.log(message.error);
  process.exit(1);
});
