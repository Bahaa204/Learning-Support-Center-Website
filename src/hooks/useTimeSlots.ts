import {
  addBulkTimeSlots,
  addTimeSlot,
  fetchTimeSlots,
} from "@/services/TimesSotsService";
import type { TimeSlot, TimeSlotInsert } from "@/types/time_slots";
import type { PostgrestError } from "@supabase/supabase-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function useTimeSlots() {
  const queryClient = useQueryClient();

  const [Loading, setLoading] = useState<boolean>(false);

  const { data: TimeSlots, isLoading } = useQuery<TimeSlot[], PostgrestError>({
    queryKey: ["time_slots"],
    queryFn: fetchTimeSlots,
  });

  const AddMutation = useMutation<TimeSlot, PostgrestError, TimeSlotInsert>({
    mutationFn: addTimeSlot,
    onMutate: () => setLoading(true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["time_slots"] });
      setLoading(false);
    },
  });

  const AddBulkMutation = useMutation<
    TimeSlot[],
    PostgrestError,
    TimeSlotInsert[]
  >({
    mutationFn: addBulkTimeSlots,
    onMutate: () => setLoading(true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["time_slots"] });
      setLoading(false);
    },
  });

  async function AddTimeSlot(timeslot: TimeSlotInsert) {
    const { mutateAsync, isSuccess, data } = AddMutation;

    await mutateAsync(timeslot);

    return isSuccess ? data : null;
  }

  async function AddBulkTimeSlots(timeslots: TimeSlotInsert[]) {
    const { mutateAsync, isSuccess, data } = AddBulkMutation;

    await mutateAsync(timeslots);

    return isSuccess ? data : null;
  }

  return {
    TimeSlots,
    Loading: Loading || isLoading,
    AddTimeSlot,
    AddBulkTimeSlots,
  };
}
