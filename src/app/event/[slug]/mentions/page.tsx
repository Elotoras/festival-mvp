import { notFound } from "next/navigation";
import {
  addMentionAction,
  deleteMentionAction,
  updateMentionAction,
} from "@/app/actions";
import { AppShell } from "@/components/app-shell";
import { EventNav } from "@/components/event-nav";
import { SectionCard } from "@/components/section-card";
import { getEventBySlug } from "@/lib/data";

export default async function MentionsPage({
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
    <AppShell title="Menciones especiales" description="Reconocimientos extra para el evento.">
      <EventNav slug={slug} currentPath={`/event/${slug}/mentions`} />
      <div className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
        <SectionCard title="Nueva mencion" description="Se vota al final del formulario.">
          <form action={addMentionAction.bind(null, slug)} className="space-y-4">
            <label className="block text-sm text-stone-700">
              Nombre
              <input
                name="name"
                required
                className="mt-2 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3"
                placeholder="Favorito del publico"
              />
            </label>
            <label className="block text-sm text-stone-700">
              Descripcion
              <textarea
                name="description"
                rows={3}
                placeholder="Opcional"
                className="mt-2 w-full rounded-3xl border border-stone-300 bg-white px-4 py-3"
              />
            </label>
            <button type="submit" className="rounded-full bg-stone-900 px-5 py-3 font-semibold text-white">
              Agregar mencion
            </button>
          </form>
        </SectionCard>

        <SectionCard title="Menciones configuradas" description="Edita o elimina las que ya no uses.">
          <div className="space-y-4">
            {event.mentions.map((mention) => (
              <form
                key={mention.id}
                action={updateMentionAction.bind(null, slug, mention.id)}
                className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-4"
              >
                <label className="block text-sm text-stone-700">
                  Nombre
                  <input
                    name="name"
                    required
                    defaultValue={mention.name}
                    className="mt-2 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3"
                  />
                </label>
                <label className="mt-4 block text-sm text-stone-700">
                  Descripcion
                  <textarea
                    name="description"
                    rows={3}
                    defaultValue={mention.description ?? ""}
                    placeholder="Opcional"
                    className="mt-2 w-full rounded-3xl border border-stone-300 bg-white px-4 py-3"
                  />
                </label>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="submit"
                    className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white"
                  >
                    Guardar
                  </button>
                  <button
                    formAction={deleteMentionAction.bind(null, slug, mention.id)}
                    type="submit"
                    className="rounded-full border border-rose-300 bg-white px-4 py-2 text-sm font-semibold text-rose-700"
                  >
                    Eliminar
                  </button>
                </div>
              </form>
            ))}
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}
