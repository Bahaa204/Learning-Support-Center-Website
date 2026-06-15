import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useTimeSlots } from "@/hooks/useTimeSlots";
import type { User } from "@/types/users";
import { useState } from "react";

type TimeSlotsMenuProps = {
  userId: User["id"];
};

export function TimeSlotsMenu({ userId }: TimeSlotsMenuProps) {
  const [open, setOpen] = useState<boolean>(false);

  const { TimeSlots, Loading } = useTimeSlots();

  const UserTimeSlots = TimeSlots?.filter(
    (timeslot) => timeslot.userId === userId,
  );

  return (
    <div className='flex flex-col gap-4'>
      <Button
        type='button'
        onClick={() => setOpen(true)}
        variant='outline'
        className='w-fit'
      >
        Open Menu
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder='Search for a timeSlot' />
          <CommandList>
            <CommandGroup heading='Time Slots'>
              <CommandEmpty>
                No time slots found were found for this user.
              </CommandEmpty>
              {Loading ? (
                <CommandItem>Loading...</CommandItem>
              ) : (
                UserTimeSlots?.map((slot, index) => (
                  <div key={slot.id}>
                    <CommandItem>
                      {slot.Weekday}: {slot.start_time} to {slot.end_time}
                    </CommandItem>
                    {index !== UserTimeSlots.length - 1 && <CommandSeparator />}
                  </div>
                ))
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
}
