import { useEffect, useState } from "react";
import type { Data, RowType, TableName } from "../types/types";
import { supabaseClient } from "../supabase-client";

// Custom Hook to fetch the data from supabase
export function useFetchFromTable<T extends TableName>(
  table_name: T,
  added_by: string,
) {
  const [Data, setData] = useState<RowType<T>[]>([]);
  const [Loading, setLoading] = useState(false);
  const [Error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!added_by) return;
    async function fetchData() {
      setLoading(true);
      setError(null);

      let query = supabaseClient.from(table_name).select("*");

      if (added_by !== "Laraabouorm") {
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
