"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { EventStatus } from "@prisma/client";
import { ZodError } from "zod";
import { criterionTemplates, type CriterionTemplateKey } from "@/lib/event-templates";
import { prisma } from "@/lib/prisma";
import {
  criterionSchema,
  eventSchema,
  mentionSchema,
  participantSchema,
} from "@/lib/validation";
import { slugify } from "@/lib/utils";

async function ensureUniqueSlug(baseName: string, eventId?: string) {
  const baseSlug = slugify(baseName);
  let candidate = baseSlug;
  let counter = 2;

  while (true) {
    const existing = await prisma.event.findUnique({ where: { slug: candidate } });

    if (!existing || existing.id === eventId) {
      return candidate;
    }

    candidate = `${baseSlug}-${counter}`;
    counter += 1;
  }
}

export async function createEventAction(formData: FormData) {
  const normalizedCodePrefix = String(formData.get("codePrefix") || "PART")
    .trim()
    .toUpperCase();

  let payload;

  try {
    payload = eventSchema.parse({
      name: formData.get("name"),
      description: formData.get("description") || undefined,
      category: formData.get("category"),
      codePrefix: normalizedCodePrefix,
      itemLabel: formData.get("itemLabel"),
      blindTasting: formData.get("blindTasting") === "on",
      status: formData.get("status"),
    });
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error("El prefijo de codigos debe tener entre 1 y 4 caracteres.");
    }

    throw error;
  }

  const slug = await ensureUniqueSlug(payload.name);

  const event = await prisma.event.create({
    data: {
      ...payload,
      slug,
    },
  });

  revalidatePath("/");
  redirect(`/event/${event.slug}`);
}

export async function updateEventAction(slug: string, formData: FormData) {
  const event = await prisma.event.findUnique({ where: { slug } });

  if (!event) {
    throw new Error("Evento no encontrado.");
  }

  const normalizedCodePrefix = String(formData.get("codePrefix") || event.codePrefix)
    .trim()
    .toUpperCase();

  let payload;

  try {
    payload = eventSchema.parse({
      name: formData.get("name"),
      description: formData.get("description") || undefined,
      category: formData.get("category"),
      codePrefix: normalizedCodePrefix,
      itemLabel: formData.get("itemLabel"),
      blindTasting: formData.get("blindTasting") === "on",
      status: formData.get("status"),
    });
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error("El prefijo de codigos debe tener entre 1 y 4 caracteres.");
    }

    throw error;
  }

  const nextSlug = payload.name === event.name ? event.slug : await ensureUniqueSlug(payload.name, event.id);

  await prisma.event.update({
    where: { id: event.id },
    data: {
      ...payload,
      slug: nextSlug,
    },
  });

  revalidatePath("/");
  revalidatePath(`/event/${slug}`);
  if (nextSlug !== slug) {
    redirect(`/event/${nextSlug}`);
  }
}

export async function deleteEventAction(slug: string) {
  await prisma.event.delete({
    where: { slug },
  });

  revalidatePath("/");
  redirect("/");
}

export async function updateEventStatusAction(slug: string, status: EventStatus) {
  await prisma.event.update({
    where: { slug },
    data: { status },
  });

  revalidatePath(`/event/${slug}`);
  revalidatePath(`/event/${slug}/results`);
  revalidatePath(`/event/${slug}/public-results`);
}

export async function addParticipantAction(slug: string, formData: FormData) {
  const event = await prisma.event.findUnique({
    where: { slug },
    include: {
      participants: {
        orderBy: { sortOrder: "desc" },
        take: 1,
      },
    },
  });

  if (!event) {
    throw new Error("Evento no encontrado.");
  }

  const nextIndex = (event.participants[0]?.sortOrder ?? -1) + 1;
  const generatedCode = `${event.codePrefix}${nextIndex + 1}`;
  const rawPublicCode = String(formData.get("publicCode") ?? "").trim().toUpperCase();
  const normalizedPublicCode = rawPublicCode || generatedCode;

  let payload;

  try {
    payload = participantSchema.parse({
      displayName: formData.get("displayName") || undefined,
      publicCode: normalizedPublicCode,
      productName: formData.get("productName") || undefined,
      notes: formData.get("notes") || undefined,
      visibleToJudges: formData.get("visibleToJudges") === "on",
    });
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error("El codigo publico debe tener entre 1 y 12 caracteres.");
    }

    throw error;
  }

  await prisma.participant.create({
    data: {
      ...payload,
      eventId: event.id,
      sortOrder: nextIndex,
    },
  });

  revalidatePath(`/event/${slug}`);
  revalidatePath(`/event/${slug}/participants`);
  revalidatePath(`/event/${slug}/vote`);
}

export async function updateParticipantAction(
  slug: string,
  participantId: string,
  formData: FormData,
) {
  const normalizedPublicCode = String(formData.get("publicCode") ?? "")
    .trim()
    .toUpperCase();

  let payload;

  try {
    payload = participantSchema.parse({
      displayName: formData.get("displayName") || undefined,
      publicCode: normalizedPublicCode,
      productName: formData.get("productName") || undefined,
      notes: formData.get("notes") || undefined,
      visibleToJudges: formData.get("visibleToJudges") === "on",
    });
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error("El codigo publico debe tener entre 1 y 12 caracteres.");
    }

    throw error;
  }

  await prisma.participant.update({
    where: { id: participantId },
    data: payload,
  });

  revalidatePath(`/event/${slug}`);
  revalidatePath(`/event/${slug}/participants`);
  revalidatePath(`/event/${slug}/vote`);
  revalidatePath(`/event/${slug}/results`);
  redirect(`/event/${slug}/participants?updated=${participantId}`);
}

export async function deleteParticipantAction(slug: string, participantId: string) {
  await prisma.participant.delete({
    where: { id: participantId },
  });

  revalidatePath(`/event/${slug}`);
  revalidatePath(`/event/${slug}/participants`);
  revalidatePath(`/event/${slug}/vote`);
  revalidatePath(`/event/${slug}/results`);
}

export async function addCriterionAction(slug: string, formData: FormData) {
  const rawName = String(formData.get("name") ?? "").trim();

  if (!rawName) {
    revalidatePath(`/event/${slug}/criteria`);
    return;
  }

  const event = await prisma.event.findUnique({
    where: { slug },
    include: {
      criteria: {
        orderBy: { sortOrder: "desc" },
        take: 1,
      },
    },
  });

  if (!event) {
    throw new Error("Evento no encontrado.");
  }

  const payload = criterionSchema.parse({
    name: rawName,
    description: formData.get("description") || undefined,
    minScore: formData.get("minScore"),
    maxScore: formData.get("maxScore"),
    weight: formData.get("weight"),
    required: formData.get("required") === "on",
    mainCriterion: formData.get("mainCriterion") === "on",
  });

  if (payload.mainCriterion) {
    await prisma.evaluationCriterion.updateMany({
      where: { eventId: event.id },
      data: { mainCriterion: false },
    });
  }

  await prisma.evaluationCriterion.create({
    data: {
      ...payload,
      eventId: event.id,
      sortOrder: (event.criteria[0]?.sortOrder ?? -1) + 1,
    },
  });

  revalidatePath(`/event/${slug}`);
  revalidatePath(`/event/${slug}/criteria`);
  revalidatePath(`/event/${slug}/vote`);
  revalidatePath(`/event/${slug}/results`);
}

export async function updateCriterionAction(
  slug: string,
  criterionId: string,
  formData: FormData,
) {
  const payload = criterionSchema.parse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    minScore: formData.get("minScore"),
    maxScore: formData.get("maxScore"),
    weight: formData.get("weight"),
    required: formData.get("required") === "on",
    mainCriterion: formData.get("mainCriterion") === "on",
  });

  const criterion = await prisma.evaluationCriterion.findUnique({
    where: { id: criterionId },
  });

  if (!criterion) {
    throw new Error("Criterio no encontrado.");
  }

  if (payload.mainCriterion) {
    await prisma.evaluationCriterion.updateMany({
      where: { eventId: criterion.eventId },
      data: { mainCriterion: false },
    });
  }

  await prisma.evaluationCriterion.update({
    where: { id: criterionId },
    data: payload,
  });

  revalidatePath(`/event/${slug}`);
  revalidatePath(`/event/${slug}/criteria`);
  revalidatePath(`/event/${slug}/vote`);
  revalidatePath(`/event/${slug}/results`);
}

export async function deleteCriterionAction(slug: string, criterionId: string) {
  await prisma.evaluationCriterion.delete({
    where: { id: criterionId },
  });

  revalidatePath(`/event/${slug}`);
  revalidatePath(`/event/${slug}/criteria`);
  revalidatePath(`/event/${slug}/vote`);
  revalidatePath(`/event/${slug}/results`);
}

export async function applyCriterionTemplateAction(
  slug: string,
  templateKey: CriterionTemplateKey,
) {
  const event = await prisma.event.findUnique({ where: { slug } });

  if (!event) {
    throw new Error("Evento no encontrado.");
  }

  await prisma.evaluationCriterion.deleteMany({
    where: { eventId: event.id },
  });

  await prisma.evaluationCriterion.createMany({
    data: criterionTemplates[templateKey].map((criterion, index) => ({
      eventId: event.id,
      sortOrder: index,
      ...criterion,
    })),
  });

  revalidatePath(`/event/${slug}`);
  revalidatePath(`/event/${slug}/criteria`);
  revalidatePath(`/event/${slug}/vote`);
  revalidatePath(`/event/${slug}/results`);
}

export async function addMentionAction(slug: string, formData: FormData) {
  const event = await prisma.event.findUnique({
    where: { slug },
    include: {
      mentions: {
        orderBy: { sortOrder: "desc" },
        take: 1,
      },
    },
  });

  if (!event) {
    throw new Error("Evento no encontrado.");
  }

  const payload = mentionSchema.parse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
  });

  await prisma.specialMention.create({
    data: {
      ...payload,
      eventId: event.id,
      sortOrder: (event.mentions[0]?.sortOrder ?? -1) + 1,
    },
  });

  revalidatePath(`/event/${slug}`);
  revalidatePath(`/event/${slug}/mentions`);
  revalidatePath(`/event/${slug}/vote`);
  revalidatePath(`/event/${slug}/results`);
}

export async function updateMentionAction(
  slug: string,
  mentionId: string,
  formData: FormData,
) {
  const payload = mentionSchema.parse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
  });

  await prisma.specialMention.update({
    where: { id: mentionId },
    data: payload,
  });

  revalidatePath(`/event/${slug}`);
  revalidatePath(`/event/${slug}/mentions`);
  revalidatePath(`/event/${slug}/vote`);
  revalidatePath(`/event/${slug}/results`);
}

export async function deleteMentionAction(slug: string, mentionId: string) {
  await prisma.specialMention.delete({
    where: { id: mentionId },
  });

  revalidatePath(`/event/${slug}`);
  revalidatePath(`/event/${slug}/mentions`);
  revalidatePath(`/event/${slug}/vote`);
  revalidatePath(`/event/${slug}/results`);
}
