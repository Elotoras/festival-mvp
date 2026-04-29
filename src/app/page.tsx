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
          description="Vista de administrador con acceso directo a configuracion, votacion y resultados."
        >
          <div className="mb-5">
            <RoleNote role="administrador" text="Desde aca organizas el evento y controlas todo el flujo." />
          </div>
          <div className="space-y-4">
            {events.map((event) => (
              <article
                key={event.id}
                className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                      {event.category}
                    </p>
                    <h2 className="mt-1 font-serif text-2xl text-stone-900">{event.name}</h2>
                    <p className="mt-2 max-w-xl text-sm text-stone-600">
                      {event.description || "Sin descripcion"}
                    </p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold tracking-[0.18em] text-stone-700">
                    {formatStatus(event.status)}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 text-sm text-stone-600 sm:grid-cols-3">
                  <div className="rounded-2xl bg-white px-4 py-3">
                    <span className="font-semibold text-stone-900">{event._count.participants}</span> participantes
                  </div>
                  <div className="rounded-2xl bg-white px-4 py-3">
                    <span className="font-semibold text-stone-900">{event._count.votes}</span> votos
                  </div>
                  <div className="rounded-2xl bg-white px-4 py-3">
                    Prefijo <span className="font-semibold text-stone-900">{event.codePrefix}</span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    href={`/event/${event.slug}`}
                    className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold !text-white hover:bg-stone-800"
                  >
                    Administrar
                  </Link>
                  <Link
                    href={`/event/${event.slug}/vote`}
                    className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700"
                  >
                    Votacion publica
                  </Link>
                  <Link
                    href={`/event/${event.slug}/results`}
                    className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700"
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
          description="La primera version no usa login. Puedes crear el evento y compartirlo rapido."
        >
          <div className="mb-5">
            <RoleNote role="administrador" text="Primero definis el evento. Despues cargas participantes y votacion." />
          </div>
          <form action={createEventAction} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm text-stone-700">
                Nombre
                <input
                  name="name"
                  required
                  className="mt-2 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-amber-700"
                  placeholder="Ej. Cata de cafes de especialidad"
                />
                <p className="mt-2 text-xs text-stone-500">
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
                <p className="mt-2 text-xs text-stone-500">
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
              <p className="mt-2 text-xs text-stone-500">
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
                <p className="mt-2 text-xs text-stone-500">
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
                <p className="mt-2 text-xs text-stone-500">
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
                <p className="mt-2 text-xs text-stone-500">
                  Draft prepara el evento, Open habilita votos y Closed congela la carga.
                </p>
              </label>
            </div>

            <label className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700">
              <input type="checkbox" name="blindTasting" defaultChecked className="h-4 w-4" />
              Cata a ciegas: mostrar solo codigo publico al jurado
            </label>

            <button className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-amber-700 px-5 py-4 font-semibold text-white transition hover:bg-amber-800">
              <Plus className="h-4 w-4" />
              Crear evento
            </button>
          </form>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.5rem] bg-stone-900 p-4 text-stone-50">
              <Trophy className="h-5 w-5" />
              <p className="mt-3 text-sm">
                Ranking automatico con ponderacion, desempate y menciones especiales.
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-white p-4 text-stone-700">
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
