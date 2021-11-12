import useSWR from "swr";

import fetcher from "../utils/fetcher";

const useData = (url: string) => {
  const { data, error, mutate } = useSWR(url, fetcher);
  const loading = !error && !data;

  return { data, loading, error: error?.message, refetch: mutate };
};

export default useData;
