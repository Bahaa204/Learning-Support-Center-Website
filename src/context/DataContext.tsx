import { Context } from "./context";
import type { Children, Data, DataContext } from "../types/types";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabaseClient } from "../supabase-client";
import { getName } from "../helper/functions";

export function DataProvider({ children }: Children) {
  const [Data, setData] = useState<Data[]>([]);
  const [Loading, setLoading] = useState<boolean>(true);
  const [Session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState<string | null>(null);

  const name = getName(Session);

  useEffect(() => {
    async function getSession() {
      const { data, error: SessionError } =
        await supabaseClient.auth.getSession();

      if (SessionError) {
        console.error("An Error has occurred: ", SessionError.message);
        setError(
          `Failed to fetch Data. Error message: ${SessionError.message}`,
        );
        return;
      }

      if (data.session) {
        setSession(data.session);
      }
    }

    getSession();

    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      (_event, session) => setSession(session),
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      let fetchError;
      let Data;
      if (name === "Lara") {
        const { error: FetchingError, data } = await supabaseClient
          .from("Students")
          .select("*");
        // console.log(data);

        fetchError = FetchingError;
        Data = data;
      } else {
        const { error: FetchingError, data } = await supabaseClient
          .from("Students")
          .select("*")
          .eq("added_by", name);

        fetchError = FetchingError;
        Data = data;
      }

      if (fetchError) {
        console.error("An Error has occurred: ", fetchError.message);
        console.error("Error Details: ", fetchError.details);
        setError(`Failed to fetch Data. Error Details: ${fetchError.details}`);
        setLoading(false);
        return;
      }

      // console.log("Session:", Session);
      // console.log("name:", name);
      // console.log("Data: ", Data);
      setLoading(false);
      if (Data) setData(Data);
    }
    fetchData();
  }, [Session]);

  const value: DataContext = {
    Data,
    setData,
    Loading,
    setLoading,
    error,
    setError,
    Session,
    setSession,
    name,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
