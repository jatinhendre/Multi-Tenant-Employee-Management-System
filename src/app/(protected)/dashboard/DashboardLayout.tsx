"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "../../../../components/provider/SessionProvider";
import BrandLogo from "../../../../components/logo";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useSession();
  const pathname = usePathname();

  const handleLogout = () => {
    document.cookie =
      "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const navItems = [
    { label: "Overview", href: "/dashboard", icon: "📊" },
    {
      label: "Employees",
      href: "/dashboard/employees",
      icon: "👥",
      adminOnly: true,
    },
    { label: "Team Tasks", href: "/dashboard/tasks", icon: "task" },
    {
      label: "Professional Network",
      href: "https://networx-a-social-media-networking-p.vercel.app",
      icon: "globe",
    },
  ];

  return (
    <section className="min-h-screen flex bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-border flex items-center gap-3">
          <BrandLogo size={32} />
          <h2 className="font-bold text-lg tracking-tight">SynTask</h2>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            if (item.adminOnly && user?.role !== "COMPANY_ADMIN") return null;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {/* Simple Icon Replacement or custom SVG could go here if needed, for now using emoji/text as placeholder but styled better */}
                <span className="text-lg leading-none opactiy-80">
                  {item.icon === "task" ? "✓" : item.icon === "globe" ? "🌐" : item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 px-2 py-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                    {user?.email?.[0].toUpperCase()}
                </div>
                <div className="overflow-hidden">
                    <p className="text-sm font-medium truncate">{user?.email}</p>
                    <p className="text-xs text-muted-foreground truncate capitalize">{user?.role.toLowerCase().replace("_", " ")}</p>
                </div>
            </div>
          <button
            onClick={handleLogout}
            className="w-full text-left px-2 py-2 text-sm text-muted-foreground hover:text-destructive transition-colors font-medium hover:bg-destructive/10 rounded-md"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="bg-background/80 backdrop-blur-md border-b border-border px-8 py-4 sticky top-0 z-10 flex items-center justify-between">
          <div>
             <h2 className="font-semibold text-lg tracking-tight">
            {navItems.find((i) => i.href === pathname)?.label || "Dashboard"}
          </h2>
          <p className="text-xs text-muted-foreground">Managed Workspace</p>
          </div>
         
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-medium">
                ?
            </div>
          </div>
        </header>

        <main className="p-8 max-w-6xl mx-auto w-full">{children}</main>
      </div>
    </section>
  );
}