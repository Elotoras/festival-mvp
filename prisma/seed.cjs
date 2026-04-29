require("dotenv/config");
const { PrismaPg } = require("@prisma/adapter-pg");
const { EventStatus, PrismaClient } = require("@prisma/client");

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required.");
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const templates = {
  food: [
    { name: "Sabor", minScore: 1, maxScore: 10, weight: 2, mainCriterion: true },
    { name: "Textura", minScore: 1, maxScore: 5, weight: 1 },
    { name: "Equilibrio", minScore: 1, maxScore: 5, weight: 1 },
    { name: "Presentacion", minScore: 1, maxScore: 5, weight: 1 },
  ],
  beverage: [
    { name: "Aroma", minScore: 1, maxScore: 10, weight: 1 },
    { name: "Sabor", minScore: 1, maxScore: 10, weight: 2, mainCriterion: true },
    { name: "Cuerpo", minScore: 1, maxScore: 5, weight: 1 },
    { name: "Final", minScore: 1, maxScore: 5, weight: 1 },
    { name: "Presentacion", minScore: 1, maxScore: 5, weight: 1 },
  ],
  crafted: [
    { name: "Calidad percibida", minScore: 1, maxScore: 10, weight: 2, mainCriterion: true },
    { name: "Originalidad", minScore: 1, maxScore: 5, weight: 1 },
    { name: "Presentacion", minScore: 1, maxScore: 5, weight: 1 },
    { name: "Experiencia general", minScore: 1, maxScore: 10, weight: 2 },
  ],
};

function buildParticipants(prefix, count, names) {
  return Array.from({ length: count }, (_, index) => ({
    displayName: names[index] ?? `${prefix}${index + 1}`,
    publicCode: `${prefix}${index + 1}`,
    productName: names[index] ?? `Participante ${index + 1}`,
    visibleToJudges: false,
    sortOrder: index,
  }));
}

function createVoteScores(participantIds, criterionIds, matrix) {
  const scores = [];

  participantIds.forEach((participantId, participantIndex) => {
    criterionIds.forEach((criterionId, criterionIndex) => {
      scores.push({
        participantId,
        criterionId,
        value: matrix[participantIndex][criterionIndex],
      });
    });
  });

  return scores;
}

async function seedEvent(params) {
  await prisma.event.deleteMany({ where: { slug: params.slug } });

  const event = await prisma.event.create({
    data: {
      name: params.name,
      slug: params.slug,
      description: params.description,
      category: params.category,
      status: EventStatus.OPEN,
      codePrefix: params.codePrefix,
      itemLabel: params.itemLabel,
      blindTasting: true,
      participants: {
        create: buildParticipants(
          params.codePrefix,
          params.participantNames.length,
          params.participantNames,
        ),
      },
      criteria: {
        create: params.criteria.map((criterion, index) => ({
          ...criterion,
          required: true,
          sortOrder: index,
        })),
      },
      mentions: {
        create: params.mentions.map((name, index) => ({
          name,
          sortOrder: index,
        })),
      },
    },
    include: {
      participants: { orderBy: { sortOrder: "asc" } },
      criteria: { orderBy: { sortOrder: "asc" } },
      mentions: { orderBy: { sortOrder: "asc" } },
    },
  });

  for (const judge of params.judges) {
    await prisma.judgeVote.create({
      data: {
        eventId: event.id,
        judgeName: judge.judgeName,
        scores: {
          create: createVoteScores(
            event.participants.map((participant) => participant.id),
            event.criteria.map((criterion) => criterion.id),
            judge.scores,
          ),
        },
        mentionVotes: {
          create: judge.mentionSelections.map((participantIndex, mentionIndex) => ({
            specialMentionId: event.mentions[mentionIndex].id,
            participantId: event.participants[participantIndex].id,
          })),
        },
      },
    });
  }
}

async function main() {
  await seedEvent({
    name: "Berenjenas al Escabeche",
    slug: "berenjenas-al-escabeche",
    description: "Competencia demo para evaluar preparaciones conservadas.",
    category: "comida",
    codePrefix: "B",
    itemLabel: "preparacion",
    participantNames: [
      "Alma de Huerta",
      "La Feria",
      "Casa Nativa",
      "Cocina de Barrio",
      "Tierra Viva",
      "Proyecto Fuego",
      "Rincon Casero",
      "Sabor Antiguo",
      "La Quinta",
      "Despensa 18",
    ],
    criteria: templates.food,
    mentions: [
      "Favorito del publico",
      "Producto mas memorable",
      "Mejor presentacion",
    ],
    judges: [
      {
        judgeName: "Jurado 1",
        scores: [
          [8, 4, 4, 4],
          [9, 4, 4, 5],
          [7, 3, 4, 4],
          [8, 4, 5, 4],
          [6, 3, 3, 3],
          [9, 5, 5, 5],
          [7, 4, 4, 4],
          [8, 4, 4, 3],
          [6, 3, 4, 3],
          [7, 4, 3, 4],
        ],
        mentionSelections: [5, 1, 5],
      },
      {
        judgeName: "Jurado 2",
        scores: [
          [7, 4, 4, 4],
          [8, 4, 5, 4],
          [7, 4, 4, 4],
          [8, 4, 4, 4],
          [6, 3, 3, 4],
          [10, 5, 5, 5],
          [8, 4, 4, 4],
          [7, 4, 4, 4],
          [6, 3, 3, 3],
          [7, 3, 4, 4],
        ],
        mentionSelections: [5, 3, 1],
      },
      {
        judgeName: "Jurado 3",
        scores: [
          [8, 4, 4, 5],
          [8, 4, 4, 4],
          [7, 4, 4, 4],
          [9, 5, 4, 4],
          [6, 3, 4, 3],
          [9, 5, 5, 5],
          [8, 4, 4, 4],
          [7, 4, 3, 4],
          [6, 3, 3, 4],
          [7, 4, 4, 4],
        ],
        mentionSelections: [5, 0, 5],
      },
    ],
  });

  await seedEvent({
    name: "Cata de Vinos",
    slug: "cata-de-vinos",
    description: "Cata comparativa demo para vinos tintos y blancos.",
    category: "bebida",
    codePrefix: "V",
    itemLabel: "vino",
    participantNames: [
      "Bodega Sur",
      "Valle Nuevo",
      "Montana Roja",
      "Estancia 27",
      "Brisa Alta",
      "Linea Reserva",
    ],
    criteria: templates.beverage,
    mentions: [
      "Favorito del publico",
      "Mejor relacion calidad precio",
    ],
    judges: [
      {
        judgeName: "Sommelier A",
        scores: [
          [8, 8, 4, 4, 4],
          [9, 9, 4, 5, 4],
          [7, 8, 4, 4, 3],
          [8, 7, 3, 4, 4],
          [8, 8, 4, 4, 5],
          [9, 10, 5, 5, 5],
        ],
        mentionSelections: [5, 1],
      },
      {
        judgeName: "Sommelier B",
        scores: [
          [8, 7, 4, 4, 4],
          [9, 8, 4, 5, 4],
          [7, 7, 3, 4, 4],
          [8, 8, 4, 4, 4],
          [9, 8, 4, 4, 5],
          [9, 9, 5, 5, 5],
        ],
        mentionSelections: [4, 5],
      },
      {
        judgeName: "Sommelier C",
        scores: [
          [7, 7, 4, 3, 4],
          [8, 9, 4, 5, 4],
          [7, 8, 4, 4, 4],
          [8, 7, 4, 4, 4],
          [8, 9, 4, 4, 5],
          [10, 10, 5, 5, 5],
        ],
        mentionSelections: [5, 4],
      },
    ],
  });

  await seedEvent({
    name: "Batalla de Helados",
    slug: "batalla-de-helados",
    description: "Comparativa demo de sabores y formulaciones para postres helados.",
    category: "postre",
    codePrefix: "H",
    itemLabel: "helado",
    participantNames: [
      "Crema Pura",
      "Polo Norte",
      "Nube Fria",
      "Laboratorio Dulce",
      "La Gelateria",
      "Barrio Polar",
      "Nata Viva",
      "Taller de Sabores",
    ],
    criteria: templates.crafted,
    mentions: [
      "Favorito del publico",
      "Producto mas memorable",
      "Mejor presentacion",
    ],
    judges: [
      {
        judgeName: "Panel 1",
        scores: [
          [8, 4, 4, 8],
          [7, 4, 4, 7],
          [8, 5, 4, 8],
          [9, 5, 5, 9],
          [8, 4, 5, 8],
          [7, 3, 4, 7],
          [8, 4, 4, 8],
          [9, 5, 5, 9],
        ],
        mentionSelections: [3, 7, 7],
      },
      {
        judgeName: "Panel 2",
        scores: [
          [8, 4, 4, 8],
          [7, 3, 4, 7],
          [8, 4, 4, 8],
          [9, 5, 5, 10],
          [8, 4, 4, 8],
          [7, 4, 4, 7],
          [8, 4, 5, 8],
          [9, 5, 5, 9],
        ],
        mentionSelections: [7, 3, 3],
      },
      {
        judgeName: "Panel 3",
        scores: [
          [8, 4, 4, 8],
          [7, 4, 4, 7],
          [8, 5, 4, 8],
          [10, 5, 5, 10],
          [8, 4, 5, 8],
          [7, 3, 4, 7],
          [8, 4, 4, 8],
          [9, 5, 5, 9],
        ],
        mentionSelections: [3, 7, 3],
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
