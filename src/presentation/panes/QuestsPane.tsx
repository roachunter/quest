import QuestDescription from "../components/QuestDescription";
import QuestDropdowns from "../components/QuestDropdowns";
import QuestStages from "../components/QuestStages";
import "./styles/QuestsPane.css";

const QuestsPane = () => {
  return (
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
  );
};
export default QuestsPane;
