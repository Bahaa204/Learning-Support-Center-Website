import { Context } from "./context";
import type { Children, Data, DataContext } from "../types/types";
import { useState } from "react";

export function DataProvider({ children }: Children) {
  const [Data, setData] = useState<Data[]>([]);
  const [Loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const value: DataContext = {
    Data,
    setData,
    Loading,
    setLoading,
    error,
    setError,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
