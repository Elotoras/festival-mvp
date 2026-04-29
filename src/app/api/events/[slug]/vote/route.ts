import { NextResponse } from "next/server";
import { EventStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type Payload = {
  eventId: string;
  judgeName?: string;
  deviceFingerprint?: string;
  scores: Array<{
    participantId: string;
    criterionId: string;
    value: number;
  }>;
  mentions: Array<{
    specialMentionId: string;
    participantId: string;
  }>;
};

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const payload = (await request.json()) as Payload;

  const event = await prisma.event.findUnique({
    where: { slug },
    include: {
      criteria: true,
      participants: true,
      mentions: true,
    },
  });

  if (!event || event.id !== payload.eventId) {
    return NextResponse.json({ error: "Evento no encontrado." }, { status: 404 });
  }

  if (event.status !== EventStatus.OPEN) {
    return NextResponse.json({ error: "La votacion no esta abierta." }, { status: 400 });
  }

  const requiredScores = event.participants.length * event.criteria.filter((criterion) => criterion.required).length;

  if (payload.scores.length < requiredScores) {
    return NextResponse.json({ error: "Faltan puntajes requeridos." }, { status: 400 });
  }

  await prisma.judgeVote.create({
    data: {
      eventId: event.id,
      judgeName: payload.judgeName,
      deviceFingerprint: payload.deviceFingerprint,
      scores: {
        create: payload.scores,
      },
      mentionVotes: {
        create: payload.mentions,
      },
    },
  });

  return NextResponse.json({ ok: true });
}
