"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "../../../../../components/provider/SessionProvider";

interface TaskPayload {
  _id: string;
  title: string;
  description: string;
  assignedTo: string;
  status: string;
  dueDate: string;
}

interface Employee {
  _id: string;
  name: string;
  email: string;
  position: string;
  status: string;
}

export default function TasksPage() {
  const { company } = useSession();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [tasks, setTasks] = useState<TaskPayload[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const loadEmployees = useCallback(async (db: string) => {
    try {
      const res = await fetch(`/api/employees/list?db=${db}`);
      const data = await res.json();
      setEmployees(data.employees || []);
    } catch (e) {
      console.error("Err loading employees", e);
    }
  }, []);

  const loadTasks = useCallback(async (db: string) => {
    try {
      const res = await fetch(`/api/tasks/list?db=${db}`);
      const data = await res.json();
      setTasks(data.tasks || []);
    } catch (e) {
      console.error("Err loading tasks", e);
    }
  }, []);

  useEffect(() => {
    if (company?.dbName) {
      loadEmployees(company.dbName);
      loadTasks(company.dbName);
    }
  }, [company, loadEmployees, loadTasks]);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    if (!company?.dbName) return;
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const res = await fetch("/api/tasks/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formData.get("title"),
        description: formData.get("description"),
        assignedTo: formData.get("assignedTo"),
        dueDate: formData.get("dueDate"),
        companyDb: company.dbName,
      }),
    });

    if (res.ok) {
      setMessage("Task successfully assigned!");
      loadTasks(company.dbName);
      form.reset();
    } else {
      setMessage("Failed to assign task");
    }
    setLoading(false);
  }
  if (!company)
    return (
      <div className="p-8 text-muted-foreground animate-pulse">
        Loading workspace...
      </div>
    );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Assign New Task
          </h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <input
                name="title"
                placeholder="Task Title"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
            </div>
            <div className="space-y-2">
              <textarea
                name="description"
                placeholder="Short description..."
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-y"
              />
            </div>

            <div className="space-y-2">
              <select
                name="assignedTo"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="">Choose Employee</option>
                {employees.map((e) => (
                  <option key={e._id} value={e.email}>
                    {e.name} ({e.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <input
                type="date"
                name="dueDate"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <button
              disabled={loading}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 w-full"
            >
              {loading ? "Creating..." : "Assign Task"}
            </button>
          </form>
          {message && (
            <p className="mt-4 text-emerald-600 font-medium text-sm text-center">
              {message}
            </p>
          )}
        </div>
      </div>

      <div className="lg:col-span-7 space-y-6">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Task Overview
        </h2>
        <div className="grid gap-3">
          {tasks.map((t) => (
            <div
              key={t._id}
              className="bg-card p-4 rounded-lg border border-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <h3 className="font-semibold text-foreground">{t.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {t.description}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-xs text-muted-foreground">
                    Assigned To:
                  </span>
                  <span className="text-xs bg-muted px-2 py-0.5 rounded font-medium text-foreground">
                    {t.assignedTo}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-start md:items-end gap-2">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${t.status === "COMPLETED"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : t.status === "IN_PROGRESS"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        : "bg-muted text-muted-foreground"
                    }`}
                >
                  {t.status}
                </span>
                <p className="text-xs text-muted-foreground font-medium">
                  {t.dueDate
                    ? new Date(t.dueDate).toLocaleDateString()
                    : "No deadline"}
                </p>
              </div>
            </div>
          ))}
          {tasks.length === 0 && (
            <p className="text-center py-12 text-muted-foreground font-medium border border-dashed border-border rounded-lg">
              No active tasks in {company.name} database.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}