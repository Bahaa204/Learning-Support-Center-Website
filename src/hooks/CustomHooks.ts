import { useState, useEffect } from "react";
import { supabaseClient } from "../supabase-client";
import type { Data, RowType, TableName } from "../types/types";
import type { Session } from "@supabase/supabase-js";

export function useFetchFromTable<T extends TableName>(
  table_name: T,
  added_by: string,
) {
  const [Data, setData] = useState<RowType<T>[]>([]);
  const [Loading, setLoading] = useState(true);
  const [Error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!added_by) return;
    async function fetchData() {
      setLoading(true);
      setError(null);

      let query = supabaseClient.from(table_name).select("*");

      if (added_by !== "Lara") {
        query = query.eq("added_by", added_by as any);
      }

      const { data, error } = (await query) as Data<T>;

      if (error) {
        const msg = `Failed to increment visits. Error message: ${error.message}`;
        console.error(msg);
        setError(msg);
        setLoading(false);
        return;
      }

      setData(data || []);

      setLoading(false);
    }

    fetchData();
  }, [table_name, added_by]);

  return { Data, Error, Loading };
}

export function useGetSession() {
  const [Session, setSession] = useState<Session | null>(null);
  const [Loading, setLoading] = useState<boolean>(true);
  const [Error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getSession() {
      setLoading(true);
      setError(null);
      const { data, error: SessionError } =
        await supabaseClient.auth.getSession();

      if (SessionError) {
        const msg = `Failed to fetch Session. Error message: ${SessionError.message}`;
        console.error(msg);
        setError(msg);
        setLoading(false);
        return;
      }

      if (data.session) {
        setLoading(false);
        setError(null);
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

  return { Session, Error, Loading };
}
