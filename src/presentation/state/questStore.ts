import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { Realm } from "../../model/realm";
import type { Quest } from "../../model/quest";
import uid from "../../util/uid";
import type { Stage } from "../../model/stage";

type QuestState = {
  realms: Realm[];
  selectedRealm: Realm | null;
  selectedQuest: Quest | null;
  selectQuest: (quest: Quest) => void;
  addQuest: (
    realmId: string,
    title: string,
    stageDescriptions: string[]
  ) => void;
  editQuest: (
    realmId?: string,
    title?: string,
    stageDescriptions?: string[]
  ) => void;
  nextStage: () => void;
  previousStage: () => void;
};

const useQuestStore = create<QuestState>()(
  immer<QuestState>((set) => ({
    realms: generateTestRealms(),
    selectedRealm: null,
    selectedQuest: null,
    selectQuest: (quest) =>
      set((state) => {
        const parentRealm = state.realms.find(
          (realm) => realm.id == quest.realmId
        );

        return {
          selectedRealm: parentRealm,
          selectedQuest: quest,
        };
      }),
    addQuest: (realmId, title, stageDescriptions) =>
      set((state) => {
        const realm = state.realms.find((r) => r.id == realmId);
        if (!realm) {
          return;
        }

        const stages: Stage[] = stageDescriptions.map((desc) => ({
          id: uid(),
          description: desc,
          state: "prepared",
        }));
        if (stages.length > 0) {
          stages[0].state = "current";
        }

        const quest: Quest = {
          id: uid(),
          realmId: realm.id,
          title: title,
          description: "",
          stages: stages,
        };

        realm.quests.push(quest);
      }),
    editQuest: (realmId, title, stageDescriptions) =>
      set((state) => {
        const selectedQuest = state.selectedQuest;
        if (!selectedQuest) return;

        const realm = state.realms.find((r) => r.id == selectedQuest.realmId);
        if (!realm) return;

        const questIdx = realm.quests.findIndex(
          (q) => q.id == selectedQuest.id
        );
        if (questIdx < 0) return;

        const quest = realm.quests[questIdx];

        if (title && title != quest.title) {
          quest.title = title;
        }

        if (stageDescriptions) {
          const oldStages = quest.stages;

          quest.stages = stageDescriptions.map((desc) => ({
            id: uid(),
            description: desc,
            state: "prepared",
          }));

          for (let i = 0; i < oldStages.length; i++) {
            if (
              oldStages[i].description == quest.stages[i].description &&
              oldStages[i].state == "completed"
            ) {
              quest.stages[i].state = "completed";
            } else {
              quest.stages[i].state = "current";
              break;
            }
          }
        }

        if (realmId && realmId != quest.realmId) {
          const newRealm = state.realms.find((r) => r.id == realmId);
          if (newRealm) {
            quest.realmId = realmId;

            realm.quests.splice(questIdx, 1);
            newRealm.quests.push(quest);
            state.selectedRealm = newRealm;
          }
        }

        state.selectedQuest = quest;
      }),
    nextStage: () =>
      set((state) => {
        const realm = state.realms.find((r) => r.id == state.selectedRealm?.id);
        if (!realm) return;

        const quest = realm.quests.find((q) => q.id == state.selectedQuest?.id);
        if (!quest) return;

        const currentStageIdx = quest.stages.findIndex(
          (s) => s.state == "current"
        );
        if (currentStageIdx < 0) return;

        const currentStage = quest.stages[currentStageIdx];
        currentStage.state = "completed";

        const nextStage = quest.stages[currentStageIdx + 1];
        if (nextStage) {
          nextStage.state = "current";
        }

        state.selectedQuest = quest;
      }),
    previousStage: () =>
      set((state) => {
        const realm = state.realms.find((r) => r.id == state.selectedRealm?.id);
        if (!realm) return;

        const quest = realm.quests.find((q) => q.id == state.selectedQuest?.id);
        if (!quest) return;

        if (quest.stages.length == 0) return;

        const currentStageIdx = quest.stages.findIndex(
          (s) => s.state == "current"
        );

        if (currentStageIdx < 0) {
          const lastStage = quest.stages[quest.stages.length - 1];
          lastStage.state = "current";
        } else if (currentStageIdx == 0) {
          return;
        } else {
          const currentStage = quest.stages[currentStageIdx];
          currentStage.state = "prepared";
          const previousStage = quest.stages[currentStageIdx - 1];
          previousStage.state = "current";
        }

        state.selectedQuest = quest;
      }),
  }))
);
export default useQuestStore;

function generateTestRealms(): Realm[] {
  return Array(3)
    .fill(null)
    .map((_, index) => ({
      id: uid(),
      title: `Realm #${index + 1}`,
      quests: [],
    }))
    .map((realm) => ({
      ...realm,
      quests: Array(3)
        .fill(null)
        .map((_, index) => ({
          id: uid(),
          realmId: realm.id,
          title: `Quest #${index + 1}`,
          description:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officiis, rem ad? Perferendis culpa assumenda ipsam et quasi? Nesciunt explicabo temporibus cumque iusto repellat quaerat aspernatur eligendi! Animi, aut odit? Deserunt quae corrupti perferendis aspernatur sint atque mollitia distinctio magnam, beatae vero in, incidunt at ipsam quaerat iure dolorem aliquid nesciunt quasi doloribus? Pariatur numquam voluptas suscipit facere voluptate fugiat accusamus.\nLorem ipsum dolor sit, amet consectetur adipisicing elit. Quod nostrum vel facere pariatur facilis itaque voluptatibus fuga tempore voluptate. Ex eveniet nesciunt veritatis nisi doloremque similique consequatur maxime voluptatum, molestias doloribus velit ducimus blanditiis deleniti placeat temporibus. A, quos nisi! Odio aperiam, deleniti sapiente earum tenetur ad eius necessitatibus cum! Odio eligendi molestiae perspiciatis excepturi magni, distinctio incidunt. Sint consequatur, deleniti nihil cum laborum atque ipsa pariatur minima tenetur dicta quos nemo, eligendi expedita. Expedita culpa quidem nesciunt inventore cupiditate.\nLorem ipsum dolor sit amet, consectetur adipisicing elit. Officiis, rem ad? Perferendis culpa assumenda ipsam et quasi? Nesciunt explicabo temporibus cumque iusto repellat quaerat aspernatur eligendi! Animi, aut odit? Deserunt quae corrupti perferendis aspernatur sint atque mollitia distinctio magnam, beatae vero in, incidunt at ipsam quaerat iure dolorem aliquid nesciunt quasi doloribus? Pariatur numquam voluptas suscipit facere voluptate fugiat accusamus.\nLorem ipsum dolor sit, amet consectetur adipisicing elit. Quod nostrum vel facere pariatur facilis itaque voluptatibus fuga tempore voluptate. Ex eveniet nesciunt veritatis nisi doloremque similique consequatur maxime voluptatum, molestias doloribus velit ducimus blanditiis deleniti placeat temporibus. A, quos nisi! Odio aperiam, deleniti sapiente earum tenetur ad eius necessitatibus cum! Odio eligendi molestiae perspiciatis excepturi magni, distinctio incidunt. Sint consequatur, deleniti nihil cum laborum atque ipsa pariatur minima tenetur dicta quos nemo, eligendi expedita. Expedita culpa quidem nesciunt inventore cupiditate.",
          stages: [
            {
              id: uid(),
              description:
                "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Animi.",
              state: "completed",
            },
            {
              id: uid(),
              description:
                "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Perspiciatis, quaerat.",
              state: "current",
            },
            {
              id: uid(),
              description: "Lorem ipsum dolor sit amet.",
              state: "prepared",
            },
            {
              id: uid(),
              description:
                "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
              state: "prepared",
            },
          ],
        })),
    }));
}
