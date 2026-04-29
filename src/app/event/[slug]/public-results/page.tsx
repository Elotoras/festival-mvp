import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { SectionCard } from "@/components/section-card";
import { calculateRanking, getEventBySlug } from "@/lib/data";

export default async function PublicResultsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const ranking = await calculateRanking(event.id);

  return (
    <AppShell
      title={`${event.name} · Resultados finales`}
      description="Vista limpia para asistentes, pantallas compartidas y cierre del evento."
    >
      <main className="mx-auto w-full max-w-5xl space-y-6">
        <SectionCard title="Ranking final">
          <div className="space-y-3">
            {ranking.rankedParticipants.map((participant) => (
              <div
                key={participant.participantId}
                className="flex items-center justify-between rounded-[1.5rem] border border-stone-200 bg-white px-5 py-4"
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                    Puesto {participant.placement}
                  </p>
                  <h2 className="font-serif text-3xl text-stone-900">{participant.publicCode}</h2>
                </div>
                <div className="text-right text-sm text-stone-700">
                  <p>Total {participant.totalScore}</p>
                  <p>Promedio {participant.averageScore.toFixed(1)}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Menciones especiales">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {ranking.mentionResults.map((mention) => (
              <div key={mention.mentionId} className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-4">
                <h3 className="font-serif text-2xl">{mention.name}</h3>
                <div className="mt-3 space-y-2 text-sm text-stone-700">
                  {mention.winners.length ? (
                    mention.winners.map((winner) => (
                      <p key={winner.participantId}>
                        {winner.publicCode} · {winner.totalVotes} votos
                      </p>
                    ))
                  ) : (
                    <p>Sin definicion.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </main>
    </AppShell>
  );
}
