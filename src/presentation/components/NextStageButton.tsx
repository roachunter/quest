import useQuestStore from "../state/questStore";
import "./styles/QuestButton.css";

const NextStageButton = () => {
  const nextStage = useQuestStore((state) => state.nextStage);

  return (
    <button onClick={nextStage} className="quest-btn ticket-container-dark">
      Next Stage
    </button>
  );
};
export default NextStageButton;
