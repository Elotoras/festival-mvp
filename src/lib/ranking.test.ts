import { describe, expect, it } from "vitest";
import {
  calculateRankingFromSnapshot,
  type RankingEventSnapshot,
} from "./ranking";

function baseEvent(): RankingEventSnapshot {
  return {
    id: "event-1",
    participants: [
      { id: "p1", publicCode: "P1", displayName: null, productName: null, visibleToJudges: false },
      { id: "p2", publicCode: "P2", displayName: null, productName: null, visibleToJudges: false },
      { id: "p3", publicCode: "P3", displayName: null, productName: null, visibleToJudges: false },
    ],
    criteria: [
      { id: "c1", name: "Sabor", weight: 2, mainCriterion: true },
      { id: "c2", name: "Aroma", weight: 1, mainCriterion: false },
    ],
    mentions: [{ id: "m1", name: "Favorito" }],
    votes: [],
  };
}

describe("calculateRankingFromSnapshot", () => {
  it("calcula puntaje ponderado y promedio por participante", () => {
    const event = baseEvent();
    event.votes = [
      {
        id: "v1",
        scores: [
          { participantId: "p1", criterionId: "c1", value: 8 },
          { participantId: "p1", criterionId: "c2", value: 5 },
          { participantId: "p2", criterionId: "c1", value: 7 },
          { participantId: "p2", criterionId: "c2", value: 4 },
        ],
        mentionVotes: [],
      },
      {
        id: "v2",
        scores: [
          { participantId: "p1", criterionId: "c1", value: 9 },
          { participantId: "p1", criterionId: "c2", value: 4 },
          { participantId: "p2", criterionId: "c1", value: 8 },
          { participantId: "p2", criterionId: "c2", value: 4 },
        ],
        mentionVotes: [],
      },
    ];

    const result = calculateRankingFromSnapshot(event);
    const winner = result.rankedParticipants[0];

    expect(winner.publicCode).toBe("P1");
    expect(winner.totalScore).toBe(43);
    expect(winner.averageScore).toBe(21.5);
  });

  it("ordena el ranking por puntaje total", () => {
    const event = baseEvent();
    event.votes = [
      {
        id: "v1",
        scores: [
          { participantId: "p1", criterionId: "c1", value: 6 },
          { participantId: "p1", criterionId: "c2", value: 4 },
          { participantId: "p2", criterionId: "c1", value: 9 },
          { participantId: "p2", criterionId: "c2", value: 4 },
          { participantId: "p3", criterionId: "c1", value: 8 },
          { participantId: "p3", criterionId: "c2", value: 5 },
        ],
        mentionVotes: [],
      },
    ];

    const result = calculateRankingFromSnapshot(event);

    expect(result.rankedParticipants.map((participant) => participant.publicCode)).toEqual([
      "P2",
      "P3",
      "P1",
    ]);
  });

  it("desempata por el criterio principal", () => {
    const event = baseEvent();
    event.votes = [
      {
        id: "v1",
        scores: [
          { participantId: "p1", criterionId: "c1", value: 8 },
          { participantId: "p1", criterionId: "c2", value: 4 },
          { participantId: "p2", criterionId: "c1", value: 7 },
          { participantId: "p2", criterionId: "c2", value: 6 },
        ],
        mentionVotes: [],
      },
    ];

    const result = calculateRankingFromSnapshot(event);

    expect(result.rankedParticipants[0].publicCode).toBe("P1");
    expect(result.rankedParticipants[0].totalScore).toBe(result.rankedParticipants[1].totalScore);
  });

  it("usa las menciones especiales como segundo desempate", () => {
    const event = baseEvent();
    event.votes = [
      {
        id: "v1",
        scores: [
          { participantId: "p1", criterionId: "c1", value: 8 },
          { participantId: "p1", criterionId: "c2", value: 4 },
          { participantId: "p2", criterionId: "c1", value: 8 },
          { participantId: "p2", criterionId: "c2", value: 4 },
        ],
        mentionVotes: [{ specialMentionId: "m1", participantId: "p2" }],
      },
    ];

    const result = calculateRankingFromSnapshot(event);

    expect(result.rankedParticipants[0].publicCode).toBe("P2");
    expect(result.rankedParticipants[0].specialMentionCount).toBe(1);
  });

  it("resume ganadores por mencion especial", () => {
    const event = baseEvent();
    event.votes = [
      {
        id: "v1",
        scores: [],
        mentionVotes: [{ specialMentionId: "m1", participantId: "p3" }],
      },
      {
        id: "v2",
        scores: [],
        mentionVotes: [{ specialMentionId: "m1", participantId: "p3" }],
      },
    ];

    const result = calculateRankingFromSnapshot(event);

    expect(result.mentionResults[0].winners).toEqual([
      { participantId: "p3", publicCode: "P3", totalVotes: 2 },
    ]);
  });
});
