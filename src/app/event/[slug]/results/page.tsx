import Link from "next/link";
import { notFound } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { EventNav } from "@/components/event-nav";
import { SectionCard } from "@/components/section-card";
import { calculateRanking, getEventBySlug } from "@/lib/data";
import { formatStatus } from "@/lib/utils";

export default async function ResultsPage({
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
      title="Resultados"
      description="Vista de ranking, desglose y ganadores de menciones para anunciar el cierre del evento."
      actions={
        <Link
          href={`/event/${slug}/results`}
          className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700"
        >
          <RefreshCw className="h-4 w-4" />
          Actualizar
        </Link>
      }
    >
      <EventNav slug={slug} currentPath={`/event/${slug}/results`} />
      <div className="space-y-6">
        <SectionCard title="Estado del evento" description="Informacion util para exponer resultados en vivo o proyectarlos.">
          <div className="grid gap-4 sm:grid-cols-4">
            <div className="rounded-[1.5rem] bg-stone-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Estado</p>
              <p className="mt-2 font-serif text-3xl">{formatStatus(event.status)}</p>
            </div>
            <div className="rounded-[1.5rem] bg-stone-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Votos</p>
              <p className="mt-2 font-serif text-3xl">{event._count.votes}</p>
            </div>
            <div className="rounded-[1.5rem] bg-stone-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Participantes</p>
              <p className="mt-2 font-serif text-3xl">{event.participants.length}</p>
            </div>
            <div className="rounded-[1.5rem] bg-stone-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Menciones</p>
              <p className="mt-2 font-serif text-3xl">{event.mentions.length}</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Podio" description="Primer vistazo para anunciar el 1ro, 2do y 3ro.">
          <div className="grid gap-4 md:grid-cols-3">
            {ranking.rankedParticipants.slice(0, 3).map((participant, index) => (
              <div
                key={participant.participantId}
                className={`rounded-[2rem] border p-5 text-white ${
                  index === 0
                    ? "border-amber-300 bg-[linear-gradient(160deg,#9a6a16_0%,#d7a128_100%)]"
                    : index === 1
                      ? "border-slate-300 bg-[linear-gradient(160deg,#5f6874_0%,#9099a4_100%)]"
                      : "border-orange-300 bg-[linear-gradient(160deg,#8b5a34_0%,#c78349_100%)]"
                }`}
              >
                <p className="text-xs uppercase tracking-[0.25em] text-white/80">
                  {index === 0 ? "Ganador" : `${index + 1} puesto`}
                </p>
                <h2 className="mt-3 font-serif text-5xl">{participant.publicCode}</h2>
                <p className="mt-3 text-sm text-white/90">
                  Total {participant.totalScore} · Promedio {participant.averageScore.toFixed(1)}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Ranking completo" description="Incluye totales, promedio, votos y desglose por criterio.">
          <div className="space-y-4">
            {ranking.rankedParticipants.map((participant) => (
              <article
                key={participant.participantId}
                className="rounded-[1.75rem] border border-stone-200 bg-white p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                      Puesto {participant.placement}
                      {participant.tied ? " · Empate" : ""}
                    </p>
                    <h3 className="mt-2 font-serif text-3xl text-stone-900">
                      {participant.publicCode}
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm sm:min-w-[19rem]">
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-950">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-amber-700">Total</p>
                      <span className="mt-1 block text-2xl font-semibold">{participant.totalScore}</span>
                    </div>
                    <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-800">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-stone-500">Promedio</p>
                      <span className="mt-1 block text-xl font-semibold">{participant.averageScore.toFixed(1)}</span>
                    </div>
                    <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sky-950">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-sky-700">Votos</p>
                      <span className="mt-1 block text-xl font-semibold">{participant.voteCount}</span>
                    </div>
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-950">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-700">Menciones</p>
                      <span className="mt-1 block text-xl font-semibold">{participant.specialMentionCount}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  {participant.criterionBreakdown.map((criterion) => (
                    <div
                      key={criterion.criterionId}
                      className="rounded-2xl bg-stone-50 px-4 py-3 text-sm text-stone-700"
                    >
                      <p className="font-medium text-stone-900">{criterion.name}</p>
                      <p className="mt-1">Total {criterion.total}</p>
                      <p>Promedio {criterion.average.toFixed(1)}</p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Ganadores de menciones" description="Desempate adicional y reconocimientos especiales del evento.">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {ranking.mentionResults.map((mention) => (
              <div key={mention.mentionId} className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-4">
                <h3 className="font-serif text-2xl text-stone-900">{mention.name}</h3>
                <div className="mt-3 space-y-2 text-sm text-stone-700">
                  {mention.winners.length ? (
                    mention.winners.map((winner) => (
                      <p key={winner.participantId}>
                        {winner.publicCode} · {winner.totalVotes} votos
                      </p>
                    ))
                  ) : (
                    <p>Sin votos registrados todavia.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}
