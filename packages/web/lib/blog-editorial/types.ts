export type EditorialStory = {
  slug: string;
  title: string;
  summary: string;
  opening: string;
  example: string;
  steps: [string, string, string];
  caution: string;
  exercise: string;
};

export type EditorialSeries = {
  id: string;
  title: string;
  href: string;
  section: "Fundamentos e investigação" | "Ferramentas e técnicas" | "Colaboração e carreira" | "Percursos por Labs";
  color: string;
  stories: [EditorialStory, EditorialStory, EditorialStory];
  source?: { label: string; href: string };
};
