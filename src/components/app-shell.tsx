import Link from "next/link";
import { Trophy } from "lucide-react";

export function AppShell({
  children,
  title,
  description,
  actions,
}: {
  children: React.ReactNode;
  title: string;
  description: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#fff7dd_0%,#f4ebdc_36%,#efe4d4_65%,#e9dcc8_100%)] text-stone-900">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(110deg,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0)_34%)]" />
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="relative mb-8 flex flex-col gap-5 overflow-hidden rounded-[2rem] border border-white/70 bg-white/78 p-5 shadow-[0_28px_90px_rgba(96,69,43,0.10)] backdrop-blur sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="absolute inset-y-0 right-0 hidden w-48 bg-[radial-gradient(circle_at_center,rgba(217,161,40,0.18),rgba(217,161,40,0))] lg:block" />
          <div className="relative space-y-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-900"
            >
              <Trophy className="h-4 w-4" />
              Flavor Arena MVP
            </Link>
            <div>
              <h1 className="font-serif text-3xl tracking-tight text-stone-900 sm:text-4xl lg:text-[2.8rem]">
                {title}
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600 sm:text-base">
                {description}
              </p>
            </div>
          </div>
          {actions ? <div className="relative flex flex-wrap gap-3">{actions}</div> : null}
        </header>
        {children}
      </div>
    </div>
  );
}
