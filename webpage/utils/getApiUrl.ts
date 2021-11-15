const getApiUrl = (): string =>
  process.env.NEXT_PUBLIC_VERCEL_URL ||
  process.env.API_URL ||
  "http://localhost:3000";

export default getApiUrl;
