import { create } from "zustand";
import type { Realm } from "../../model/realm";
import type { Quest } from "../../model/quest";
import uid from "../../util/uid";
import type { Stage } from "../../model/stage";

type QuestState = {
  realms: Realm[];
  selectedRealm: Realm | null;
  selectedQuest: Quest | null;
  selectQuest: (quest: Quest) => void;
  addQuest: (realm: Realm, title: string) => void;
  addStage: (description: string) => void;
};

const useQuestStore = create<QuestState>((set) => ({
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
  addQuest: (realm, title) =>
    set((state) => {
      const oldRealms = [...state.realms];
      const oldRealmIdx = oldRealms.findIndex((r) => r.id == realm.id);
      if (oldRealmIdx < 0) {
        return {};
      }
      const oldRealm = oldRealms[oldRealmIdx];

      const newQuest: Quest = {
        id: uid(),
        realmId: oldRealm.id,
        title: title,
        description: "",
        stages: [],
      };

      const updatedRealm: Realm = {
        ...oldRealm,
        quests: [...oldRealm.quests, newQuest],
      };

      const updatedRealms = [...oldRealms];
      updatedRealms.splice(oldRealmIdx, 1, updatedRealm);

      return {
        realms: updatedRealms,
      };
    }),
  addStage: (description) =>
    set((state) => {
      const oldRealms = state.realms;
      const oldRealm = state.selectedRealm;
      const oldQuest = state.selectedQuest;
      if (!oldRealm || !oldQuest) {
        return {};
      }

      const newStage: Stage = {
        id: uid(),
        description: description,
        state: (() => {
          if (oldQuest.stages.length > 0) {
            return "prepared";
          } else return "current";
        })(),
      };

      const updatedStages = [...oldQuest.stages, newStage];
      const updatedQuest: Quest = {
        ...oldQuest,
        stages: updatedStages,
      };
      const updatedQuests = [...oldRealm.quests];
      const updatedQuestIdx = oldRealm.quests.findIndex(
        (quest) => quest.id == updatedQuest.id
      );
      updatedQuests.splice(updatedQuestIdx, 1, updatedQuest);
      const updatedRealm: Realm = {
        ...oldRealm,
        quests: updatedQuests,
      };

      const updatedRealmIdx = oldRealms.findIndex(
        (realm) => realm.id == updatedRealm.id
      );
      const updatedRealms = [...oldRealms];
      updatedRealms.splice(updatedRealmIdx, 1, updatedRealm);

      return {
        realms: updatedRealms,
        selectedRealm: updatedRealm,
        selectedQuest: updatedQuest,
      };
    }),
}));
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
