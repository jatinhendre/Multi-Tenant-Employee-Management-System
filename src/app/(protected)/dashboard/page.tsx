"use client";

import { useEffect, useState } from "react";
import { useSession } from "../../../../components/provider/SessionProvider";

interface RealStats {
  activeEmployees: number;
  tasksPending: number;
  projectsDone: number;
}

export default function DashboardHome() {
  const { user, company } = useSession();
  const [realStats, setRealStats] = useState<RealStats | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      if (!company?.dbName) return;
      try {
        const res = await fetch(`/api/dashboardStats?db=${company.dbName}`);
        const data = await res.json();
        setRealStats(data);
      } catch (err) {
        console.error("Failed to load stats", err);
      } finally {
        setFetching(false);
      }
    }
    fetchStats();
  }, [company?.dbName]);

  if (!user || fetching)
    return (
      <div className="flex items-center justify-center h-full py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );

  const stats = [
    {
      label: "Active Team",
      value: realStats?.activeEmployees || 0,
      desc: "Currently clocked in",
    },
    {
      label: "Pending Tasks",
      value: realStats?.tasksPending || 0,
      desc: "Requires attention",
    },
    {
      label: "Completed Projects",
      value: realStats?.projectsDone || 0,
      desc: "This month",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Overview
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time metrics for{" "}
            <span className="font-medium text-foreground">
              @{company?.name}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
            Live System
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-card p-6 rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow"
          >
            <p className="text-sm font-medium text-muted-foreground mb-2">
              {stat.label}
            </p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-foreground tabular-nums tracking-tight">
                {stat.value}
              </p>
              <span className="text-xs text-muted-foreground">{stat.desc}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-lg border border-border shadow-sm p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-9xl font-black pointer-events-none select-none">
          {company?.name?.slice(0, 2).toUpperCase()}
        </div>

        <h3 className="text-base font-semibold text-foreground mb-6 flex items-center gap-2">
          Workspace Intelligence
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 relative z-10">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                Entity Name
              </p>
              <p className="text-lg font-medium text-foreground">
                {company?.name || "Initializing..."}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                Tenant ID
              </p>
              <p className="text-xs font-mono bg-muted px-2 py-1 rounded inline-block text-muted-foreground">
                {company?.dbName}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                Security Level
              </p>
              <p className="text-lg font-medium text-foreground capitalize">
                {user.role.toLowerCase().replace("_", " ")}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                Environment
              </p>
              <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                Production
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}