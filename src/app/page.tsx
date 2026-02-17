import Link from "next/link";
import BrandLogo from "../../components/logo";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BrandLogo size={32} />
            <span className="font-bold text-lg tracking-tight">SynTask</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors shadow-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="flex-1 flex flex-col items-center justify-center py-20 px-6 text-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-muted/50 via-background to-background">
          <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="inline-flex items-center rounded-full border border-border bg-card/50 px-3 py-1 text-sm font-medium text-muted-foreground backdrop-blur-sm">
              Multi-tenant Enterprise Platform
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-foreground bg-clip-text">
              The OS for <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground to-muted-foreground">
                Modern Enterprise
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Orchestrate your workforce with high-performance multi-tenant
              architecture. Secure, scalable, and designed for speed.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/register"
                className="h-12 px-8 inline-flex items-center justify-center bg-primary text-primary-foreground text-base font-medium rounded-md hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
              >
                Start Free Trial
              </Link>
              <Link
                href="/login"
                className="h-12 px-8 inline-flex items-center justify-center bg-card text-foreground border border-border text-base font-medium rounded-md hover:bg-muted/50 transition-all"
              >
                Live Demo
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-10 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BrandLogo size={24} />
            <span className="text-sm font-semibold text-foreground">
              SynTask
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 SynTask Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
