const { asyncHandler } = require("../utils/asyncHandler.js");
const { ApiError } = require("../utils/ApiError.js");
const { User } = require("../modals/user.js");
const { ApiResponse } = require("../utils/ApiResponse.js");

let addApiCount = 0;
let updateApiCount = 0;

const userRegistration = asyncHandler(async (req, res) => {
  addApiCount++;
  const { username, fullName, email } = req.body;
  if (!(username && fullName && email)) {
    throw new ApiError(400, "All fields are required");
  }
  const isExistingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (isExistingUser) {
    res.status(409).json(new ApiResponse(409, null, "User already exists"));
    throw new ApiError(409, "User already Exist");
  }

  const user = await User.create({
    fullName,
    email,
    username,
  });
  const createdUser = await User.findById(user._id);
  if (!createdUser) {
    res.status(500).json(new ApiResponse(409, null, "internal server error"));
    throw new ApiError(500, "internal server error");
  }
  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "user Register successfully"));
});

const updateProfile = asyncHandler(async (req, res) => {
  updateApiCount++;
  try {
    const userId = req.params.id;
    const { email, username, fullName } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { fullName, username, email } },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      res
        .status(500)
        .json(new ApiResponse(500, null, "Having trouble to update profile"));
      throw new ApiError(500, "Having trouble to update profile");
    }
    return res
      .status(208)
      .json(new ApiResponse(208, updatedUser, "Profile Updated"));
  } catch (error) {
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      res.status(500).json(new ApiResponse(400, null, "validationErrors"));
      throw new ApiError(400, validationErrors);
    }

    if (error.name === "MongoServerError" && error.code === 11000) {
      const duplicateField = Object.keys(error.keyValue)[0];
      res
        .status(500)
        .json(
          new ApiResponse(400, null, `${duplicateField} is already in use`)
        );
      throw new ApiError(400, `${duplicateField} is already in use`);
    }

    throw new ApiError(500, "Internal server error Duplicate key");
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    return res
      .status(200)
      .json(new ApiResponse(200, users, "All users retrieved successfully"));
  } catch (error) {
    console.error(error);
    throw new ApiError(500, "Internal server error");
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if the user with the given ID exists
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Delete the user
    await User.findByIdAndDelete(userId);

    // Respond with success message
    return res
      .status(200)
      .json(new ApiResponse(200, null, "User deleted successfully"));
  } catch (error) {
    console.error(error);

    if (error.kind === "ObjectId") {
      // Handle invalid ObjectId format
      throw new ApiError(400, "Invalid user ID");
    }

    // Handle other errors
    throw new ApiError(500, "Internal server error");
  }
});
const getCounts = (req, res) => {
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { addApiCount, updateApiCount },
        "API counts retrieved successfully"
      )
    );
};

module.exports = {
  userRegistration,
  updateProfile,
  getAllUsers,
  deleteUser,
  getCounts,
};
