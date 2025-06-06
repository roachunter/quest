import type { Quest } from "../../model/quest";
import type { Realm } from "../../model/realm";
import QuestDescription from "../components/QuestDescription";
import QuestDropdowns from "../components/QuestDropdowns";
import QuestStages from "../components/QuestStages";
import useQuestStore from "../state/questStore";
import "./styles/QuestsPane.css";

const QuestsPane = () => {
  const { realms, selectedRealm, selectedQuest, selectRealm, selectQuest } =
    useQuestStore();

  const handleQuestClick = (realm: Realm, quest: Quest) => {
    selectRealm(realm);
    selectQuest(quest);
  };

  return (
    <div className="quest-pane">
      <section className="ticket-border-gradient">
        <QuestDropdowns
          realms={realms}
          selectedQuest={selectedQuest}
          onQuestClick={(realm, quest) => handleQuestClick(realm, quest)}
        />
      </section>
      <section className="ticket-border-gradient">
        {selectedQuest && selectedRealm && (
          <QuestStages quest={selectedQuest} realmTitle={selectedRealm.title} />
        )}
      </section>
      <section className="ticket-border-gradient">
        <QuestDescription quest={selectedQuest} />
      </section>
    </div>
  );
};
export default QuestsPane;
