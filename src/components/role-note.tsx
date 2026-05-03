const roleStyles = {
  administrador: {
    label: "Administrador",
    accent: "border-l-amber-500 bg-amber-50/70 text-amber-950",
    badge: "bg-amber-500 text-white",
  },
  participante: {
    label: "Participante",
    accent: "border-l-emerald-500 bg-emerald-50/70 text-emerald-950",
    badge: "bg-emerald-500 text-white",
  },
  jurado: {
    label: "Jurado",
    accent: "border-l-sky-500 bg-sky-50/70 text-sky-950",
    badge: "bg-sky-500 text-white",
  },
} as const;

export function RoleNote({
  role,
  text,
}: {
  role: keyof typeof roleStyles;
  text: string;
}) {
  const style = roleStyles[role];

  return (
    <div
      className={`rounded-2xl border border-white/80 border-l-4 px-4 py-3 shadow-[0_10px_30px_rgba(82,61,41,0.06)] ${style.accent}`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${style.badge}`}
        >
          {style.label}
        </span>
        <p className="text-sm leading-6">{text}</p>
      </div>
    </div>
  );
}
