import type { Tables } from "./types";

type TimeSlots_Table = Tables["Time_Slots"];

export type TimeSlot = TimeSlots_Table["Row"];

export type TimeSlotInsert = TimeSlots_Table["Insert"];

export type LocalTimeSlot = Pick<
  TimeSlotInsert,
  "Weekday" | "start_time" | "end_time"
>;
