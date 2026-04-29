import { notFound } from "next/navigation";
import {
  addCriterionAction,
  applyCriterionTemplateAction,
  deleteCriterionAction,
  updateCriterionAction,
} from "@/app/actions";
import { AppShell } from "@/components/app-shell";
import { EventNav } from "@/components/event-nav";
import { SectionCard } from "@/components/section-card";
import { getEventBySlug } from "@/lib/data";
import { getTemplateOptions } from "@/lib/event-templates";

export default async function CriteriaPage({
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
    <AppShell title="Criterios de evaluacion" description="Define como se puntua el evento.">
      <EventNav slug={slug} currentPath={`/event/${slug}/criteria`} />
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <SectionCard title="Nuevo criterio" description="Nombre, escala y peso.">
          <form action={addCriterionAction.bind(null, slug)} className="space-y-4">
            <label className="block text-sm text-stone-700">
              Nombre
              <input
                name="name"
                required
                placeholder="Sabor"
                className="mt-2 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3"
              />
            </label>
            <label className="block text-sm text-stone-700">
              Descripcion
              <input
                name="description"
                placeholder="Opcional"
                className="mt-2 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3"
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="text-sm text-stone-700">
                Minimo
                <input
                  type="number"
                  name="minScore"
                  defaultValue={1}
                  className="mt-2 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3"
                />
              </label>
              <label className="text-sm text-stone-700">
                Maximo
                <input
                  type="number"
                  name="maxScore"
                  defaultValue={10}
                  className="mt-2 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3"
                />
              </label>
              <label className="text-sm text-stone-700">
                Peso
                <input
                  type="number"
                  name="weight"
                  defaultValue={1}
                  className="mt-2 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3"
                />
              </label>
            </div>
            <div className="grid gap-3">
              <label className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700">
                <input type="checkbox" name="required" defaultChecked className="h-4 w-4" />
                Requerido
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700">
                <input type="checkbox" name="mainCriterion" className="h-4 w-4" />
                Criterio principal para desempate
              </label>
            </div>
            <button type="submit" className="rounded-full bg-stone-900 px-5 py-3 font-semibold text-white">
              Agregar criterio
            </button>
          </form>
        </SectionCard>

        <SectionCard title="Plantillas y criterios activos" description="Una plantilla reemplaza la lista actual.">
          <div className="mb-5 flex flex-wrap gap-3">
            {getTemplateOptions().map((templateKey) => (
              <form key={templateKey} action={applyCriterionTemplateAction.bind(null, slug, templateKey)}>
                <button
                  type="submit"
                  className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700"
                >
                  Plantilla {templateKey}
                </button>
              </form>
            ))}
          </div>

          <div className="space-y-4">
            {event.criteria.map((criterion) => (
              <form
                key={criterion.id}
                action={updateCriterionAction.bind(null, slug, criterion.id)}
                className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-4"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="text-sm text-stone-700">
                    Nombre
                    <input
                      name="name"
                      required
                      defaultValue={criterion.name}
                      className="mt-2 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3"
                    />
                  </label>
                  <label className="text-sm text-stone-700">
                    Descripcion
                    <input
                      name="description"
                      defaultValue={criterion.description ?? ""}
                      placeholder="Opcional"
                      className="mt-2 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3"
                    />
                  </label>
                  <label className="text-sm text-stone-700">
                    Min
                    <input
                      type="number"
                      name="minScore"
                      defaultValue={criterion.minScore}
                      className="mt-2 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3"
                    />
                  </label>
                  <label className="text-sm text-stone-700">
                    Max
                    <input
                      type="number"
                      name="maxScore"
                      defaultValue={criterion.maxScore}
                      className="mt-2 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3"
                    />
                  </label>
                  <label className="text-sm text-stone-700">
                    Peso
                    <input
                      type="number"
                      name="weight"
                      defaultValue={criterion.weight}
                      className="mt-2 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3"
                    />
                  </label>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-4 text-sm text-stone-700">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" name="required" defaultChecked={criterion.required} className="h-4 w-4" />
                      Requerido
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="mainCriterion"
                        defaultChecked={criterion.mainCriterion}
                        className="h-4 w-4"
                      />
                      Principal
                    </label>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="submit"
                      className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white"
                    >
                      Guardar
                    </button>
                    <button
                      formAction={deleteCriterionAction.bind(null, slug, criterion.id)}
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
