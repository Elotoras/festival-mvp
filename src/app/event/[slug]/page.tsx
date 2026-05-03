import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { EventStatus } from "@prisma/client";
import { updateEventStatusAction } from "@/app/actions";
import { AppShell } from "@/components/app-shell";
import { EventNav } from "@/components/event-nav";
import { QrCard } from "@/components/qr-card";
import { SectionCard } from "@/components/section-card";
import { calculateRanking, getEventBySlug } from "@/lib/data";
import { absoluteEventUrl, formatStatus } from "@/lib/utils";

export default async function EventAdminPage({
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
  const voteUrl = absoluteEventUrl(slug, "/vote");

  return (
    <AppShell
      title={event.name}
      description="Panel de administracion del evento."
      actions={
        <Link
          href={`/event/${slug}/vote`}
          className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700"
        >
          Abrir votacion
          <ExternalLink className="h-4 w-4" />
        </Link>
      }
    >
      <EventNav slug={slug} currentPath={`/event/${slug}`} />

      <main className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <SectionCard title="Resumen">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-[1.5rem] border border-stone-200 bg-[linear-gradient(180deg,#fffefb_0%,#f7f0e5_100%)] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Estado</p>
                <p className="mt-2 font-serif text-3xl">{formatStatus(event.status)}</p>
              </div>
              <div className="rounded-[1.5rem] border border-stone-200 bg-white/85 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Participantes</p>
                <p className="mt-2 font-serif text-3xl">{event.participants.length}</p>
              </div>
              <div className="rounded-[1.5rem] border border-stone-200 bg-white/85 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Criterios</p>
                <p className="mt-2 font-serif text-3xl">{event.criteria.length}</p>
              </div>
              <div className="rounded-[1.5rem] border border-stone-200 bg-white/85 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Votos</p>
                <p className="mt-2 font-serif text-3xl">{event._count.votes}</p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <form action={updateEventStatusAction.bind(null, slug, EventStatus.DRAFT)}>
                <button className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50">
                  Dejar en preparacion
                </button>
              </form>
              <form action={updateEventStatusAction.bind(null, slug, EventStatus.OPEN)}>
                <button className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(4,120,87,0.22)]">
                  Abrir votacion
                </button>
              </form>
              <form action={updateEventStatusAction.bind(null, slug, EventStatus.CLOSED)}>
                <button className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(28,25,23,0.18)]">
                  Cerrar votacion
                </button>
              </form>
            </div>
          </SectionCard>

          <SectionCard title="Ranking rapido">
            <div className="grid gap-4 md:grid-cols-3">
              {ranking.rankedParticipants.slice(0, 3).map((participant, index) => (
                <div
                  key={participant.participantId}
                  className={`rounded-[1.75rem] border p-4 ${
                    index === 0
                      ? "border-amber-300 bg-[linear-gradient(160deg,#fff3cf_0%,#f8df9d_100%)]"
                      : index === 1
                        ? "border-slate-200 bg-[linear-gradient(160deg,#f4f6f8_0%,#dfe5ea_100%)]"
                        : "border-orange-200 bg-[linear-gradient(160deg,#fff0e4_0%,#f2cfb5_100%)]"
                  }`}
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-600">
                    {index === 0 ? "1er puesto" : index === 1 ? "2do puesto" : "3er puesto"}
                  </p>
                  <h3 className="mt-2 font-serif text-3xl text-stone-900">
                    {participant.publicCode}
                  </h3>
                  <div className="mt-4 grid gap-2 text-sm">
                    <span className="rounded-2xl bg-white/80 px-3 py-2 font-semibold text-stone-900">
                      Total {participant.totalScore}
                    </span>
                    <span className="rounded-2xl bg-white/70 px-3 py-2 text-stone-700">
                      Promedio {participant.averageScore.toFixed(1)}
                    </span>
                  </div>
                  <p className="mt-3 text-xs text-stone-600">
                    {participant.voteCount} votos registrados
                  </p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard title="Link publico" description="Comparte este acceso con jurados o asistentes del evento.">
            <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-4 text-sm leading-6 text-stone-700">
              {voteUrl}
            </div>
            <div className="mt-4">
              <QrCard url={voteUrl} />
            </div>
          </SectionCard>

          <SectionCard title="Navegacion">
            <div className="grid gap-3">
              {[
                ["Editar evento", `/event/${slug}/edit`],
                ["Participantes", `/event/${slug}/participants`],
                ["Criterios", `/event/${slug}/criteria`],
                ["Menciones", `/event/${slug}/mentions`],
                ["Resultados", `/event/${slug}/results`],
                ["Resultados publicos", `/event/${slug}/public-results`],
              ].map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
                >
                  {label}
                </Link>
              ))}
            </div>
          </SectionCard>
        </div>
      </main>
    </AppShell>
  );
}
