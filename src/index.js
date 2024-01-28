import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import connectDB from "./db/index.js";
import app from "./app.js";
import { COLORS } from "./constant.js";

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(COLORS.FgCyan, "\n\n\n");
      console.log(`App is listening on port ${process.env.PORT || 8000}`);
      console.log(COLORS.Reset, "\n\n\n");
    });
  })
  .catch((error) => {
    console.log(COLORS.FgRed, "\n\n");
    console.log("Mongodb connection Failed. Error:\n", error);
    console.log(COLORS.Reset, "\n\n");
  });
