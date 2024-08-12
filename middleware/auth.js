import JWT from "jsonwebtoken";
import UserModel from "../model/auth.js";

const SECRET_KEY = "tarunchauhan123";

export const requireSignIn = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      console.log("Authorization header is missing");
      return res.status(401).json({ error: "Authorization header is missing" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      console.log("Token is missing");
      return res.status(401).json({ error: "Token is missing" });
    }

    const decode = JWT.verify(token, SECRET_KEY);
    req.user = decode;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user._id);
    if (user.role !== "active") {
      console.log("Unauthorized access: user role is not active");
      return res.status(403).json({ error: "Unauthorized access" });
    }
    next();
  } catch (error) {
    console.error("Error in isAdmin middleware:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const isAdmin2 = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user._id);
    if (user.post !== "superadmin") {
      console.log("Unauthorized access: user is not a superadmin");
      return res.status(403).json({ error: "Unauthorized access" });
    }
    next();
  } catch (error) {
    console.error("Error in isAdmin2 middleware:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
