import { create } from "zustand";
import type { Realm } from "../../model/realm";
import type { Quest } from "../../model/quest";
import uid from "../../util/uid";

type QuestState = {
  realms: Realm[];
  selectedRealm: Realm | null;
  selectedQuest: Quest | null;
  selectQuest: (quest: Quest) => void;
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
