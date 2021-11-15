const getApiUrl = (): string =>
  process.env.VERCEL_URL || process.env.API_URL || "http://localhost:3000";

export default getApiUrl;
