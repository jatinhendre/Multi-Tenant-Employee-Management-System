import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";
import { AuditLog } from "../../../../../models/Audit";
export async function GET() {
  await connectDB();

  const logs = await AuditLog.find()
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  return NextResponse.json(logs);
}