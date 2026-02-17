"use client";

import { useState } from "react";
import BrandLogo from "../../../../components/logo";

export default function LoginPage() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;
    const companyId =
      (form.elements.namedItem("companyId") as HTMLInputElement).value ||
      undefined;
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, companyId }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message);
        setLoading(false);
        return;
      }

      if (data.role === "SUPERADMIN") window.location.href = "/superadmin";
      else if (data.role === "COMPANY_ADMIN") window.location.href = "/dashboard";
      else if (data.role === "EMPLOYEE") window.location.href = "/my-tasks";
    } catch (err) {
      setMessage("Connection error. Try again.");
      setLoading(false);
    }
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-muted/40 p-4">
      <div className="w-full max-w-[400px] space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-6">
            <BrandLogo size={48} className="rounded-xl" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to access the workspace
          </p>
        </div>

        <div className="bg-card p-8 rounded-lg border border-border shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Email
              </label>
              <input
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="pt-2">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Employee Access
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <label className="text-sm font-medium leading-none text-muted-foreground">
                  Organization ID (Optional)
                </label>
                <input
                  name="companyId"
                  type="text"
                  placeholder="e.g. 6582c94..."
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                />
              </div>
            </div>

            <button
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 w-full mt-4"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {message && (
            <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-md text-red-600 text-sm font-medium text-center">
              {message}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}