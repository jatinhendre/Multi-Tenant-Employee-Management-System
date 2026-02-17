export default function SettingsPage() {
  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Profile Section */}
        <div className="bg-card rounded-lg border border-border shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Profile</h2>
              <p className="text-sm text-muted-foreground">
                Update your personal information.
              </p>
            </div>
            <button className="px-4 py-2 bg-secondary text-secondary-foreground text-sm font-medium rounded-md hover:bg-secondary/80 transition-colors">
              Edit
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Full Name</label>
              <input
                disabled
                className="flex h-9 w-full rounded-md border border-input bg-muted px-3 py-1 text-sm shadow-sm"
                value="Hendrik Jatin"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Email Address</label>
              <input
                disabled
                className="flex h-9 w-full rounded-md border border-input bg-muted px-3 py-1 text-sm shadow-sm"
                value="hendrik@example.com"
              />
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-card rounded-lg border border-border shadow-sm p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Notifications
            </h2>
            <p className="text-sm text-muted-foreground">
              Configure how you receive alerts.
            </p>
          </div>
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Email Alerts</label>
                <p className="text-xs text-muted-foreground">
                  Receive daily summaries of task activity.
                </p>
              </div>
              <div className="h-6 w-11 rounded-full bg-primary/20 p-1 cursor-pointer">
                <div className="h-4 w-4 rounded-full bg-primary shadow-sm translate-x-5 transition-transform" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">
                  Desktop Notifications
                </label>
                <p className="text-xs text-muted-foreground">
                  Get real-time updates while online.
                </p>
              </div>
              <div className="h-6 w-11 rounded-full bg-muted p-1 cursor-pointer">
                <div className="h-4 w-4 rounded-full bg-slate-400 shadow-sm translate-x-0 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/20 p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">
              Danger Zone
            </h2>
            <p className="text-sm text-red-600/60 dark:text-red-400/60">
              Irreversible actions for your account.
            </p>
          </div>
          <button className="px-4 py-2 bg-white dark:bg-transparent border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
