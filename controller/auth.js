import JWT from "jsonwebtoken";
import UserModel from "../model/auth.js";

export const newUser = async (req, res) => {
  try {
    const { name, email, phone, password, post } = req.body;
    if (!name) {
      return res.send({
        success: false,
        message: "name is require",
      });
    }
    if (!email) {
      return res.send({
        success: false,
        message: "email is require",
      });
    }
    if (!phone) {
      return res.send({
        success: false,
        message: "phone is require",
      });
    }
    if (!password) {
      return res.send({
        success: false,
        message: "password is require",
      });
    }
    if (!post) {
      return res.send({
        success: false,
        message: "post is require",
      });
    }
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.send({
        success: false,
        message: "user already exist try with another email",
      });
    }
    const user = await new UserModel({ ...req.body }).save();
    res.status(200).send({
      success: true,
      message: "welcome Admin",
      user,
    });
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: "something went wrong",
      error,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.send({
        success: false,
        message: "check your login details",
      });
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.send({
        success: false,
        message: "user not exist",
      });
    }
    const checkpassword = await UserModel.findOne({ password });
    if (!checkpassword) {
      return res.send({
        success: false,
        message: "invalid password",
      });
    }
    if (user.role !== "active") {
      return res.status(403).send({
        success: false,
        message: "You are no longer an admin",
      });
    }
    const token = await JWT.sign({ _id: user._id }, "tarunchauhan123", {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        post: user.post,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: "something went wrong",
      error,
    });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find({});
    res.status(200).send({
      success: true,
      message: "Product deleted successfully",
      users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "failed to get all users",
      error: error.message,
    });
  }
};
export const getSingleUser = async (req, res) => {
  try {
    const { _id } = req.params; // Extract _id correctly
    const user = await UserModel.findById(_id); // Use findById to find a single user

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Single user",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        post: user.post,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Failed to get the user",
      error: error.message,
    });
  }
};
export const updateProfile = async (req, res) => {
  try {
    const { _id } = req.params;
    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await UserModel.findById(_id);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    user.name = name;

    user.phone = phone;

    await user.save();

    res.status(200).send({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await UserModel.findByIdAndDelete(req.params._id);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "User deleted successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send({
      success: false,
      message: "Failed to delete user",
      error: error.message,
    });
  }
};
