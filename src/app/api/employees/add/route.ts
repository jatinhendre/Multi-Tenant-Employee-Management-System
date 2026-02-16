import { NextRequest, NextResponse } from "next/server";
import { sendWelcomeEmail } from "../../../../../lib/email";
import bcrypt from "bcryptjs";
import { getEmployeeModel } from "../../../../../models/tenant/Employee";
import { connectTenantDB } from "../../../../../lib/tenantDB";
import { connectDB } from "../../../../../lib/db";
import { Company } from "../../../../../models/Company";

export async function POST(req: Request) {
  await connectDB();
  const { email, companyDb, name, position, contactEmail } = await req.json();

  if (!contactEmail) {
    return NextResponse.json({ message: "Recipient contact email is missing" }, { status: 400 });
  }

  const company = await Company.findOne({ dbName: companyDb });
  if (!company) return NextResponse.json({ message: "Company not found" }, { status: 404 });

  const tenantConn = await connectTenantDB(companyDb);
  const Employee = getEmployeeModel(tenantConn);

  const hashed = await bcrypt.hash("employee123", 10);

  try {
    await Employee.create({
      name,
      email,
      password: hashed,
      position,
    });

    await sendWelcomeEmail(
      contactEmail,      
      name,               
      email,             
      company.name,       
      company._id.toString() 
    );

    return NextResponse.json({ message: "Employee onboarded successfully" }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Failed to create employee" }, { status: 500 });
  }
}