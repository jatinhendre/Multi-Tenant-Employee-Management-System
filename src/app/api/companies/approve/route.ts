import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";
import { PendingCompany } from "../../../../../models/PendingCompany";
import { Company } from "../../../../../models/Company";
import { connectTenantDB } from "../../../../../lib/tenantDB";
import { User } from "../../../../../models/User";

import { sendApprovalEmail } from "../../../../../lib/email";
import { getEmployeeModel } from "../../../../../models/tenant/Employee";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  await connectDB();

  const form = await req.formData();
  const id = form.get("id")?.toString();

  if (!id) {
    return NextResponse.json({ message: "Missing id" }, { status: 400 });
  }

  const pending = await PendingCompany.findById(id);

  if (!pending) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
  
  const raw = pending.companyName
  .toLowerCase()
  .replace(/\s+/g, "_")
  .replace(/[^a-z0-9_]/g, "")
  .replace(/^_+|_+$/g, "");

const safe = raw.slice(0, 24);   // <= 24 chars

const dbName = `company_${safe}_${pending._id.toString().slice(-5)}`;

  let company = await Company.findOne({ dbName });

if (!company) {
  company = await Company.create({
    name: pending.companyName,
    dbName,
    adminEmail: pending.adminEmail,
  });
}

  const tenantDB = await connectTenantDB(dbName);
const Employee = getEmployeeModel(tenantDB);

  let admin = await User.findOne({ email: pending.adminEmail });
if (!admin) {
  admin = await User.create({
    email: pending.adminEmail,
    password: pending.adminPassword,
    role: "COMPANY_ADMIN",
    company: company._id,
  });
}


  pending.status = "APPROVED";
  await pending.save();
  await sendApprovalEmail(
  pending.contactEmail,
  pending.companyName
);


  return NextResponse.json({success:true})
}
