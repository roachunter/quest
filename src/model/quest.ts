import type { Stage } from "./stage";

export type Quest = {
  id: string;
  realmId: string;
  title: string;
  description: string;
  stages: Stage[];
};
