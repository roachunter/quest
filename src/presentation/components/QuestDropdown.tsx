import type { Quest } from "../../model/quest";
import type { Realm } from "../../model/realm";
import QuestDropdownItem from "./QuestDropdownItem";
import "./styles/QuestDropdown.css";

type Props = {
  realm: Realm;
  selectedQuest: Quest | null;
  onQuestClick: (quest: Quest) => void;
};

const QuestDropdown = ({ realm, selectedQuest, onQuestClick }: Props) => {
  return (
    <div className="dropdown-container">
      <details>
        <summary className="ticket-container-dark">{realm.title}</summary>
        <div className="dropdown-content">
          {realm.quests.map((quest) => {
            return (
              <QuestDropdownItem
                key={`${quest.title}-${selectedQuest == quest}`} // TODO: add id to quests
                quest={quest}
                realmTitle={realm.title}
                selected={selectedQuest == quest}
                onClick={onQuestClick}
              />
            );
          })}
        </div>
      </details>
    </div>
  );
};
export default QuestDropdown;
