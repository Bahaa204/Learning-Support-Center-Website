import { Context } from "./context";
import type { Children, Data, DataContext } from "../types/types";
import { useState } from "react";
import type { Session } from "@supabase/supabase-js";

export function DataProvider({ children }: Children) {
  const [Data, setData] = useState<Data[]>([]);
  const [Loading, setLoading] = useState<boolean>(true);
  const [Session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState<string | null>(null);

  const value: DataContext = {
    Data,
    setData,
    Loading,
    setLoading,
    error,
    setError,
    Session,
    setSession,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
