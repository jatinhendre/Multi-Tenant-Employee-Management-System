import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IAuditLog extends Document {
  userId?: string;
  email?: string;
  role?: string;
  action: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    userId: { type: String },
    email: { type: String },
    role: { type: String },
    action: { type: String, required: true },
    ipAddress: { type: String },
    userAgent: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const AuditLog =
  models.AuditLog || model<IAuditLog>("AuditLog", AuditLogSchema);
