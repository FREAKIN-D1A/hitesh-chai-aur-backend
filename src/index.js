import dotenv from "dotenv";
dotenv.config({ path: "./env" });
import connectDB from "./db/index.js";
import express from "express";

connectDB();
const app = express();

// (async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URI}`);
//     app.on("error", (error) => {
//       console.log(COLORS.FgRed);
//       console.log("\n\n\n");
//       console.log("Error", error);
//       console.log(COLORS.Reset);
//     });

//     app.listen(process.env.PORT, () => {
//       console.log(COLORS.FgCyan, '\n\n\n');
//       console.log("\n\n\n");
//       console.log(`App is listening on port ${process.env.PORT}`);
//       console.log(COLORS.Reset, '\n\n\n');
//     });
//   } catch (error) {
//     console.log(COLORS.FgRed);
//     console.log("\n\n\n");
//     console.log("Error", error);
//     console.log(COLORS.Reset);
//     throw err;
//   }
// })();
