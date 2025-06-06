import type { Stage } from "../../model/stage";
import StageStateCheckbox from "./StageStateCheckbox";
import "./styles/QuestStage.css";

type Props = {
  stage: Stage;
};

const QuestStage = ({ stage }: Props) => {
  const className =
    "quest-stage-container " +
    (stage.state == "completed"
      ? "completed-stage"
      : stage.state == "prepared"
      ? "prepared-stage"
      : "");

  return (
    <div className={className}>
      <StageStateCheckbox state={stage.state} />
      <p>{stage.description}</p>
    </div>
  );
};
export default QuestStage;
