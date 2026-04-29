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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#fff8e8_0%,#f4efe4_42%,#efe4d0_100%)] text-stone-900">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-white/60 bg-white/80 p-5 shadow-[0_24px_80px_rgba(101,71,45,0.10)] backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-amber-900">
              <Trophy className="h-4 w-4" />
              Flavor Arena MVP
            </Link>
            <div>
              <h1 className="font-serif text-3xl tracking-tight text-stone-900 sm:text-4xl">
                {title}
              </h1>
              <p className="mt-2 max-w-3xl text-sm text-stone-600 sm:text-base">
                {description}
              </p>
            </div>
          </div>
          {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
        </header>
        {children}
      </div>
    </div>
  );
}
