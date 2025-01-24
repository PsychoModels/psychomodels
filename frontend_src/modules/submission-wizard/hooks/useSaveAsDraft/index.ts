import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { getCSRFToken } from "../../../account/lib/django.ts";
import useStore from "../../store/useStore.ts";
import { serializeAllDraftSlices } from "../../store/serializeDraftSlice.ts";

export const useSaveAsDraft = () => {
  const { draftState, setDraftSavedStatus } = useStore((state) => state);

  const mutation = useMutation({
    mutationFn: ({ draftId, data }: { draftId: number | null; data: any }) => {
      if (draftId) {
        return axios.put(
          `/api/psychology_models/draft/${draftId}/`,
          {
            data,
          },
          {
            headers: {
              "X-CSRFToken": getCSRFToken(),
            },
          },
        );
      }

      return axios.post(
        "/api/psychology_models/draft/",
        {
          data,
        },
        {
          headers: {
            "X-CSRFToken": getCSRFToken(),
          },
        },
      );
    },
    onSuccess: (data: any) => {
      if (data.data.id) {
        setDraftSavedStatus(data.data.id);
      }
    },
  });

  const save = () => {
    if (mutation.isPending) {
      return;
    }
    const data = serializeAllDraftSlices();

    mutation.mutate({ draftId: draftState?.id, data });
  };

  return {
    save,
    isError: mutation.isError,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
  };
};
