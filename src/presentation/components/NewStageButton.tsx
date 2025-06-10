import {
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type MouseEvent,
} from "react";
import "./styles/QuestButton.css";
import useQuestStore from "../state/questStore";

const NewStageButton = () => {
  const addStage = useQuestStore((state) => state.addStage);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [stageDescription, setStageDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  const handleButtonClick = () => {
    dialogRef.current?.showModal();
  };

  const handleClickOutsideDialog = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target == dialogRef.current) {
      dialogRef.current?.close();
    }
  };

  const handleStageDescChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setStageDescription(value);

    setDescriptionError("");
  };

  const handleCancel = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    dialogRef.current?.close();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const desc = stageDescription.trim();
    if (!desc) {
      setDescriptionError("Please specify stage description.");
      return;
    }

    addStage(desc);
    dialogRef.current?.close();

    setStageDescription("");
  };

  return (
    <>
      <button
        className="quest-btn ticket-container-dark"
        onClick={handleButtonClick}
      >
        New Stage
      </button>
      <dialog
        className="quest-dialog"
        ref={dialogRef}
        onClick={handleClickOutsideDialog}
      >
        <form
          onSubmit={handleSubmit}
          className="quest-dialog-form ticket-container-dark"
        >
          <h3>New Stage</h3>

          <label htmlFor="new-stage-description">Description</label>
          <input
            type="text"
            value={stageDescription}
            onChange={handleStageDescChange}
            name="new-stage-description"
          />
          {descriptionError}

          <div className="quest-dialog-buttons">
            <button
              type="button"
              onClick={handleCancel}
              className="ticket-container-dark"
            >
              Cancel
            </button>
            <button type="submit" className="ticket-container-dark">
              Start
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
};
export default NewStageButton;
