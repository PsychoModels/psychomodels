import axios from "axios";
import { serializeAllDraftSlices } from "../store/serializeDraftSlice.ts";
import { getCSRFToken } from "../../account/lib/django.ts";
import useStore from "../store/useStore.ts";

// Store the current request's AbortController so we can cancel it
let controller: AbortController | null = null;
let isSaving = false;
let isError = false;

const dataIsNotEmpty = (obj: any): boolean => {
  if (obj === null || obj === undefined || obj === "") return false;
  if (Array.isArray(obj)) return obj.some(dataIsNotEmpty);
  if (typeof obj === "object") {
    if (Object.keys(obj).length === 0) return false;
    return Object.values(obj).some(dataIsNotEmpty);
  }
  return true;
};

export const saveDraft = async () => {
  const data = serializeAllDraftSlices();
  const { draftState, setDraftSavedStatus } = useStore.getState();

  if (!dataIsNotEmpty(data)) {
    return;
  }

  if (controller) {
    controller.abort();
  }

  controller = new AbortController();
  const signal = controller.signal;

  isSaving = true;

  try {
    let response;
    if (draftState.id) {
      response = await axios.put(
        `/api/psychology_models/draft/${draftState.id}/`,
        { data },
        {
          headers: { "X-CSRFToken": getCSRFToken() },
          signal,
        },
      );
    } else {
      response = await axios.post(
        "/api/psychology_models/draft/",
        { data },
        {
          headers: { "X-CSRFToken": getCSRFToken() },
          signal,
        },
      );
    }

    isError = false;
    if (response.data.id) {
      setDraftSavedStatus(response.data.id);
    }

    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Previous request was cancelled");
    } else {
      isError = true;
      console.error("Failed to save draft:", error);
      throw error;
    }
  } finally {
    isSaving = false;
  }
};

window.addEventListener("beforeunload", (event) => {
  if (isSaving || isError) {
    event.preventDefault();
    event.returnValue =
      "You have unsaved changes. Are you sure you want to leave?";
  }
});
