import useSWR from "swr";

import fetcher from "../utils/fetcher";

type Result<T> = {
  data?: T;
  error?: string;
  loading: boolean;
  refetch: () => void;
};

const useData = <T>(url?: string): Result<T> => {
  const { data, error, mutate } = useSWR<T>(url ?? "", fetcher);
  const loading = !error && !data;

  return { data, loading, error: error?.message, refetch: mutate };
};

export default useData;
