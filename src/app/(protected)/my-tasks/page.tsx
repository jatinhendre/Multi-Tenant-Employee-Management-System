"use client";

import { useSession } from "../../../../components/provider/SessionProvider";
import { useEffect, useState, useCallback } from "react";

interface TaskPayload {
  _id: string;
  title: string;
  description: string;
  assignedTo: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  dueDate: string;
}

export default function MyTasksPage() {
  const { user, company } = useSession();
  const [tasks, setTasks] = useState<TaskPayload[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMyTasks = useCallback(async () => {
    if (!company?.dbName || !user?.email) return;

    try {
      const res = await fetch(`/api/tasks/list?db=${company.dbName}`);
      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      const filtered = (data.tasks || []).filter(
        (t: TaskPayload) => t.assignedTo === user.email
      );
      setTasks(filtered);
    } catch (error) {
      console.error("Sync Error:", error);
    } finally {
      setLoading(false);
    }
  }, [company?.dbName, user?.email]);

  useEffect(() => {
    if (company && user) {
      loadMyTasks();
    }
  }, [company, user, loadMyTasks]);

  async function updateStatus(id: string, newStatus: TaskPayload["status"]) {
    setTasks((prev) =>
      prev.map((t) => (t._id === id ? { ...t, status: newStatus } : t))
    );

    try {
      await fetch("/api/tasks/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          status: newStatus,
          companyDb: company?.dbName,
        }),
      });
    } catch (error) {
      loadMyTasks();
    }
  }

  if (!user || !company) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground font-medium animate-pulse">
            Initializing workspace...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 animate-in fade-in duration-500">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            My <span className="text-primary">Tasks</span>
          </h1>
          <p className="text-muted-foreground mt-2 text-base">
            Manage your individual contributions and deadlines
          </p>
        </div>
        <div className="flex items-center gap-3 bg-card px-4 py-2 rounded-lg shadow-sm border border-border">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Active Focus
          </span>
          <span className="text-xl font-bold text-primary tabular-nums">
            {tasks.filter((t) => t.status !== "COMPLETED").length}
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {tasks.map((t) => (
          <div
            key={t._id}
            className="group bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${t.status === "COMPLETED"
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30"
                        : t.status === "IN_PROGRESS"
                          ? "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30"
                          : "bg-muted text-muted-foreground border-border"
                      }`}
                  >
                    {t.status.replace("_", " ")}
                  </span>
                  {t.dueDate && (
                    <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
                      Due: {new Date(t.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                  {t.title}
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">
                  {t.description}
                </p>
              </div>

              <div className="flex flex-row lg:flex-col gap-2 min-w-[140px]">
                {t.status === "PENDING" && (
                  <button
                    onClick={() => updateStatus(t._id, "IN_PROGRESS")}
                    className="flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
                  >
                    Start Execution
                  </button>
                )}
                {t.status === "IN_PROGRESS" && (
                  <button
                    onClick={() => updateStatus(t._id, "COMPLETED")}
                    className="flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-emerald-600 text-white shadow hover:bg-emerald-700 h-9 px-4 py-2"
                  >
                    Complete Task
                  </button>
                )}
                {t.status === "COMPLETED" && (
                  <div className="flex-1 inline-flex items-center justify-center gap-2 py-2 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 rounded-md border border-emerald-100 dark:border-emerald-900/30 font-semibold text-xs uppercase tracking-wider h-9 px-4">
                    Verified Done
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {!loading && tasks.length === 0 && (
          <div className="text-center py-20 bg-muted/30 rounded-xl border border-dashed border-border">
            <div className="text-4xl mb-3 opacity-50">✨</div>
            <h3 className="text-lg font-semibold text-foreground">
              Operational Excellence
            </h3>
            <p className="text-muted-foreground text-sm mt-1">
              Your queue is currently empty. Enjoy the productivity!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}