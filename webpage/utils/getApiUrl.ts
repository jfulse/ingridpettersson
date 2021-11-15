const getApiUrl = (): string => {
  const verceuUrl = process.env.NEXT_PUBLIC_VERCEL_URL;
  if (verceuUrl) return `https://${verceuUrl}`;

  return process.env.API_URL || "http://localhost:3000";
};

export default getApiUrl;
