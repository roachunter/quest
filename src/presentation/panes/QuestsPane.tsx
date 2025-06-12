import NextStageButton from "../components/NextStageButton";
import NewQuestButton from "../components/NewQuestButton";
import QuestDescription from "../components/QuestDescription";
import QuestDropdowns from "../components/QuestDropdowns";
import QuestStages from "../components/QuestStages";
import useQuestStore from "../state/questStore";
import "./styles/QuestsPane.css";
import PreviousStageButton from "../components/PreviousStageButton";
import EditQuestButton from "../components/EditQuestButton";

const QuestsPane = () => {
  const selectedQuest = useQuestStore((state) => state.selectedQuest);

  return (
    <div className="pane-wrapper">
      <div className="quest-pane">
        <section className="ticket-border-gradient">
          <QuestDropdowns />
        </section>
        <section className="ticket-border-gradient">
          <QuestStages />
        </section>
        <section className="ticket-border-gradient">
          <QuestDescription />
        </section>
      </div>

      <div className="quest-buttons-container">
        <NewQuestButton />

        {selectedQuest && (
          <>
            <EditQuestButton />
            <NextStageButton />
            <PreviousStageButton />
          </>
        )}
      </div>
    </div>
  );
};
export default QuestsPane;
