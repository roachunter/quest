import useQuestStore from "../state/questStore";

const PreviousStageButton = () => {
  const previousStage = useQuestStore((state) => state.previousStage);

  return (
    <button onClick={previousStage} className="quest-btn ticket-container-dark">
      Previous Stage
    </button>
  );
};
export default PreviousStageButton;
