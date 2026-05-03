import { notFound } from "next/navigation";
import { deleteEventAction, updateEventAction } from "@/app/actions";
import { AppShell } from "@/components/app-shell";
import { EventNav } from "@/components/event-nav";
import { SectionCard } from "@/components/section-card";
import { getEventBySlug } from "@/lib/data";

export default async function EventEditPage({
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
    <AppShell
      title={`Editar ${event.name}`}
      description="Ajusta la configuracion general y los textos visibles del evento."
    >
      <EventNav slug={slug} currentPath={`/event/${slug}/edit`} />
      <div className="space-y-6">
        <SectionCard title="Datos generales" description="Nombre, categoria, estado y textos del evento.">
          <form action={updateEventAction.bind(null, slug)} className="grid gap-5 md:grid-cols-2">
            <label className="text-sm text-stone-700">
              Nombre
              <input
                name="name"
                required
                defaultValue={event.name}
                className="mt-2 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3"
              />
              <p className="mt-2 text-xs leading-5 text-stone-500">
                Cambialo solo si necesitas renombrar el evento completo.
              </p>
            </label>
            <label className="text-sm text-stone-700">
              Categoria
              <input
                name="category"
                required
                defaultValue={event.category}
                className="mt-2 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3"
              />
              <p className="mt-2 text-xs leading-5 text-stone-500">
                Sirve para mantener una organizacion clara.
              </p>
            </label>
            <label className="text-sm text-stone-700 md:col-span-2">
              Descripcion
              <textarea
                name="description"
                rows={4}
                defaultValue={event.description ?? ""}
                className="mt-2 w-full rounded-3xl border border-stone-300 bg-white px-4 py-3"
              />
              <p className="mt-2 text-xs leading-5 text-stone-500">
                Sirve como referencia general del evento.
              </p>
            </label>
            <label className="text-sm text-stone-700">
              Prefijo de codigos
              <input
                name="codePrefix"
                required
                maxLength={4}
                defaultValue={event.codePrefix}
                className="mt-2 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 uppercase"
              />
              <p className="mt-2 text-xs leading-5 text-stone-500">
                Maximo 4 caracteres. Ejemplos: PART, VINO, HELA.
              </p>
            </label>
            <label className="text-sm text-stone-700">
              Texto del item
              <input
                name="itemLabel"
                required
                defaultValue={event.itemLabel}
                className="mt-2 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3"
              />
              <p className="mt-2 text-xs leading-5 text-stone-500">
                Asi se nombra cada item en la votacion.
              </p>
            </label>
            <label className="text-sm text-stone-700">
              Estado
              <select
                name="status"
                defaultValue={event.status}
                className="mt-2 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3"
              >
                <option value="DRAFT">En preparacion</option>
                <option value="OPEN">Abierto</option>
                <option value="CLOSED">Cerrado</option>
              </select>
              <p className="mt-2 text-xs leading-5 text-stone-500">
                Cambia el comportamiento general del evento.
              </p>
            </label>
            <div className="rounded-[1.5rem] border border-stone-200 bg-[linear-gradient(180deg,#fffefb_0%,#f6efe3_100%)] px-4 py-4">
              <label className="flex items-center gap-3 text-sm text-stone-800">
                <input
                  type="checkbox"
                  name="blindTasting"
                  defaultChecked={event.blindTasting}
                  className="h-4 w-4"
                />
                Ocultar nombres reales y mostrar solo codigo al jurado
              </label>
              <p className="mt-2 text-xs leading-5 text-stone-500">
                Ideal para catas a ciegas y votaciones imparciales.
              </p>
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="rounded-full bg-stone-900 px-5 py-3 font-semibold text-white shadow-[0_10px_24px_rgba(28,25,23,0.18)]"
              >
                Guardar cambios
              </button>
            </div>
          </form>
        </SectionCard>

        <SectionCard
          title="Zona sensible"
          description="Eliminar un evento borra tambien participantes, criterios, votos y resultados asociados."
          className="border-rose-200 bg-[linear-gradient(180deg,rgba(255,250,250,0.95)_0%,rgba(255,241,241,0.92)_100%)]"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl text-sm leading-6 text-rose-900/80">
              Usa esta accion solo si realmente quieres borrar todo el evento y empezar de cero.
            </p>
            <form action={deleteEventAction.bind(null, slug)}>
              <button
                type="submit"
                className="rounded-full border border-rose-300 bg-white px-5 py-3 font-semibold text-rose-700 shadow-[0_10px_24px_rgba(190,24,93,0.10)]"
              >
                Eliminar evento completo
              </button>
            </form>
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}
