import type { StageState } from "../../model/stage";
import "./styles/StageState.css";

type Props = {
  state: StageState;
};

const StageStateCheckbox = ({ state }: Props) => {
  const imageSrc: string | null =
    state == "current"
      ? "../../assets/current-mark.svg"
      : state == "completed"
      ? "../../assets/completed-mark.svg"
      : null;

  return (
    <div className="stage-state-container ticket-border-solid">
      {imageSrc && <img src={imageSrc} alt={state} />}
    </div>
  );
};
export default StageStateCheckbox;
