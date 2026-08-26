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
import type { TimeSlot } from "@/types/users";
import { useState } from "react";

type TimeSlotsMenuProps = {
  timeslots: TimeSlot[];
};

export function TimeSlotsMenu({ timeslots }: TimeSlotsMenuProps) {
  const [open, setOpen] = useState<boolean>(false);

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
              {timeslots.map((slot, index) => (
                <div key={crypto.randomUUID()}>
                  <CommandItem>
                    {slot.weekday}: {slot.start_time} to {slot.end_time}
                  </CommandItem>
                  {index !== timeslots.length - 1 && <CommandSeparator />}
                </div>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
}
