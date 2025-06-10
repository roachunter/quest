import {
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type MouseEvent,
} from "react";
import "./styles/QuestButton.css";
import useQuestStore from "../state/questStore";

const NewQuestButton = () => {
  const realms = useQuestStore((state) => state.realms);
  const addQuest = useQuestStore((state) => state.addQuest);

  const [realmId, setRealmId] = useState(realms[0]?.id || "");
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");

  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleButtonClick = () => {
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

    setTitleError("");
  };

  const handleCancel = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    dialogRef.current?.close();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!realmId) {
      return;
    }

    const titleTrimmed = title.trim();
    if (!titleTrimmed) {
      setTitleError("Please name your quest.");
      return;
    }

    addQuest(realmId, titleTrimmed);
    dialogRef.current?.close();

    setTitle("");
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
