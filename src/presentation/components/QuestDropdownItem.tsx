import type { Quest } from "../../model/quest";
import "./styles/QuestDropdownItem.css";

type Props = {
  quest: Quest;
  realmTitle: string;
  selected: boolean;
  onClick: (quest: Quest) => void;
};

const QuestDropdownItem = ({ quest, realmTitle, selected, onClick }: Props) => {
  const className = `quest-dropdown-item ${
    selected ? "selected-item" : ""
  } ticket-border-light-gradient-horizontal`;

  return (
    <div
      className={className}
      onClick={() => {
        onClick(quest);
      }}
    >
      {/* TODO: Put Realm's emblem here */}
      <div className="quest-dropdown-item-text">
        <h3>{quest.title}</h3>
        <p>{realmTitle}</p>
      </div>
    </div>
  );
};
export default QuestDropdownItem;
