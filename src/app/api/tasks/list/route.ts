import { NextResponse } from "next/server";
import { connectTenantDB } from "../../../../../lib/tenantDB";
import { getTaskModel } from "../../../../../models/tenant/task";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const db = searchParams.get("db");

  if (!db) return NextResponse.json({ tasks: [] });

  const conn = await connectTenantDB(db);
  const Task = getTaskModel(conn);

  const tasks = await Task.find().lean();

  return NextResponse.json({ tasks });
}
