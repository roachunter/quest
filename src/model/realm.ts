import type { Quest } from "./quest";

export type Realm = {
  id: string;
  title: string;
  quests: Quest[];
};
