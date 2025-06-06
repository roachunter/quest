import type { Quest } from "../../model/quest";
import useQuestStore from "../state/questStore";
import "./styles/QuestDropdownItem.css";

type Props = {
  quest: Quest;
  realmTitle: string;
  selected: boolean;
};

const QuestDropdownItem = ({ quest, realmTitle, selected }: Props) => {
  const selectQuest = useQuestStore((state) => state.selectQuest);
  const handleClick = () => {
    selectQuest(quest);
  };

  const className = `quest-dropdown-item ${
    selected ? "selected-item" : ""
  } ticket-border-light-gradient-horizontal`;

  return (
    <div className={className} onClick={handleClick}>
      {/* TODO: Put Realm's emblem here */}
      <div className="quest-dropdown-item-text">
        <h3>{quest.title}</h3>
        <p>{realmTitle}</p>
      </div>
    </div>
  );
};
export default QuestDropdownItem;
