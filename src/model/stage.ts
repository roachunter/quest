export type Stage = {
  id: string;
  description: string;
  state: StageState;
};

export type StageState = "current" | "completed" | "prepared";
