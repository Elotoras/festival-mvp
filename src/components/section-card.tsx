import { cn } from "@/lib/utils";

export function SectionCard({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-[1.75rem] border border-stone-200 bg-white/90 p-5 shadow-[0_16px_50px_rgba(75,54,34,0.08)]",
        className,
      )}
    >
      <div className="mb-4">
        <h2 className="font-serif text-2xl text-stone-900">{title}</h2>
        {description ? <p className="mt-1 text-sm text-stone-600">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
