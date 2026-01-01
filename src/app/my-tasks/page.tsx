"use client";

import { useEffect, useState } from "react";

type Task = {
  _id: string;
  title: string;
  description: string;
  status: string;
  assignedTo: string;
};

export default function MyTasksPage() {
  const [email, setEmail] = useState("");
  const [companyDb, setCompanyDb] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  async function loadTasks(db: string, email: string) {
    const res = await fetch(`/api/tasks/list?db=${db}`);
    const data = await res.json();

    const myTasks = (data.tasks || []).filter(
      (t: Task) => t.assignedTo === email
    );
    console.log("inside loadtasks",myTasks)
    setTasks(myTasks);
  }

  async function updateStatus(id: string, status: string) {
    await fetch("/api/tasks/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status, companyDb }),
    });

    loadTasks(companyDb, email);
  }

  useEffect(() => {
    const stored = localStorage.getItem("user");

    if (!stored) {
      window.location.href = "/login";
      return;
    }

    const user = JSON.parse(stored);

    if (user.role !== "EMPLOYEE") {
      window.location.href = "/";
      return;
    }

    setEmail(user.email);
    setCompanyDb(user.company?.dbName || user.companyDb || "");

    // temporary fallback:
    const db = user.company?.dbName;

    if (db) loadTasks(db, user.email);
  }, []);

  if (!email) return null;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">My Tasks</h1>

      <div className="mt-4 space-y-3">
        {tasks.map((t) => (
          <div key={t._id} className="border rounded p-3 bg-white shadow">
            <p className="font-semibold">{t.title}</p>
            <p className="text-gray-600 text-sm">{t.description}</p>
            <p>Status: {t.status}</p>

            <div className="mt-2 flex gap-2">
              <button
                onClick={() => updateStatus(t._id, "IN_PROGRESS")}
                className="px-3 py-1 bg-blue-500 text-white rounded"
              >
                In Progress
              </button>

              <button
                onClick={() => updateStatus(t._id, "COMPLETED")}
                className="px-3 py-1 bg-green-600 text-white rounded"
              >
                Completed
              </button>
            </div>
          </div>
        ))}

        {tasks.length === 0 && (
          <p className="text-gray-500">No tasks assigned.</p>
        )}
      </div>
    </main>
  );
}
