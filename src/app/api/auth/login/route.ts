import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";
import { User } from "../../../../../models/User";
import { Company } from "../../../../../models/Company";
import { connectTenantDB } from "../../../../../lib/tenantDB";
import { getEmployeeModel } from "../../../../../models/tenant/Employee";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../../../../../lib/token";

interface ICompanyAuth {
  _id: unknown;
  name: string;
  dbName: string;
}

interface IUserAuth {
  email: string;
  role: string;
}

export async function POST(req: Request) {
  await connectDB();
  
  const { email, password, companyId } = await req.json();
  console.log(email)
  console.log(companyId)
  console.log(password)
  const systemUser = await User.findOne({ email });

  if (systemUser) {
    const isMatch = await bcrypt.compare(password, systemUser.password);
    if (!isMatch) return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });

    let companyMetadata: ICompanyAuth | null = null;
    if (systemUser.role === "COMPANY_ADMIN") {
      companyMetadata = (await Company.findById(systemUser.company).lean()) as ICompanyAuth | null;
    }

    return createAuthResponse(systemUser, companyMetadata);
  }

  if (!companyId) {
    return NextResponse.json({ message: "Company ID required for employee login" }, { status: 400 });
  }
  console.log("going to find company")
  const targetCompany = (await Company.findById(companyId).lean()) as ICompanyAuth | null;
  console.log("reutrnd company")

  if (!targetCompany) {
    return NextResponse.json({ message: "Organization not found" }, { status: 404 });
  }
  console.log("going to search for conect tenantdb")
  const tenantConn = await connectTenantDB(targetCompany.dbName);
  console.log("returned from conect tenantdb")
  const Employee = getEmployeeModel(tenantConn);
  console.log("going to find employee")
  const employee = await Employee.findOne({ email });
  console.log("returned from employee")

  if (!employee) {
    return NextResponse.json({ message: "Employee not found in this organization" }, { status: 404 });
  }

  const isEmployeeMatch = await bcrypt.compare(password, employee.password);
  if (!isEmployeeMatch) return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });

  return createAuthResponse(employee, targetCompany);
}

function createAuthResponse(userData: IUserAuth, company: ICompanyAuth | null) {
  const accesstoken = generateAccessToken({
    email: userData.email,
    role: userData.role || "EMPLOYEE",
    dbName: company?.dbName || "" 
  });
  const refreshtoken = generateRefreshToken({
    email: userData.email,
    role: userData.role || "EMPLOYEE",
    dbName: company?.dbName || "" 
  });

  const res = NextResponse.json({
    message: "Login success",
    role: userData.role || "EMPLOYEE",
    company: company 
  });
  console.log(res);
  res.cookies.set("accessToken", accesstoken, { 
    httpOnly: false, 
    path: "/",
    sameSite: "lax"
  }); 
  res.cookies.set("refreshToken", refreshtoken, {
    httpOnly: true, 
    path: "/",
    sameSite: "lax"
  }); 
  
  return res;
}