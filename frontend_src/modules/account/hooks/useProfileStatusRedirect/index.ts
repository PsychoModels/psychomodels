import { useQuery } from "@tanstack/react-query";
import { getSession } from "../../lib/allauth.ts";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";

export const useProfileStatusRedirect = () => {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
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
    if (
      data &&
      data.loggedIn &&
      (!data?.data?.user?.first_name || !data?.data?.user?.last_name)
    ) {
      navigate({
        to: "/profile/",
      });
    }
  }, [data]);

  return {
    isLoading,
  };
};
