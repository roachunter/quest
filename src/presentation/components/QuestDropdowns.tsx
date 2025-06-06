import type { Quest } from "../../model/quest";
import type { Realm } from "../../model/realm";
import QuestDropdown from "./QuestDropdown";
import "./styles/QuestDropdowns.css";

type Props = {
  realms: Realm[];
  selectedQuest: Quest | null;
  onQuestClick: (realm: Realm, quest: Quest) => void;
};

const QuestDropdowns = ({ realms, selectedQuest, onQuestClick }: Props) => {
  return (
    <div className="quest-dropdowns-container">
      {realms.map((realm, index) => (
        <QuestDropdown
          key={`${realm.title}-${index}`} // TODO: add id to realms
          realm={realm}
          selectedQuest={selectedQuest}
          onQuestClick={(quest) => onQuestClick(realm, quest)}
        />
      ))}
    </div>
  );
};
export default QuestDropdowns;
