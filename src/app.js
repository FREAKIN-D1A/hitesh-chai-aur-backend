import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

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

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

export default app;
