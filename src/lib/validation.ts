import { z } from "zod";

export const eventSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  category: z.string().min(2),
  codePrefix: z.string().min(1).max(4),
  itemLabel: z.string().min(2).max(40),
  blindTasting: z.boolean().default(true),
  status: z.enum(["DRAFT", "OPEN", "CLOSED"]),
});

export const participantSchema = z.object({
  displayName: z.string().optional(),
  publicCode: z.string().min(1).max(12),
  productName: z.string().optional(),
  notes: z.string().optional(),
  visibleToJudges: z.boolean().default(false),
});

export const criterionSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  minScore: z.coerce.number().int().min(0),
  maxScore: z.coerce.number().int().min(1),
  weight: z.coerce.number().int().min(1).max(10),
  required: z.boolean().default(true),
  mainCriterion: z.boolean().default(false),
});

export const mentionSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
});
