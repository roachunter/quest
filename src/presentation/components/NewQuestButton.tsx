import {
  useRef,
  type ChangeEvent,
  type FormEvent,
  type MouseEvent,
} from "react";
import useQuestForm from "../hooks/useQuestForm";
import useQuestStore from "../state/questStore";
import "./styles/QuestButton.css";
import "./styles/QuestDialog.css";

const NewQuestButton = () => {
  const realms = useQuestStore((state) => state.realms);
  const addQuest = useQuestStore((state) => state.addQuest);

  const {
    realmId,
    title,
    titleError,
    stageDescriptions,
    setRealmId,
    setTitle,
    setStageDescriptions,
    validateForm,
    resetForm,
  } = useQuestForm(realms);

  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleButtonClick = () => {
    resetForm();
    dialogRef.current?.showModal();
  };

  const handleClickOutsideDialog = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target == dialogRef.current) {
      dialogRef.current?.close();
    }
  };

  const handleRealmSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedRealmId = event.target.value;

    setRealmId(selectedRealmId);
  };

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setTitle(value);
  };

  const handleStageDescriptionsChange = (
    event: ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    setStageDescriptions(value);
  };

  const handleCancel = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    dialogRef.current?.close();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) return;

    const stages = stageDescriptions
      .trim()
      .split("\n")
      .map((d) => d.trim())
      .filter((d) => d);

    addQuest(realmId, title, stages);
    dialogRef.current?.close();
  };

  return (
    <>
      <button
        className="quest-btn ticket-container-dark"
        onClick={handleButtonClick}
      >
        New Quest
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
          <h3>New Quest</h3>

          <div className="quest-dialog-form-container">
            <div>
              <label htmlFor="realm-select">Realm</label>
              <select
                value={realmId}
                onChange={handleRealmSelect}
                name="realm-select"
              >
                {realms.map((realm) => (
                  <option key={realm.id} value={realm.id}>
                    {realm.title}
                  </option>
                ))}
              </select>

              <label htmlFor="new-quest-title">Title</label>
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                name="new-quest-title"
              />
              {titleError}
            </div>
            <div>
              <label htmlFor="stage-descriptions">Stages</label>
              <textarea
                value={stageDescriptions}
                onChange={handleStageDescriptionsChange}
              />
            </div>
          </div>

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
export default NewQuestButton;
