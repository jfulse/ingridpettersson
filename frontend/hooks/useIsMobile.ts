import { useEffect, useState } from "react";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMedia = () => {
      const phoneMediaQuery = window.matchMedia("(max-width : 480px)");
      setIsMobile(phoneMediaQuery.matches);
    };

    checkMedia();

    window.addEventListener("resize", checkMedia);

    return () => window.removeEventListener("resize", checkMedia);
  }, []);

  return isMobile;
};

export default useIsMobile;
