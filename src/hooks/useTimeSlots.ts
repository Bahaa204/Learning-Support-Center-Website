import { supabaseClient } from "@/supabase-client";
import type { TimeSlot, TimeSlotInsert } from "@/types/time_slots";
import type { Data } from "@/types/types";
import type { PostgrestError } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export function useTimeSlots() {
  const [TimeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [Loading, setLoading] = useState<boolean>(false);
  const [Error, setError] = useState<string>("");

  function resetStates() {
    setLoading(true);
    setError("");
  }

  function SetError(error: PostgrestError) {
    const msg = `An Error Occurred: Error Code: ${error.code}\nError Message: ${error.message}`;
    setError(msg);
    setLoading(false);
  }

  useEffect(() => {
    async function fetchTimeSlots() {
      resetStates();

      const { data, error: FetchError } = (await supabaseClient
        .from("Time_Slots")
        .select("*")) as Data<TimeSlot[]>;

      if (FetchError) return SetError(FetchError);

      setTimeSlots(data || []);
      setLoading(false);
    }

    fetchTimeSlots();
  }, []);

  async function AddTimeSlots(timeslot: TimeSlotInsert | TimeSlotInsert[]) {
    resetStates();

    const query = supabaseClient.from("Time_Slots").insert(timeslot);

    const { error: InsertError } = Array.isArray(timeslot)
      ? await query
      : await query.single();

    if (InsertError) {
      SetError(InsertError);
      return false;
    }

    setLoading(false);
    return true;
  }

  return {
    TimeSlots,
    Loading,
    Error,
    AddTimeSlots,
  };
}
