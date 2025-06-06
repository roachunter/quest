import useQuestStore from "../state/questStore";
import QuestStage from "./QuestStage";
import "./styles/QuestStages.css";

const QuestStages = () => {
  const quest = useQuestStore((state) => state.selectedQuest);
  const realmTitle = useQuestStore((state) => state.selectedRealm?.title);

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
            {quest.stages.map((stage) => (
              <QuestStage key={stage.id} stage={stage} />
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
