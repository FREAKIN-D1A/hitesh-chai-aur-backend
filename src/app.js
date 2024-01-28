import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { COLORS } from "./constant.js";
import { upload } from "./middlewares/multer.middleware.js";
// const bodyParser = require("body-parser");
// import bodyParser from "body-parser";
// import multer from "multer";

// const upload = multer();

const app = express();

app.on("error", (error) => {
  console.log(COLORS.FgRed);
  console.log("\n\n\n");
  console.log("Error", error);
  console.log(COLORS.Reset);
});

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// for parsing multipart/form-data
app.use(upload.array());
app.use(express.static("public"));
app.use(cookieParser());

// routes imprt
import UserRouter from "./routes/user.routes.js";

// routes declaration
app.use("/api/v1/users", UserRouter);

export default app;
