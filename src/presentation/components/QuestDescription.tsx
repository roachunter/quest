import useQuestStore from "../state/questStore";
import "./styles/QuestDescription.css";

const QuestDescription = () => {
  const questDescription = useQuestStore(
    (state) => state.selectedQuest?.description
  );

  return (
    <>
      {questDescription ? (
        <div className="quest-description-container">
          {questDescription.split("\n").map((paragraph, index) => (
            <p key={index} className="quest-description">
              {paragraph}
            </p>
          ))}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
export default QuestDescription;
