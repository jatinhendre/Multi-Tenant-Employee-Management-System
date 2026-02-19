import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";
import { User } from "../../../../../models/User";
import { Company } from "../../../../../models/Company";
import { connectTenantDB } from "../../../../../lib/tenantDB";
import { getEmployeeModel } from "../../../../../models/tenant/Employee";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../../../../../lib/token";
import { logAudit } from "../../../../../lib/AuditLogger";
import { LoginHistory } from "../../../../../models/LoginHistory";
import { checkRateLimit } from "../../../../../lib/rateLimiter";

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

  const forwardedFor = req.headers.get("x-forwarded-for");
  const ipAddress =
  forwardedFor?.split(",")[0].trim() ||
  req.headers.get("x-real-ip") ||
  "unknown";
  const rateLimit = await checkRateLimit(ipAddress, 10, 60 * 1000);

  const { email, password, companyId } = await req.json();
  const systemUser = await User.findOne({ email });
  const now = new Date();
  
if (!rateLimit.allowed) {
  await logAudit({
    action: "RATE_LIMIT_EXCEEDED",
    ipAddress,
    systemUser,
  });

  return NextResponse.json(
    {
      message: "Too many login attempts. Please try again later.",
    },
    { status: 429 }
  );
}
  if (  systemUser.lockUntil && systemUser.lockUntil > now) {
    return NextResponse.json(
      { message: "Account locked. Try again later." },
      { status: 403 }
    );
  }
  if (systemUser) {
    const isMatch = await bcrypt.compare(password, systemUser.password);
    if (!isMatch) {
      systemUser.failedLoginAttempts += 1;

      await logAudit({
        email: systemUser.email,
        role: systemUser.role,
        action: "FAILED_LOGIN_ATTEMPT",
         ipAddress:req.headers.get("x-forwarded-for") || "unknown",
          userAgent: req.headers.get("user-agent") || "unknown",
      });

      if (systemUser.failedLoginAttempts >= 5) {
        systemUser.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        await logAudit({
          email: systemUser.email,
          role: systemUser.role,
          action: "ACCOUNT_LOCKED",
          ipAddress:req.headers.get("x-forwarded-for") || "unknown",
          userAgent: req.headers.get("user-agent") || "unknown",
        });
      }

      await systemUser.save();

      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }
    systemUser.failedLoginAttempts = 0;
systemUser.lockUntil = null;

await systemUser.save();
    let companyMetadata: ICompanyAuth | null = null;
    if (systemUser.role === "COMPANY_ADMIN") {
      companyMetadata = (await Company.findById(systemUser.company).lean()) as ICompanyAuth | null;
    }
    await logAudit({
      userId: systemUser._id.toString(),
      email: systemUser.email,
      role: systemUser.role,
      action: "USER_LOGIN",
      ipAddress: req.headers.get("x-forwarded-for") || "unknown",
      userAgent: req.headers.get("user-agent") || "unknown",
    });
    return createAuthResponse(systemUser, companyMetadata);
  }

  if (!companyId) {
    return NextResponse.json({ message: "Company ID required for employee login" }, { status: 400 });
  }
  const targetCompany = (await Company.findById(companyId).lean()) as ICompanyAuth | null;

  if (!targetCompany) {
    return NextResponse.json({ message: "Organization not found" }, { status: 404 });
  }
  const tenantConn = await connectTenantDB(targetCompany.dbName);
  const Employee = getEmployeeModel(tenantConn);
  const employee = await Employee.findOne({ email });

  if (!employee) {
    return NextResponse.json({ message: "Employee not found in this organization" }, { status: 404 });
  }

  const isEmployeeMatch = await bcrypt.compare(password, employee.password);

  if (!isEmployeeMatch) {
  employee.failedLoginAttempts += 1;

  await logAudit({
    email: employee.email,
    role: employee.role,
    action: "FAILED_LOGIN_ATTEMPT",
    ipAddress: req.headers.get("x-forwarded-for") || "unknown",
      userAgent: req.headers.get("user-agent") || "unknown",
  });

  // Lock account after 5 attempts
  if (employee.failedLoginAttempts >= 5) {
    employee.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await logAudit({
      email: employee.email,
      role: employee.role,
      action: "ACCOUNT_LOCKED",
      ipAddress: req.headers.get("x-forwarded-for") || "unknown",
      userAgent: req.headers.get("user-agent") || "unknown",
    });
  }

  await employee.save();

  return NextResponse.json(
    { message: "Invalid credentials" },
    { status: 401 }
  );
}
  await logAudit({
    userId: employee._id.toString(),
    email: employee.email,
    role: employee.role,
    action: "USER_LOGIN",
    ipAddress: req.headers.get("x-forwarded-for") || "unknown",
    userAgent: req.headers.get("user-agent") || "unknown",
  });
  employee.failedLoginAttempts = 0;
employee.lockUntil = null;

await employee.save();
const existingLogin = await LoginHistory.findOne({
  userId: employee._id.toString(),
  ipAddress: req.headers.get("x-forwarded-for") || "unknown",
});

if (!existingLogin) {
  await logAudit({
    userId: employee._id.toString(),
    email: employee.email,
    role: employee.role,
    action: "SUSPICIOUS_LOGIN",
    ipAddress: req.headers.get("x-forwarded-for") || "unknown",
    userAgent: req.headers.get("user-agent") || "unknown",
  });
    await LoginHistory.create({
  userId: employee._id.toString(),
  email: employee.email,
  ipAddress: req.headers.get("x-forwarded-for") || "unknown",
  userAgent: req.headers.get("user-agent") || "unknown",
});
}

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