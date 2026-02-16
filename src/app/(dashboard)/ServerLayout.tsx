import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import DashboardLayout from "./layout";
import { Company } from "../../../models/Company";

interface JWTPayload {
  userId: string;
  email: string;
  role: "SUPERADMIN" | "COMPANY_ADMIN" | "EMPLOYEE";
  company?: string;
}
interface CompanyPayload{
  name: string;
  dbName: string;
  adminEmail: string;
  adminPassword:string;
  status:"ACTIVE" | "DISABLED"
}

export default async function ServerLayout({children}:{children:React.ReactNode}){
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    let company: CompanyPayload | null = null;
    if (!token) redirect("/login");
    let user:JWTPayload
      try {
    user = jwt.verify(token, process.env.JWT_SECRET as string) as JWTPayload;
    if(user.company){
       const dbCompany = await Company.findById({_id:user.company});
       if(dbCompany){
        company={
             name: dbCompany.name,
                dbName: dbCompany.dbName,
                adminEmail: dbCompany.adminEmail,
                adminPassword:dbCompany.adminPassword,
                status:dbCompany.status
        }
       }
       console.log("from serverlayout->",user,company);
    }
  } catch {
    return redirect("/login");
  }
  return (
    <DashboardLayout user={user} company={company}>
      {children}
    </DashboardLayout>
  );
}