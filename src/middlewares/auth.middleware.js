import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { COLORS } from "../constant.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    // console.log(COLORS.FgMagenta, "\n\n");
    // console.log(" verifyJWT = token  >>>>>>\n");
    // console.log({ token });
    // console.log(" req.cookies?.accessToken  >>>>>>\n");
    // console.log({ accessToken: req.cookies?.accessToken });
    // console.log(COLORS.Reset, "\n\n");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // console.log(COLORS.FgBlue, "\n\n");
    // console.log(" verifyJWT = decodedToken  >>>>>>\n");
    // console.log({ decodedToken });
    // console.log(COLORS.Reset, "\n\n");

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    // console.log(COLORS.FgBlue, "\n\n");
    // console.log(" verifyJWT = user  >>>>>>\n");
    // console.log({ user });
    // console.log(COLORS.Reset, "\n\n");

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;

    // console.log(COLORS.FgBlue, "\n\n");
    // console.log("  req.user = user;  >>>>>>\n");
    // console.log({ req });
    // console.log(COLORS.Reset, "\n\n");
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
});
