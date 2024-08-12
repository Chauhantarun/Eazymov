import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
    post: {
      type: String,
    },
    role: {
      type: String,
      enum: ["active", "disabled", "admin"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", schema);
