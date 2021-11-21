import { ReactNode, createContext, useCallback, useMemo, useState } from "react";

import Context, { INITIAL_CONTEXT, ContextType, ContextValue } from "./context";

const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [appContext, setContext] = useState<ContextType>(INITIAL_CONTEXT);

  const setAppContext = useCallback((newContext) => {
    setContext((currentContext) => ({ ...currentContext, ...newContext }));
  }, []);

  const contextValue: ContextValue = useMemo(() => [appContext, setAppContext], [appContext, setAppContext]);

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export default ContextProvider;
