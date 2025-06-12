import { useCallback, useState } from "react";
import type { Realm } from "../../model/realm";

const useQuestForm = (
  realms: Realm[],
  defaultRealmId?: string,
  defaultTitle?: string,
  defaultStageDescriptions?: string
) => {
  const [realmId, setRealmId] = useState(defaultRealmId || realms[0]?.id || "");
  const [title, setTitle] = useState(defaultTitle || "");
  const [titleError, setTitleError] = useState("");
  const [stageDescriptions, setStageDescriptions] = useState(
    defaultStageDescriptions || ""
  );

  const handleSetTitle = (value: string | ((prev: string) => string)) => {
    const newValue = typeof value == "function" ? value(title) : value;

    setTitle(newValue);
    setTitleError("");
  };

  const validateForm = () => {
    let passing = true;

    setTitle((prev) => prev.trim());
    if (!title) {
      setTitleError("Please name your quest.");
      passing = false;
    }

    if (!realmId) {
      passing = false;
    }

    return passing;
  };

  const resetForm = useCallback(() => {
    setRealmId(defaultRealmId || realms[0]?.id || "");
    setTitle(defaultTitle || "");
    setTitleError("");
    setStageDescriptions(defaultStageDescriptions || "");
  }, [defaultRealmId, defaultTitle, defaultStageDescriptions, realms]);

  return {
    realmId,
    title,
    titleError,
    stageDescriptions,
    setRealmId,
    setTitle: handleSetTitle,
    setStageDescriptions,
    validateForm,
    resetForm,
  };
};

export default useQuestForm;
