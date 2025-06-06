import type { Quest } from "../../model/quest";
import "./styles/QuestDescription.css";

type Props = {
  quest: Quest | null;
};

const QuestDescription = ({ quest }: Props) => {
  return (
    <>
      {quest ? (
        <div className="quest-description-container">
          {quest.description.split("\n").map((paragraph) => (
            <p className="quest-description">{paragraph}</p>
          ))}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
export default QuestDescription;
