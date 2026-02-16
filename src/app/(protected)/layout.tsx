
import { redirect } from "next/navigation";
import { getSessionData } from "../../../lib/session";
import SessionProvider from "../../../components/provider/SessionProvider";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, company } = await getSessionData();
  if (!user) {
    redirect("/login"); 
  }

  return (
    <SessionProvider user={user} company={company}>
      {children}
    </SessionProvider>
  );
}