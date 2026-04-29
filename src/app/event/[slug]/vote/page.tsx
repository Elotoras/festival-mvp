import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { RoleNote } from "@/components/role-note";
import { SectionCard } from "@/components/section-card";
import { VoteForm } from "@/components/vote-form";
import { getEventBySlug } from "@/lib/data";

export default async function VotePage({
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
      title={event.name}
      description="Completa la evaluacion de cada participante. La experiencia esta optimizada para jurados desde celular."
    >
      <main className="mx-auto w-full max-w-4xl space-y-6">
        <RoleNote role="jurado" text="Tu tarea es puntuar cada participante de forma simple y pareja." />

        <SectionCard title="Instrucciones" description="Evalua cada item usando la escala indicada y completa las menciones si corresponden.">
          <div className="grid gap-4 text-sm text-stone-700 md:grid-cols-3">
            <div className="rounded-[1.5rem] bg-stone-50 p-4">
              1. Valora cada {event.itemLabel} segun los criterios configurados.
            </div>
            <div className="rounded-[1.5rem] bg-stone-50 p-4">
              2. Si la cata es a ciegas, el jurado ve solo el codigo publico.
            </div>
            <div className="rounded-[1.5rem] bg-stone-50 p-4">
              3. Al enviar, el voto queda registrado para el ranking final.
            </div>
          </div>
        </SectionCard>

        <VoteForm
          eventId={event.id}
          slug={slug}
          eventName={event.name}
          itemLabel={event.itemLabel}
          blindTasting={event.blindTasting}
          alreadyVoted={false}
          participants={event.participants}
          criteria={event.criteria}
          mentions={event.mentions}
        />
      </main>
    </AppShell>
  );
}
