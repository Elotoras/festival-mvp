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
        "rounded-[1.75rem] border border-white/80 bg-white/88 p-5 shadow-[0_18px_60px_rgba(84,60,39,0.09)] backdrop-blur sm:p-6",
        className,
      )}
    >
      <div className="mb-4">
        <h2 className="font-serif text-[1.7rem] leading-tight text-stone-900">{title}</h2>
        {description ? <p className="mt-1 text-sm leading-6 text-stone-600">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
