import { useCallback, useEffect, useState } from "react";

const getAvailHeight = (): number => window.screen.availHeight;

const useAvailHeight = (): number | undefined => {
  const [availHeight, setAvailHeight] = useState<number | undefined>(undefined);
  const updateAvailHeight = useCallback(() => setAvailHeight(getAvailHeight), []);
  const windowIsDefined = typeof window !== "undefined";

  useEffect(() => {
    if (!windowIsDefined) return;

    updateAvailHeight;
    window.addEventListener("resize", updateAvailHeight);

    return () => window.removeEventListener("resize", updateAvailHeight);
  }, [updateAvailHeight, windowIsDefined]);

  return availHeight;
};

export default useAvailHeight;
