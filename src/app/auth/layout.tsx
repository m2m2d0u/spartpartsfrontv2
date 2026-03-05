export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left panel — branding */}
      <div className="hidden w-1/2 flex-col justify-between bg-primary p-12 lg:flex">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">Spare Parts</span>
          </div>
        </div>

        <div className="space-y-8">
          <h2 className="text-4xl font-bold leading-tight text-white">
            Manage your inventory
            <br />
            with confidence.
          </h2>
          <p className="max-w-md text-lg text-white/70">
            Track stock, manage orders, handle invoices and procurement — all
            from one powerful dashboard.
          </p>

          <div className="flex gap-6">
            <div className="rounded-xl bg-white/10 px-5 py-4 backdrop-blur-sm">
              <p className="text-2xl font-bold text-white">Multi-store</p>
              <p className="text-sm text-white/60">Support</p>
            </div>
            <div className="rounded-xl bg-white/10 px-5 py-4 backdrop-blur-sm">
              <p className="text-2xl font-bold text-white">Real-time</p>
              <p className="text-sm text-white/60">Stock tracking</p>
            </div>
            <div className="rounded-xl bg-white/10 px-5 py-4 backdrop-blur-sm">
              <p className="text-2xl font-bold text-white">Role-based</p>
              <p className="text-sm text-white/60">Access control</p>
            </div>
          </div>
        </div>

        <p className="text-sm text-white/40">
          &copy; {new Date().getFullYear()} Symmetry. All rights reserved.
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex w-full items-center justify-center bg-gray-2 p-6 dark:bg-[#020d1a] lg:w-1/2">
        <div className="w-full max-w-[480px]">
          {/* Mobile logo — hidden on desktop */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-xl font-bold text-dark dark:text-white">
              Spare Parts
            </span>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
