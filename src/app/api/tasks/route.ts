import { NextResponse } from "next/server";
import { getTaskModel } from "../../../../models/tenant/task";
import { connectTenantDB } from "../../../../lib/tenantDB";
export async function POST(req: Request) {
  try {
    const { id, status, companyDb } = await req.json();

    if (!id || !status || !companyDb) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const conn = await connectTenantDB(companyDb);
    const Task = getTaskModel(conn);

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { status: status },
      { new: true } 
    );

    if (!updatedTask) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Status updated", task: updatedTask });
  } catch (error) {
    console.error("Update status error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}