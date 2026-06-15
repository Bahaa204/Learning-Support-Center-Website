import { supabaseClient } from "@/supabase-client";
import type { TimeSlot, TimeSlotInsert } from "@/types/time_slots";
import type { Data } from "@/types/types";

export async function fetchTimeSlots() {
  const { data, error } = (await supabaseClient
    .from("Time_Slots")
    .select("*")) as Data<TimeSlot[]>;

  if (error) throw error;

  return data;
}

export async function addTimeSlot(timeslot: TimeSlotInsert) {
  const { data, error } = (await supabaseClient
    .from("Time_Slots")
    .insert(timeslot)
    .select("*")
    .single()) as Data<TimeSlot>;

  if (error) throw error;

  return data;
}

export async function addBulkTimeSlots(timeslot: TimeSlotInsert[]) {
  const { data, error } = (await supabaseClient
    .from("Time_Slots")
    .insert(timeslot)
    .select("*")) as Data<TimeSlot[]>;

  if (error) throw error;

  return data;
}
