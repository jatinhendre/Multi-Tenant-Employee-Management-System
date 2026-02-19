import mongoose, { Schema, models, model } from "mongoose";

const LoginHistorySchema = new Schema(
  {
    userId: String,
    email: String,
    ipAddress: String,
    userAgent: String,
  },
  { timestamps: true }
);

export const LoginHistory =
  models.LoginHistory || model("LoginHistory", LoginHistorySchema);