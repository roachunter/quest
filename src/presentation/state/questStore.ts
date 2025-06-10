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
  addQuest: (realmId: string, title: string) => void;
  addStage: (description: string) => void;
};

const useQuestStore = create<QuestState>()(
  // Bug in zustand/middleware/immer module causes type error
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  immer((set) => ({
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
    addQuest: (realmId, title) =>
      set((state) => {
        const realm = state.realms.find((r) => r.id == realmId);
        if (!realm) {
          return;
        }

        realm.quests.push({
          id: uid(),
          realmId: realm.id,
          title: title,
          description: "",
          stages: [],
        });
      }),
    addStage: (description) =>
      set((state) => {
        const realm = state.realms.find((r) => r.id == state.selectedRealm?.id);
        if (!realm) return;

        const quest = realm.quests.find((q) => q.id == state.selectedQuest?.id);
        if (!quest) return;

        const newStage: Stage = {
          id: uid(),
          description: description,
          state: quest.stages.length > 0 ? "prepared" : "current",
        };

        quest.stages.push(newStage);

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
              state: "current",
            },
            {
              id: uid(),
              description:
                "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Perspiciatis, quaerat.",
              state: "prepared",
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
              state: "completed",
            },
          ],
        })),
    }));
}
