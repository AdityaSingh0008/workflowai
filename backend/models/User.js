import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["employee", "manager"],
      default: "employee",
    },
    department: {
      type: String,
      enum: ["general", "hr", "it", "finance"],
      default: "general",
    },
    leaveBalance: { type: Number, default: 18 },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
