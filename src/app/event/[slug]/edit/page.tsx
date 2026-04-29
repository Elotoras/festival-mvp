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
    <AppShell title={`Editar ${event.name}`} description="Configuracion general del evento y textos visibles.">
      <EventNav slug={slug} currentPath={`/event/${slug}/edit`} />
      <SectionCard title="Datos generales">
        <form action={updateEventAction.bind(null, slug)} className="grid gap-4 md:grid-cols-2">
          <label className="text-sm text-stone-700">
            Nombre
            <input
              name="name"
              required
              defaultValue={event.name}
              className="mt-2 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3"
            />
            <p className="mt-2 text-xs text-stone-500">
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
            <p className="mt-2 text-xs text-stone-500">
              Te ayuda a mantener una organizacion clara.
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
            <p className="mt-2 text-xs text-stone-500">
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
            <p className="mt-2 text-xs text-stone-500">
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
            <p className="mt-2 text-xs text-stone-500">
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
            <p className="mt-2 text-xs text-stone-500">
              Cambia el comportamiento general del evento.
            </p>
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700">
            <input
              type="checkbox"
              name="blindTasting"
              defaultChecked={event.blindTasting}
              className="h-4 w-4"
            />
            Ocultar nombres reales y mostrar solo codigo al jurado
          </label>
          <div className="md:col-span-2">
            <button type="submit" className="rounded-full bg-stone-900 px-5 py-3 font-semibold text-white">
              Guardar cambios
            </button>
          </div>
        </form>
      </SectionCard>
      <SectionCard
        title="Zona sensible"
        description="Eliminar un evento borra tambien participantes, criterios, votos y resultados asociados."
        className="mt-6"
      >
        <form action={deleteEventAction.bind(null, slug)}>
          <button
            type="submit"
            className="rounded-full bg-stone-900 px-5 py-3 font-semibold text-white"
          >
            Eliminar evento completo
          </button>
        </form>
      </SectionCard>
    </AppShell>
  );
}
