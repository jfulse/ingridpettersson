const GENERIC_ERROR_MESSAGE = "Something went wrong...";

const fetcher = async <T>(url: string): Promise<T> => {
  const response = await fetch(url);

  try {
    if (response.ok) return (await response.json()) as T;
    throw new Error(await response.text());
  } catch (err: unknown) {
    const message = err instanceof Error ? err?.message : String(err) || GENERIC_ERROR_MESSAGE;

    throw new Error(message);
  }
};

export default fetcher;
