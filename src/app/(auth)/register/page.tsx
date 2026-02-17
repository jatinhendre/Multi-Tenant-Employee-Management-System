"use client";

import { useState } from "react";
import BrandLogo from "../../../../components/logo";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const form = e.currentTarget;
    const formData = new FormData(form);

    const res = await fetch("/api/companies/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyName: formData.get("companyName"),
        companySize: Number(formData.get("companySize")),
        adminEmail: formData.get("adminEmail"),
        adminPassword: formData.get("adminPassword"),
        contactEmail: formData.get("contactEmail"),
        requirements: [formData.get("requirement")],
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage(
        "Application Successful! Our team will review and approve your company shortly."
      );
      form.reset();
    } else {
      setMessage(data.message || "Registration failed");
    }
    setLoading(false);
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-muted/40 p-4 py-8">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-6">
            <BrandLogo size={48} className="rounded-xl" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Deploy New Instance
          </h1>
          <p className="text-sm text-muted-foreground">
            Initialize your company's private infrastructure
          </p>
        </div>

        <div className="bg-card p-8 rounded-lg border border-border shadow-sm">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium leading-none">
                Company Name
              </label>
              <input
                name="companyName"
                required
                placeholder="Acme Inc."
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Company Size
              </label>
              <input
                name="companySize"
                type="number"
                required
                placeholder="10"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Industry Need
              </label>
              <select
                name="requirement"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="TASK_ASSIGNMENT">Basic Package</option>
              </select>
            </div>

            <div className="md:col-span-2 pt-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Admin Credentials
              </h3>
              <div className="h-px bg-border w-full mb-4"></div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Admin Email
              </label>
              <input
                name="adminEmail"
                type="email"
                required
                placeholder="admin@acme.com"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Admin Password
              </label>
              <input
                name="adminPassword"
                type="password"
                required
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium leading-none">
                Contact Email
              </label>
              <input
                name="contactEmail"
                type="email"
                required
                placeholder="support@acme.com"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <button
              disabled={loading}
              className="md:col-span-2 mt-4 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
            >
              {loading ? "Processing..." : "Submit Registration Request"}
            </button>
          </form>

          {message && (
            <div
              className={`mt-6 p-4 rounded-md text-center text-sm font-medium border ${message.includes("Successful")
                  ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                  : "bg-red-50 text-red-700 border-red-100"
                }`}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}