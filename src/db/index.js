import mongoose from "mongoose";
import { COLORS } from "../constant.js";
const connectDB = async (req, res, next) => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);

    console.log(COLORS.FgCyan, "\n");
    console.log(
      "MONGO connection established !\nDB host:\n",
      connectionInstance.connection.host
    );
    // console.log("MONGO connectionInstance :\n", connectionInstance);
    console.log(COLORS.Reset, "\n");
  } catch (error) {
    console.log(COLORS.FgRed, "\n");
    console.log("MONGO connection error", error);
    console.log(COLORS.Reset, "\n");
  }
};

export default connectDB;
