import type { Stage } from "./stage";

export type Quest = {
  id: string;
  title: string;
  description: string;
  stages: Stage[];
};
