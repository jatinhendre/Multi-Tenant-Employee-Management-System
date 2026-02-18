import mongoose, { Schema, Document, models } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  company: Schema.Types.ObjectId;
  role: "SUPERADMIN" | "COMPANY_ADMIN" | "EMPLOYEE";
  failedLoginAttempts: number;
  lockUntil: Date;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["SUPERADMIN", "COMPANY_ADMIN", "EMPLOYEE"],
    required: true,
  },
  company:{
    type: Schema.Types.ObjectId,
    ref: "Company"
  },
  failedLoginAttempts: {
  type: Number,
  default: 0,
},

lockUntil: {
  type: Date,
  default: null,
},
});

export const User =
  models.User || mongoose.model<IUser>("User", UserSchema);
