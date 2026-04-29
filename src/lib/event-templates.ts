export const criterionTemplates = {
  comida: [
    { name: "Sabor", minScore: 1, maxScore: 10, weight: 2, required: true, mainCriterion: true },
    { name: "Textura", minScore: 1, maxScore: 5, weight: 1, required: true, mainCriterion: false },
    { name: "Equilibrio", minScore: 1, maxScore: 5, weight: 1, required: true, mainCriterion: false },
    { name: "Presentacion", minScore: 1, maxScore: 5, weight: 1, required: true, mainCriterion: false },
  ],
  bebidas: [
    { name: "Aroma", minScore: 1, maxScore: 10, weight: 1, required: true, mainCriterion: false },
    { name: "Sabor", minScore: 1, maxScore: 10, weight: 2, required: true, mainCriterion: true },
    { name: "Cuerpo", minScore: 1, maxScore: 5, weight: 1, required: true, mainCriterion: false },
    { name: "Final/Persistencia", minScore: 1, maxScore: 5, weight: 1, required: true, mainCriterion: false },
    { name: "Presentacion", minScore: 1, maxScore: 5, weight: 1, required: true, mainCriterion: false },
  ],
  artesanal: [
    { name: "Calidad percibida", minScore: 1, maxScore: 10, weight: 2, required: true, mainCriterion: true },
    { name: "Originalidad", minScore: 1, maxScore: 5, weight: 1, required: true, mainCriterion: false },
    { name: "Presentacion", minScore: 1, maxScore: 5, weight: 1, required: true, mainCriterion: false },
    { name: "Experiencia general", minScore: 1, maxScore: 10, weight: 2, required: true, mainCriterion: false },
  ],
} as const;

export type CriterionTemplateKey = keyof typeof criterionTemplates;

export function getTemplateOptions() {
  return Object.keys(criterionTemplates) as CriterionTemplateKey[];
}
