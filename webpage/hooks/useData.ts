import { useCallback } from "react";
import useSWR from "swr";

type Result<T> = {
  data?: T | null;
  error?: string;
  loading: boolean;
  refetch: () => void;
};

const useData = <T>(getData: (args: any) => Promise<T | null>, key: string, args?: any): Result<T> => {
  const fetcher = useCallback(() => getData(args), [args, getData]);
  const { data, error, mutate } = useSWR<T | null>(key, fetcher);
  const loading = !error && !data;

  return { data, loading, error: error?.message, refetch: mutate };
};

export default useData;
