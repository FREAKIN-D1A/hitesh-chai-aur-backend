import { COLORS } from "../constant.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
  // get uer details from frontend
  const { fullname: fullName, email, username, password } = req.body;
  console.log(COLORS.FgCyan, "\n\n");
  console.log("{ fullname, email, username, password }:\n", {
    fullName: fullName,
    email,
    username,
    password,
  });
  console.log(COLORS.Reset, "\n\n");

  // validation - not empty
  if (
    [fullName, email, username, password].some((field) => field?.trimm == "")
  ) {
    throw new ApiError(400, "All fields are required.");
  }

  // check if user already exists : username, emails
  const existsUser = User.findOne({
    $or: [{ username }, { email }],
  });
  if (existsUser) {
    throw new ApiError(409, "User with username or password exists here.");
  }
  // check avatar, images
  const avatarLocalPath = req.files?.avatar[0]?.path; // first property gives an option of path
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  // upload to cloudinary , avatar
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar is required");
  }

  // create user obj - create entry in mongodb
  const newUser = await User.create({
    fullName: fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  // remove password and refress token from response
  const CreatedUser = User.findById(newUser.id).select(
    "-password -refreshToken"
  );

  // check for user creation
  if (!CreatedUser) {
    throw new ApiError(500, "Something went wrong while registering the user.");
  }

  //   return response
  return res
    .status(201)
    .json(new ApiResponse(200, CreatedUser, "User Registered Successfully"));
});

export { registerUser };
