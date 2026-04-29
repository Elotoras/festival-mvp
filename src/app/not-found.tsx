import Link from "next/link";
import { AppShell } from "@/components/app-shell";

export default function NotFound() {
  return (
    <AppShell
      title="No encontrado"
      description="La ruta que pediste no corresponde a un evento o pantalla disponible."
    >
      <div className="rounded-[1.75rem] border border-stone-200 bg-white p-6">
        <p className="text-sm text-stone-700">Volvé al panel principal para revisar los eventos disponibles.</p>
        <Link href="/" className="mt-4 inline-block rounded-full bg-stone-900 px-5 py-3 font-semibold text-white">
          Ir al inicio
        </Link>
      </div>
    </AppShell>
  );
}
