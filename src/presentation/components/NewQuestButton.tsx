import {
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type MouseEvent,
} from "react";
import "./styles/NewQuestButton.css";
import useQuestStore from "../state/questStore";
import type { Realm } from "../../model/realm";

const NewQuestButton = () => {
  const realms = useQuestStore((state) => state.realms);
  const addQuest = useQuestStore((state) => state.addQuest);

  const [newQuestRealm, setNewQuestRealm] = useState<Realm | null>(
    realms[0] || null
  );
  const [newQuestTitle, setNewQuestTitle] = useState("");
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
    const selectedRealm = realms.find(
      (realm) => realm.id == event.target.value
    );
    if (!selectedRealm) return;

    setNewQuestRealm(selectedRealm);
  };

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setNewQuestTitle(value);

    setTitleError("");
  };

  const handleCancel = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    dialogRef.current?.close();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newQuestRealm) {
      return;
    }

    const title = newQuestTitle.trim();
    if (!title) {
      setTitleError("Please name your quest.");
      return;
    }

    addQuest(newQuestRealm, title);
    dialogRef.current?.close();

    setNewQuestTitle("");
  };

  return (
    <>
      <button
        className="new-quest-btn ticket-container-dark"
        onClick={handleButtonClick}
      >
        New Quest
      </button>
      <dialog
        className="new-quest-dialog"
        ref={dialogRef}
        onClick={handleClickOutsideDialog}
      >
        <form
          onSubmit={handleSubmit}
          className="new-quest-dialog-form ticket-container-dark"
        >
          <h3>New Quest</h3>

          <label htmlFor="realm-select">Realm</label>
          <select
            value={newQuestRealm?.id}
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
            value={newQuestTitle}
            onChange={handleTitleChange}
            name="new-quest-title"
          />
          {titleError}

          <div className="new-quest-dialog-buttons">
            <button type="button"  onClick={handleCancel} className="ticket-container-dark">
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
