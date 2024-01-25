import { COLORS } from "../constant.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
  // get uer details from frontend
  const { fullName, email, username, password } = req.body;

  // console.log(COLORS.FgGreen, "\n");
  // console.log("req.body:\n");
  // console.log(req.body);
  // console.log(COLORS.Reset, "\n\n");

  // console.log(COLORS.FgCyan, "\n\n");
  // console.log("{ fullName, email, username, password }:\n", {
  //   fullName,
  //   email,
  //   username,
  //   password,
  // });
  // console.log(COLORS.Reset, "\n\n");

  // validation - not empty
  if (
    [fullName, email, username, password].some((field) => field?.trimm == "")
  ) {
    throw new ApiError(400, "All fields are required.");
  }

  // check if user already exists : username, emails
  const existsUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existsUser) {
    throw new ApiError(409, "User with username or password exists here.");
  }

  console.log(COLORS.FgBlue, "\n\n");
  console.log("req.files   >>>>>>\n");
  console.log(req.files);
  console.log(COLORS.Reset, "\n\n");

  // check avatar, images
  // const avatarLocalPath = req?.files?.avatar[0]?.path; // first property gives an option of path
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req?.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    console.log(COLORS.FgMagenta, "\n\n");
    console.log("Avatar is required: eq.files?.avatar[0]?.path:\n");
    console.log(COLORS.Reset, "\n\n");
    throw new ApiError(400, "Avatar is required: eq.files?.avatar[0]?.path");
  }

  // upload to cloudinary , avatar
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    console.log(COLORS.FgYellow, "\n\n");
    console.log("Avatar is required: eq.files?.avatar[0]?.path:\n");
    console.log(COLORS.Reset, "\n\n");

    throw new ApiError(
      400,
      "Avatar is required await uploadOnCloudinary(avatarLocalPath);"
    );
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
  const CreatedUser = await User.findById(newUser.id).select(
    "-password -refreshToken"
  );

  // console.log(COLORS.FgBlue, "\n\n");
  // console.log("CreatedUser   >>>>>>\n");
  // console.log(CreatedUser);
  // console.log(COLORS.Reset, "\n\n");

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
