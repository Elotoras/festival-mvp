import Link from "next/link";
import { cn } from "@/lib/utils";

const items = [
  { href: "", label: "Resumen" },
  { href: "/edit", label: "Evento" },
  { href: "/participants", label: "Participantes" },
  { href: "/criteria", label: "Criterios" },
  { href: "/mentions", label: "Menciones" },
  { href: "/results", label: "Resultados" },
];

export function EventNav({
  slug,
  currentPath,
}: {
  slug: string;
  currentPath: string;
}) {
  return (
    <nav className="mb-6 flex gap-3 overflow-x-auto pb-2">
      {items.map((item) => {
        const href = `/event/${slug}${item.href}`;
        const active = currentPath === href;

        return (
          <Link
            key={item.label}
            href={href}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition",
              active
                ? "border-amber-700 bg-amber-700 text-white"
                : "border-stone-300 bg-white/80 text-stone-700 hover:border-stone-400",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
