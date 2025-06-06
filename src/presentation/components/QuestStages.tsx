import type { Quest } from "../../model/quest";
import QuestStage from "./QuestStage";
import "./styles/QuestStages.css";

type Props = {
  quest: Quest;
  realmTitle: string;
};

const QuestStages = ({ quest, realmTitle }: Props) => {
  return (
    <>
      {quest ? (
        <>
          <div className="heading-container heading-container-border">
            {/* TODO: Put Realm's emblem here */}
            <div>
              <h3>{quest.title}</h3>
              <p>{realmTitle}</p>
            </div>
          </div>
          <div className="stages-container">
            {quest.stages.map((stage, index) => (
              <QuestStage key={index} stage={stage} />
            ))}
          </div>
        </>
      ) : (
        <div>Select a quest</div>
      )}
    </>
  );
};
export default QuestStages;
