import { useContext } from "react";

import Context from "../context";

const useAppContext = () => {
  const appContext = useContext(Context);
  return appContext;
};

export default useAppContext;
