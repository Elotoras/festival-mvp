import { notFound } from "next/navigation";
import {
  addParticipantAction,
  deleteParticipantAction,
  updateParticipantAction,
} from "@/app/actions";
import { AppShell } from "@/components/app-shell";
import { EventNav } from "@/components/event-nav";
import { RoleNote } from "@/components/role-note";
import { SectionCard } from "@/components/section-card";
import { getEventBySlug } from "@/lib/data";

export default async function ParticipantsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  return (
    <AppShell title="Participantes" description="Carga manual, codigos publicos y control de visibilidad para jurados.">
      <EventNav slug={slug} currentPath={`/event/${slug}/participants`} />
      <div className="mb-6 space-y-3">
        <RoleNote role="administrador" text="Aca cargas, corriges o eliminas participantes." />
      </div>
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <SectionCard title="Agregar participante" description="Se sugiere el siguiente codigo en funcion del prefijo del evento.">
          <form action={addParticipantAction.bind(null, slug)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm text-stone-700">
                Codigo publico
                <input
                  name="publicCode"
                  defaultValue={`${event.codePrefix}${event.participants.length + 1}`}
                  required
                  maxLength={12}
                  className="mt-2 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3"
                />
                <p className="mt-2 text-xs text-stone-500">
                  Es el codigo que vera el jurado.
                </p>
              </label>
              <label className="text-sm text-stone-700">
                Nombre interno
                <input
                  name="displayName"
                  className="mt-2 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3"
                />
                <p className="mt-2 text-xs text-stone-500">
                  Te ayuda a identificarlo rapido.
                </p>
              </label>
            </div>
            <label className="block text-sm text-stone-700">
              Nombre del producto/preparacion
              <input
                name="productName"
                className="mt-2 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3"
              />
              <p className="mt-2 text-xs text-stone-500">
                Nombre real del item evaluado.
              </p>
            </label>
            <label className="block text-sm text-stone-700">
              Notas
              <textarea
                name="notes"
                rows={3}
                className="mt-2 w-full rounded-3xl border border-stone-300 bg-white px-4 py-3"
              />
              <p className="mt-2 text-xs text-stone-500">
                Solo se ven en esta pantalla. No aparecen en votacion ni en resultados publicos.
              </p>
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700">
              <input type="checkbox" name="visibleToJudges" className="h-4 w-4" />
              Mostrar nombre real al jurado
            </label>
            <p className="-mt-2 text-xs text-stone-500">
              Si lo activas, el nombre del producto aparece junto al codigo en la votacion.
            </p>
            <button type="submit" className="rounded-full bg-stone-900 px-5 py-3 font-semibold text-white">
              Agregar participante
            </button>
          </form>
        </SectionCard>

        <SectionCard title="Listado actual" description="Edita cada participante sin salir de la pantalla.">
          <div className="space-y-4">
            {event.participants.map((participant) => (
              <form
                key={participant.id}
                action={updateParticipantAction.bind(null, slug, participant.id)}
                className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-4"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="text-sm text-stone-700">
                    Codigo publico
                    <input
                      name="publicCode"
                      defaultValue={participant.publicCode}
                      required
                      maxLength={12}
                      className="mt-2 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3"
                    />
                    <p className="mt-2 text-xs text-stone-500">
                      Es como se vera en votacion y resultados.
                    </p>
                  </label>
                  <label className="text-sm text-stone-700">
                    Nombre interno
                    <input
                      name="displayName"
                      defaultValue={participant.displayName ?? ""}
                      className="mt-2 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3"
                    />
                    <p className="mt-2 text-xs text-stone-500">
                      Referencia privada para administracion.
                    </p>
                  </label>
                  <label className="text-sm text-stone-700">
                    Producto
                    <input
                      name="productName"
                      defaultValue={participant.productName ?? ""}
                      className="mt-2 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3"
                    />
                    <p className="mt-2 text-xs text-stone-500">
                      Nombre del item presentado.
                    </p>
                  </label>
                  <label className="text-sm text-stone-700">
                    Notas
                    <input
                      name="notes"
                      defaultValue={participant.notes ?? ""}
                      className="mt-2 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3"
                    />
                    <p className="mt-2 text-xs text-stone-500">
                      Solo se ven en admin.
                    </p>
                  </label>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-1">
                    <label className="flex items-center gap-3 text-sm text-stone-700">
                      <input
                        type="checkbox"
                        name="visibleToJudges"
                        defaultChecked={participant.visibleToJudges}
                        className="h-4 w-4"
                      />
                      Mostrar nombre real al jurado
                    </label>
                    <p className="text-xs text-stone-500">
                      Hace visible el nombre del producto en la votacion publica.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="submit"
                      className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white"
                    >
                      Guardar
                    </button>
                    <button
                      formAction={deleteParticipantAction.bind(null, slug, participant.id)}
                      type="submit"
                      className="rounded-full border border-rose-300 bg-white px-4 py-2 text-sm font-semibold text-rose-700"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </form>
            ))}
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}
