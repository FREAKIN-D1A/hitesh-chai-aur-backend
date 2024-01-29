import { COLORS } from "../constant.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

const generateAccessTokenAndRefreshToken = async (UserId) => {
  // try {
  const user = await User.findById(UserId);

  console.log(COLORS.FgMagenta, "\n\n");
  console.log("user inside function  >>>>>>\n");
  console.log({ user });
  console.log(COLORS.Reset, "\n\n");

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  console.log(COLORS.FgCyan, "\n\n");
  console.log("accessToken, refreshToken  >>>>>>\n");
  console.log({ accessToken, refreshToken });
  console.log(COLORS.Reset, "\n\n");

  // user.accessToken = accessToken;
  user.refreshToken = refreshToken;

  console.log(COLORS.FgMagenta, "\n\n");
  console.log(" user.refreshToken = refreshToken; >>>>>>\n");
  console.log({ user });
  console.log(COLORS.Reset, "\n\n");

  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
  // } catch (error) {
  //   throw new ApiError(
  //     500,
  //     "error : something went wrong in generateAccessTokenAndRefreshToken"
  //   );
  // }
};

const registerUser = asyncHandler(async (req, res) => {
  // get uer details from frontend
  const { fullName, email, username, password } = req.body;

  console.log(COLORS.FgBlue, "\n\n");
  console.log("req.files   >>>>>>\n");
  console.log(req.files);
  console.log(COLORS.Reset, "\n\n");

  console.log(COLORS.FgGreen, "\n");
  console.log("req.body >>>>>>:\n");
  console.log(req.body);
  console.log(COLORS.Reset, "\n\n");

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

  // check avatar, images
  const avatarLocalPath = req.files?.avatar[0]?.path; // first property gives an option of path
  // const coverImageLocalPath = req?.files?.coverImage[0]?.path || "";
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req?.files?.coverImage[0]?.path;
  }

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
    coverImage: coverImage?.url,
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

const loginUser = asyncHandler(async (req, res) => {
  /*
  req.body - > data
  username or email
  find user
  password check
  access and refresh token generation
  send secure cookies
  */

  console.log(COLORS.FgBlue, "\n\n");
  console.log("req.body;  >>>>>>\n");
  console.log(req.body);
  console.log(COLORS.Reset, "\n\n");

  const { email, password, username } = req.body;
  if (!email && !username) {
    throw new ApiError(400, "no !email || !username");
  }

  const user = await User.findOne({ $or: [{ username }, { email }] });

  if (!user) {
    throw new ApiError(400, "User does not exist");
  }
  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "User invalid credentials");
  }

  // console.log(COLORS.FgMagenta, "\n\n");
  // console.log("user  >>>>>>\n");
  // console.log({ user });
  // console.log({ isPasswordCorrect });
  // console.log(COLORS.Reset, "\n\n");

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User LoggedIn SuccessFully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  /* 
  get incomingRefreshTokenn from cookies or body(phone app) , check whether incomingRefreshToken exists
  try decoding the incomingRefreshToken with jwt.verify  else throw error
  get user with decodedToken and check if user exists

  check if the refresh token is expired. 
  send response with cookies 
  */
  //  get incomingRefreshTokenn from cookies or body(phone app)
  const incomingRefreshToken =
    req.cookies.refreshToken || res.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken != user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }
    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessTokenAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (newPassword != confirmPassword) {
    throw new ApiError(400, "newPassword and confirmPassword has to be equal");
  }
  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, {}, "Password updated"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "current user fetched successfully"));
});

const updateUserDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;
  if (!fullName || !email) {
    throw new ApiError(400, "All fields are required here.");
  }
  const user = User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName: fullName,
        email: email,
      },
    },
    { new: true }
  ).select("-password");
  return res
    .status(200)
    .json(new ApiResponse(200, user, " user info updated successfully"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "avatarLocalPath required. avatar file missing");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar.url) {
    throw new ApiError(400, "error while uploading avatar");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: { avatar: avatar.url },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, " avatar updated successfully"));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    throw new ApiError(
      400,
      "coverImageLocalPath required. cover image file missing"
    );
  }
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!coverImage.url) {
    throw new ApiError(400, "error while uploading coverImage");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: { coverImage: coverImage.url },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, " coverImage updated successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  updateUserAvatar,
  updateUserDetails,
  getCurrentUser,
  refreshAccessToken,
  changeCurrentPassword,
  updateUserCoverImage,
};
