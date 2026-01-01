import { NextResponse } from "next/server";
import { connectTenantDB } from "../../../../../lib/tenantDB";
import { getTaskModel } from "../../../../../models/tenant/task";

export async function POST(req: Request) {
  const { id, status, companyDb } = await req.json();

  if (!id || !status || !companyDb) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  const conn = await connectTenantDB(companyDb);
  const Task = getTaskModel(conn);

  await Task.findByIdAndUpdate(id, { status });

  return NextResponse.json({ message: "Status updated" });
}
