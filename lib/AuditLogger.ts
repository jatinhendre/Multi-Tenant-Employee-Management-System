import { AuditLog } from "../models/Audit";

interface LogParams {
  userId?: string;
  email?: string;
  role?: string;
  action: string;
  ipAddress?: string;
  userAgent?: string;
}

export async function logAudit(params: LogParams) {
  try {
    await AuditLog.create({
      userId: params.userId,
      email: params.email,
      role: params.role,
      action: params.action,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
    });
  } catch (error) {
    console.error("Audit log failed:", error);
  }
}
