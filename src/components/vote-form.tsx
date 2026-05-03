"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type VoteFormProps = {
  eventId: string;
  slug: string;
  eventName: string;
  itemLabel: string;
  blindTasting: boolean;
  participants: Array<{
    id: string;
    publicCode: string;
    displayName: string | null;
    productName: string | null;
    visibleToJudges: boolean;
  }>;
  criteria: Array<{
    id: string;
    name: string;
    description: string | null;
    minScore: number;
    maxScore: number;
    required: boolean;
  }>;
  mentions: Array<{
    id: string;
    name: string;
  }>;
  alreadyVoted: boolean;
};

export function VoteForm({
  eventId,
  slug,
  eventName,
  itemLabel,
  blindTasting,
  participants,
  criteria,
  mentions,
  alreadyVoted,
}: VoteFormProps) {
  const router = useRouter();
  const [judgeName, setJudgeName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [seenPreviousVote] = useState(() => {
    if (typeof window === "undefined") {
      return alreadyVoted;
    }

    return window.localStorage.getItem(`vote:${slug}:submitted`) === "true" || alreadyVoted;
  });
  const [scores, setScores] = useState<Record<string, number>>({});
  const [mentionsState, setMentionsState] = useState<Record<string, string>>({});

  const missingRequired = useMemo(() => {
    return participants.some((participant) =>
      criteria.some(
        (criterion) =>
          criterion.required &&
          scores[`${participant.id}:${criterion.id}`] === undefined,
      ),
    );
  }, [criteria, participants, scores]);

  const totalFields = participants.length * criteria.length;
  const completedFields = Object.keys(scores).length;
  const progressPercent = totalFields ? Math.round((completedFields / totalFields) * 100) : 0;
  const participantProgress = participants.map((participant) => {
    const completed = criteria.filter(
      (criterion) => scores[`${participant.id}:${criterion.id}`] !== undefined,
    ).length;

    return {
      participantId: participant.id,
      completed,
      total: criteria.length,
      done: completed === criteria.length,
    };
  });

  async function handleSubmit() {
    setError(null);

    if (missingRequired) {
      setError("Completa todos los criterios antes de enviar.");
      return;
    }

    setSubmitting(true);

    try {
      const existingFingerprint = window.localStorage.getItem(`vote:${slug}:fingerprint`);
      const fingerprint = existingFingerprint ?? crypto.randomUUID();

      const response = await fetch(`/api/events/${slug}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId,
          judgeName: judgeName || undefined,
          deviceFingerprint: fingerprint,
          scores: Object.entries(scores).map(([key, value]) => {
            const [participantId, criterionId] = key.split(":");
            return { participantId, criterionId, value };
          }),
          mentions: Object.entries(mentionsState)
            .filter(([, participantId]) => participantId)
            .map(([specialMentionId, participantId]) => ({
              specialMentionId,
              participantId,
            })),
        }),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? "No se pudo registrar el voto.");
      }

      window.localStorage.setItem(`vote:${slug}:fingerprint`, fingerprint);
      window.localStorage.setItem(`vote:${slug}:submitted`, "true");
      setSubmitted(true);
      router.refresh();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "No se pudo registrar el voto.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-[1.5rem] border border-emerald-300 bg-emerald-50 p-5 text-emerald-900">
        <h2 className="font-serif text-2xl">Voto enviado</h2>
        <p className="mt-2 text-sm">
          Tu evaluacion para {eventName} quedo registrada correctamente.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {seenPreviousVote ? (
        <div className="rounded-[1.5rem] border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          Este dispositivo ya voto antes. Igual podes reenviar si queres corregir una carga.
        </div>
      ) : null}

      <div className="sticky top-3 z-20 rounded-[1.75rem] border border-white/80 bg-white/95 p-4 shadow-[0_14px_34px_rgba(65,45,27,0.10)] backdrop-blur">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex-1">
            <label className="text-sm font-medium text-stone-700">Nombre del jurado (opcional)</label>
            <input
              value={judgeName}
              onChange={(event) => setJudgeName(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-amber-600"
              placeholder="Ej. Mesa 2"
            />
          </div>
          <div className="min-w-[12rem] rounded-2xl border border-stone-200 bg-[linear-gradient(180deg,#fffefb_0%,#f5eee3_100%)] px-4 py-3">
            <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Progreso</p>
            <p className="mt-1 text-sm font-semibold text-stone-900">
              {completedFields}/{totalFields} puntajes
            </p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-stone-200">
              <div
                className="h-full rounded-full bg-amber-600 transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {participants.map((participant) => {
            const progress = participantProgress.find(
              (item) => item.participantId === participant.id,
            );

            return (
              <div
                key={participant.id}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  progress?.done
                    ? "bg-emerald-100 text-emerald-900"
                    : "bg-stone-100 text-stone-600"
                }`}
              >
                {participant.publicCode}{" "}
                {progress?.done ? "completo" : `${progress?.completed}/${progress?.total}`}
              </div>
            );
          })}
        </div>
      </div>

      {participants.map((participant) => {
        const progress = participantProgress.find(
          (item) => item.participantId === participant.id,
        );

        return (
          <section
            key={participant.id}
            className="rounded-[1.75rem] border border-white/90 bg-white/92 p-4 shadow-[0_12px_30px_rgba(66,49,32,0.08)]"
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-stone-500">{itemLabel}</p>
                <h2 className="font-serif text-2xl text-stone-900">{participant.publicCode}</h2>
              </div>
              <div className="ml-auto flex items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    progress?.done
                      ? "bg-emerald-100 text-emerald-900"
                      : "bg-stone-100 text-stone-500"
                  }`}
                >
                  {progress?.done ? "Completo" : "Pendiente"}
                </span>
                {!blindTasting && participant.visibleToJudges ? (
                  <p className="max-w-[12rem] text-right text-sm leading-6 text-stone-600">
                    {participant.productName ?? participant.displayName}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="space-y-4">
              {criteria.map((criterion) => {
                const fieldKey = `${participant.id}:${criterion.id}`;

                return (
                  <div
                    key={criterion.id}
                    className="rounded-2xl border border-stone-200 bg-[linear-gradient(180deg,#fffefb_0%,#f7f1e7_100%)] p-4"
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div>
                        <h3 className="font-medium text-stone-900">{criterion.name}</h3>
                        {criterion.description ? (
                          <p className="text-xs leading-5 text-stone-500">{criterion.description}</p>
                        ) : null}
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-stone-700">
                        {scores[fieldKey] ?? "-"}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {Array.from(
                        { length: criterion.maxScore - criterion.minScore + 1 },
                        (_, index) => criterion.minScore + index,
                      ).map((value) => {
                        const selected = scores[fieldKey] === value;

                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() =>
                              setScores((current) => ({
                                ...current,
                                [fieldKey]: value,
                              }))
                            }
                            className={`min-w-10 rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                              selected
                                ? "border-amber-700 bg-amber-700 text-white"
                                : "border-stone-300 bg-white text-stone-700 hover:border-stone-500"
                            }`}
                          >
                            {value}
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-2 flex justify-between text-xs text-stone-500">
                      <span>Min {criterion.minScore}</span>
                      <span>Max {criterion.maxScore}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      {mentions.length ? (
        <section className="rounded-[1.75rem] border border-white/90 bg-white/92 p-4 shadow-[0_12px_30px_rgba(66,49,32,0.08)]">
          <h2 className="font-serif text-2xl text-stone-900">Menciones especiales</h2>
          <div className="mt-4 space-y-4">
            {mentions.map((mention) => (
              <div key={mention.id}>
                <label className="mb-2 block text-sm font-medium text-stone-700">{mention.name}</label>
                <select
                  value={mentionsState[mention.id] ?? ""}
                  onChange={(event) =>
                    setMentionsState((current) => ({
                      ...current,
                      [mention.id]: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-amber-600"
                >
                  <option value="">Seleccionar</option>
                  {participants.map((participant) => (
                    <option key={participant.id} value={participant.id}>
                      {participant.publicCode}
                      {!blindTasting && participant.visibleToJudges && participant.productName
                        ? ` - ${participant.productName}`
                        : ""}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {error ? (
        <div className="rounded-[1.5rem] border border-rose-300 bg-rose-50 p-4 text-sm leading-6 text-rose-800">
          {error}
        </div>
      ) : null}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting}
        className="sticky bottom-3 w-full rounded-full bg-stone-900 px-6 py-4 text-base font-semibold text-white shadow-[0_16px_32px_rgba(28,25,23,0.2)] transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:bg-stone-400"
      >
        {submitting ? "Enviando voto..." : "Enviar voto"}
      </button>
    </div>
  );
}
