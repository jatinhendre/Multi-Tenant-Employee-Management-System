"use client";

import { useState } from "react";
import { useSession } from "../../../../../components/provider/SessionProvider";

export default function EmployeesPage() {
  const { company } = useSession();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!company?.dbName) return;
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const res = await fetch("/api/employees/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        contactEmail: formData.get("contact_email"),
        position: formData.get("position"),
        companyDb: company.dbName,
      }),
    });

    if (res.ok) {
      setMessage("Success! New teammate has been onboarded and notified.");
      form.reset();
    }
    setLoading(false);
  }

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Team Directory
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Add and manage access for your company employees
        </p>
      </div>

      <div className="bg-card rounded-lg border border-border shadow-sm p-8">
        <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
          Add New Employee
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium leading-none">
              Full Name
            </label>
            <input
              name="name"
              placeholder="John Doe"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Assign a Login Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="john@company.com"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Contact Email
            </label>
            <input
              name="contact_email"
              type="email"
              placeholder="personal.email@gmail.com"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              required
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium leading-none">
              Job Position
            </label>
            <input
              name="position"
              placeholder="Software Engineer"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              required
            />
          </div>

          <button
            disabled={loading}
            className="md:col-span-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 mt-2"
          >
            {loading ? "Processing..." : "Grant Access & Send Credentials"}
          </button>
        </form>

        {message && (
          <div className="mt-6 p-4 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-100 font-medium text-sm flex items-center gap-2">
            <span className="text-lg">✅</span> {message}
          </div>
        )}
      </div>
    </div>
  );
}