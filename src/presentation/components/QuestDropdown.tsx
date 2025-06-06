import type { Realm } from "../../model/realm";
import useQuestStore from "../state/questStore";
import QuestDropdownItem from "./QuestDropdownItem";
import "./styles/QuestDropdown.css";

type Props = {
  realm: Realm;
};

const QuestDropdown = ({ realm }: Props) => {
  const selectedQuest = useQuestStore((state) => state.selectedQuest);

  return (
    <div className="dropdown-container">
      <details>
        <summary className="ticket-container-dark">{realm.title}</summary>
        <div className="dropdown-content">
          {realm.quests.map((quest) => {
            return (
              <QuestDropdownItem
                key={quest.id}
                quest={quest}
                realmTitle={realm.title}
                selected={selectedQuest?.id == quest.id}
              />
            );
          })}
        </div>
      </details>
    </div>
  );
};
export default QuestDropdown;
