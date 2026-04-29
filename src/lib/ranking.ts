export type RankingCriterion = {
  id: string;
  name: string;
  weight: number;
  mainCriterion: boolean;
};

export type RankingParticipant = {
  id: string;
  publicCode: string;
  displayName: string | null;
  productName: string | null;
  visibleToJudges: boolean;
};

export type RankingScore = {
  participantId: string;
  criterionId: string;
  value: number;
};

export type RankingMentionVote = {
  specialMentionId: string;
  participantId: string;
};

export type RankingVote = {
  id: string;
  scores: RankingScore[];
  mentionVotes: RankingMentionVote[];
};

export type RankingMention = {
  id: string;
  name: string;
};

export type RankingEventSnapshot = {
  id: string;
  participants: RankingParticipant[];
  criteria: RankingCriterion[];
  mentions: RankingMention[];
  votes: RankingVote[];
};

export type RankedParticipant = {
  participantId: string;
  publicCode: string;
  displayName: string | null;
  productName: string | null;
  totalScore: number;
  averageScore: number;
  voteCount: number;
  mainCriterionScore: number;
  specialMentionCount: number;
  placement: number;
  tied: boolean;
  criterionBreakdown: Array<{
    criterionId: string;
    name: string;
    total: number;
    average: number;
  }>;
};

export type MentionResult = {
  mentionId: string;
  name: string;
  winners: Array<{
    participantId: string;
    publicCode: string;
    totalVotes: number;
  }>;
};

export type RankingResult = {
  rankedParticipants: RankedParticipant[];
  mentionResults: MentionResult[];
};

export function calculateRankingFromSnapshot(
  event: RankingEventSnapshot,
): RankingResult {
  const criterionById = new Map(event.criteria.map((criterion) => [criterion.id, criterion]));
  const mainCriterion =
    event.criteria.find((criterion) => criterion.mainCriterion) ?? event.criteria[0];

  const rankedParticipants = event.participants
    .map((participant) => {
      const participantScores = event.votes.flatMap((vote) =>
        vote.scores.filter((score) => score.participantId === participant.id),
      );

      const totalScore = participantScores.reduce((sum, score) => {
        const criterion = criterionById.get(score.criterionId);
        return sum + score.value * (criterion?.weight ?? 1);
      }, 0);

      const mainCriterionScore = participantScores
        .filter((score) => score.criterionId === mainCriterion?.id)
        .reduce((sum, score) => sum + score.value * (mainCriterion?.weight ?? 1), 0);

      const specialMentionCount = event.votes.reduce((sum, vote) => {
        return (
          sum +
          vote.mentionVotes.filter((mentionVote) => mentionVote.participantId === participant.id)
            .length
        );
      }, 0);

      const criterionBreakdown = event.criteria.map((criterion) => {
        const criterionScores = participantScores.filter(
          (score) => score.criterionId === criterion.id,
        );
        const total = criterionScores.reduce(
          (sum, score) => sum + score.value * criterion.weight,
          0,
        );

        return {
          criterionId: criterion.id,
          name: criterion.name,
          total,
          average: criterionScores.length ? total / criterionScores.length : 0,
        };
      });

      return {
        participantId: participant.id,
        publicCode: participant.publicCode,
        displayName: participant.displayName,
        productName: participant.productName,
        totalScore,
        averageScore: event.votes.length ? totalScore / event.votes.length : 0,
        voteCount: event.votes.length,
        mainCriterionScore,
        specialMentionCount,
        placement: 0,
        tied: false,
        criterionBreakdown,
      };
    })
    .sort((left, right) => {
      if (right.totalScore !== left.totalScore) {
        return right.totalScore - left.totalScore;
      }

      if (right.mainCriterionScore !== left.mainCriterionScore) {
        return right.mainCriterionScore - left.mainCriterionScore;
      }

      if (right.specialMentionCount !== left.specialMentionCount) {
        return right.specialMentionCount - left.specialMentionCount;
      }

      return left.publicCode.localeCompare(right.publicCode);
    })
    .map((participant, index, collection) => {
      const previous = collection[index - 1];
      const tied =
        Boolean(previous) &&
        previous.totalScore === participant.totalScore &&
        previous.mainCriterionScore === participant.mainCriterionScore &&
        previous.specialMentionCount === participant.specialMentionCount;

      return {
        ...participant,
        placement: tied ? previous.placement : index + 1,
        tied,
      };
    });

  const mentionResults = event.mentions.map((mention) => {
    const totals = new Map<string, number>();

    event.votes.forEach((vote) => {
      vote.mentionVotes
        .filter((mentionVote) => mentionVote.specialMentionId === mention.id)
        .forEach((mentionVote) => {
          totals.set(
            mentionVote.participantId,
            (totals.get(mentionVote.participantId) ?? 0) + 1,
          );
        });
    });

    const highest = Math.max(0, ...totals.values());

    const winners = event.participants
      .filter((participant) => (totals.get(participant.id) ?? 0) === highest && highest > 0)
      .map((participant) => ({
        participantId: participant.id,
        publicCode: participant.publicCode,
        totalVotes: totals.get(participant.id) ?? 0,
      }))
      .sort((left, right) => right.totalVotes - left.totalVotes);

    return {
      mentionId: mention.id,
      name: mention.name,
      winners,
    };
  });

  return { rankedParticipants, mentionResults };
}
