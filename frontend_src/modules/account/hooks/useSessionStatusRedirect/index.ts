import { useQuery } from "@tanstack/react-query";
import { getSession } from "../../lib/allauth.ts";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";

export const useSessionStatusRedirect = () => {
  const navigate = useNavigate();
  const { data: sessionData, isLoading } = useQuery({
    queryKey: ["status"],
    queryFn: async () => {
      try {
        const result = await getSession();
        result.loggedIn = true;
        return result;
      } catch (error) {
        // @ts-ignore
        if (error?.response?.status === 401) {
          return { loggedIn: false };
        }
        throw error;
      }
    },
    gcTime: 0,
  });

  useEffect(() => {
    if (sessionData?.loggedIn) {
      navigate({
        to: "/",
      });
    }
  }, [sessionData]);

  return {
    isLoading,
  };
};
