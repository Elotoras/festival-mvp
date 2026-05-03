import Link from "next/link";
import { Plus, Trophy, Vote } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { RoleNote } from "@/components/role-note";
import { SectionCard } from "@/components/section-card";
import { getEvents } from "@/lib/data";
import { createEventAction } from "@/app/actions";
import { formatStatus } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const events = await getEvents();

  return (
    <AppShell
      title="Gestiona competencias y degustaciones"
      description="Crea eventos genericos para productos, preparaciones o catas comparativas. Configura participantes, criterios, menciones y resultados en una sola app mobile-first."
      actions={
        <div className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-900">
          MVP sin login
        </div>
      }
    >
      <main className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <SectionCard
          title="Eventos existentes"
          description="Acceso rapido a cada evento, su votacion y sus resultados."
        >
          <div className="mb-5">
            <RoleNote role="administrador" text="Desde aca organizas el evento y controlas todo el flujo." />
          </div>
          <div className="space-y-4">
            {events.map((event) => (
              <article
                key={event.id}
                className="rounded-[1.75rem] border border-stone-200 bg-[linear-gradient(180deg,#fffdf9_0%,#f7f1e7_100%)] p-5 shadow-[0_12px_34px_rgba(72,53,35,0.06)]"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-stone-500">
                      {event.category}
                    </p>
                    <h2 className="mt-1 font-serif text-2xl text-stone-900 sm:text-[2rem]">
                      {event.name}
                    </h2>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-stone-600">
                      {event.description || "Sin descripcion"}
                    </p>
                  </div>
                  <span className="rounded-full border border-white bg-white/90 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-stone-700">
                    {formatStatus(event.status)}
                  </span>
                </div>

                <div className="mt-5 grid gap-3 text-sm text-stone-600 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white bg-white/85 px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-stone-500">Participantes</p>
                    <span className="mt-1 block text-2xl font-semibold text-stone-900">
                      {event._count.participants}
                    </span>
                  </div>
                  <div className="rounded-2xl border border-white bg-white/85 px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-stone-500">Votos</p>
                    <span className="mt-1 block text-2xl font-semibold text-stone-900">
                      {event._count.votes}
                    </span>
                  </div>
                  <div className="rounded-2xl border border-white bg-white/85 px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-stone-500">Prefijo</p>
                    <span className="mt-1 block text-2xl font-semibold text-stone-900">
                      {event.codePrefix}
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href={`/event/${event.slug}`}
                    className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold !text-white shadow-[0_10px_24px_rgba(28,25,23,0.18)] hover:bg-stone-800"
                  >
                    Administrar
                  </Link>
                  <Link
                    href={`/event/${event.slug}/vote`}
                    className="rounded-full border border-stone-300 bg-white/90 px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-white"
                  >
                    Votacion publica
                  </Link>
                  <Link
                    href={`/event/${event.slug}/results`}
                    className="rounded-full border border-stone-300 bg-white/90 px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-white"
                  >
                    Resultados
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Crear evento"
          description="Crea la estructura del evento y dejalo listo para cargar participantes y votacion."
        >
          <div className="mb-5">
            <RoleNote role="administrador" text="Primero definis el evento. Despues cargas participantes y votacion." />
          </div>
          <form action={createEventAction} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm text-stone-700">
                Nombre
                <input
                  name="name"
                  required
                  className="mt-2 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-amber-700"
                  placeholder="Ej. Cata de cafes de especialidad"
                />
                <p className="mt-2 text-xs leading-5 text-stone-500">
                  Usa un nombre claro y facil de reconocer por el organizador y los jurados.
                </p>
              </label>
              <label className="text-sm text-stone-700">
                Categoria
                <input
                  name="category"
                  required
                  className="mt-2 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-amber-700"
                  placeholder="bebida, comida, postre..."
                />
                <p className="mt-2 text-xs leading-5 text-stone-500">
                  Sirve para ordenar eventos y adaptar el lenguaje visual del formulario.
                </p>
              </label>
            </div>

            <label className="block text-sm text-stone-700">
              Descripcion
              <textarea
                name="description"
                rows={4}
                className="mt-2 w-full rounded-3xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-amber-700"
                placeholder="Que se va a evaluar y como participar."
              />
              <p className="mt-2 text-xs leading-5 text-stone-500">
                Explica brevemente el objetivo del evento y cualquier instruccion relevante.
              </p>
            </label>

            <div className="grid gap-4 sm:grid-cols-3">
              <label className="text-sm text-stone-700">
                Prefijo de codigos
                <input
                  name="codePrefix"
                  defaultValue="PART"
                  className="mt-2 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 uppercase outline-none focus:border-amber-700"
                />
                <p className="mt-2 text-xs leading-5 text-stone-500">
                  Se usa para generar codigos como PART1, PART2 o PART3.
                </p>
              </label>
              <label className="text-sm text-stone-700">
                Texto del item
                <input
                  name="itemLabel"
                  defaultValue="producto"
                  className="mt-2 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-amber-700"
                />
                <p className="mt-2 text-xs leading-5 text-stone-500">
                  Personaliza el lenguaje del evento: producto, vino, plato, helado o preparacion.
                </p>
              </label>
              <label className="text-sm text-stone-700">
                Estado
                <select
                  name="status"
                  defaultValue="DRAFT"
                  className="mt-2 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-amber-700"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="OPEN">Open</option>
                  <option value="CLOSED">Closed</option>
                </select>
                <p className="mt-2 text-xs leading-5 text-stone-500">
                  Draft prepara el evento, Open habilita votos y Closed congela la carga.
                </p>
              </label>
            </div>

            <label className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50/90 px-4 py-3 text-sm text-stone-700">
              <input type="checkbox" name="blindTasting" defaultChecked className="h-4 w-4" />
              Cata a ciegas: mostrar solo codigo publico al jurado
            </label>

            <button className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-amber-700 px-5 py-4 font-semibold text-white shadow-[0_14px_30px_rgba(180,112,18,0.24)] transition hover:bg-amber-800">
              <Plus className="h-4 w-4" />
              Crear evento
            </button>
          </form>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.5rem] bg-[linear-gradient(160deg,#28211c_0%,#43342b_100%)] p-4 text-stone-50 shadow-[0_12px_26px_rgba(28,25,23,0.16)]">
              <Trophy className="h-5 w-5" />
              <p className="mt-3 text-sm">
                Ranking automatico con ponderacion, desempate y menciones especiales.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-stone-200 bg-white/90 p-4 text-stone-700">
              <Vote className="h-5 w-5" />
              <p className="mt-3 text-sm">
                Link y QR publico para jurados, pensado para completar rapido desde celular.
              </p>
            </div>
          </div>
        </SectionCard>
      </main>
    </AppShell>
  );
}
