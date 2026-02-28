import { createContext, useContext } from "react";
import type { DataContext } from "../types/types";

export const Context = createContext<DataContext | undefined>(undefined);

export function useDataContext() {
  const user = useContext(Context);

  if (user === undefined) {
    throw new Error("useDataContext must be used with a DataContext");
  }
  return user;
}
