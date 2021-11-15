const getApiUrl = (): string => {
  const { NEXT_PUBLIC_VERCEL_URL } = process?.env ?? {};
  if (NEXT_PUBLIC_VERCEL_URL) return `https://${NEXT_PUBLIC_VERCEL_URL}`;

  return process.env.API_URL || "http://localhost:3000";
};

export default getApiUrl;
