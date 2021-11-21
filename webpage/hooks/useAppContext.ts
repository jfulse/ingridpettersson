import { useContext } from "react";

import Context from "../context";

export default () => {
  const appContext = useContext(Context);
  return appContext;
};
