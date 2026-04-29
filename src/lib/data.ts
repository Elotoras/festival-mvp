import { cache } from "react";
import { EventStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  calculateRankingFromSnapshot,
  type RankingEventSnapshot,
} from "@/lib/ranking";

export const getEvents = cache(async () => {
  return prisma.event.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          participants: true,
          votes: true,
        },
      },
    },
  });
});

export const getEventBySlug = cache(async (slug: string) => {
  return prisma.event.findUnique({
    where: { slug },
    include: {
      participants: { orderBy: { sortOrder: "asc" } },
      criteria: { orderBy: { sortOrder: "asc" } },
      mentions: { orderBy: { sortOrder: "asc" } },
      _count: {
        select: {
          votes: true,
        },
      },
    },
  });
});

export async function getEventSnapshot(slug: string): Promise<RankingEventSnapshot | null> {
  const event = await prisma.event.findUnique({
    where: { slug },
    include: {
      participants: { orderBy: { sortOrder: "asc" } },
      criteria: { orderBy: { sortOrder: "asc" } },
      mentions: { orderBy: { sortOrder: "asc" } },
      votes: {
        include: {
          scores: true,
          mentionVotes: true,
        },
      },
    },
  });

  if (!event) {
    return null;
  }

  return {
    id: event.id,
    participants: event.participants.map((participant) => ({
      id: participant.id,
      publicCode: participant.publicCode,
      displayName: participant.displayName,
      productName: participant.productName,
      visibleToJudges: participant.visibleToJudges,
    })),
    criteria: event.criteria.map((criterion) => ({
      id: criterion.id,
      name: criterion.name,
      weight: criterion.weight,
      mainCriterion: criterion.mainCriterion,
    })),
    mentions: event.mentions.map((mention) => ({
      id: mention.id,
      name: mention.name,
    })),
    votes: event.votes.map((vote) => ({
      id: vote.id,
      scores: vote.scores.map((score) => ({
        participantId: score.participantId,
        criterionId: score.criterionId,
        value: score.value,
      })),
      mentionVotes: vote.mentionVotes.map((mentionVote) => ({
        specialMentionId: mentionVote.specialMentionId,
        participantId: mentionVote.participantId,
      })),
    })),
  };
}

export async function calculateRanking(eventId: string) {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { slug: true },
  });

  if (!event) {
    throw new Error("Evento no encontrado.");
  }

  const snapshot = await getEventSnapshot(event.slug);

  if (!snapshot) {
    throw new Error("No se pudo cargar el evento.");
  }

  return calculateRankingFromSnapshot(snapshot);
}

export function isVotingOpen(status: EventStatus) {
  return status === EventStatus.OPEN;
}
