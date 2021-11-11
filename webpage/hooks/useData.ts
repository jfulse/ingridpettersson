import useSWR from "swr";

const API_URL = "http://localhost:3000";

const GENERIC_ERROR_MESSAGE = "Something went wrong...";

const fetcher = async (url: string) => {
  const response = await fetch(url);

  try {
    if (response.ok) return await response.json();
    throw new Error(await response.text());
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err?.message
        : String(err) || GENERIC_ERROR_MESSAGE;

    throw new Error(message);
  }
};

const useData = (url: string) => {
  const { data, error, mutate } = useSWR(`${API_URL}/${url}`, fetcher);
  const loading = !error && !data;

  return { data, loading, error: error?.message, refetch: mutate };
};

export default useData;
