import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

type DateTimePickerProps = {
  value: string;
  onChange: (value: string) => void;
};

function getSafeDate(value: string) {
  if (!value) return null;

  const parsedDate = new Date(value);

  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

function toTimeInputValue(date: Date | null) {
  if (!date) return "";

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
}

function updateDatePart(currentValue: string, nextDate: Date) {
  const updatedDate = getSafeDate(currentValue) ?? new Date();

  updatedDate.setFullYear(
    nextDate.getFullYear(),
    nextDate.getMonth(),
    nextDate.getDate(),
  );

  return updatedDate.toISOString();
}

function updateTimePart(currentValue: string, nextTime: string) {
  const updatedDate = getSafeDate(currentValue) ?? new Date();
  const [hours = "0", minutes = "0"] = nextTime.split(":");

  updatedDate.setHours(Number(hours), Number(minutes), 0, 0);

  return updatedDate.toISOString();
}

export function DateTimePicker({ value, onChange }: DateTimePickerProps) {
  const [open, setOpen] = useState(false);
  const selectedDate = getSafeDate(value);

  return (
    <FieldGroup className='mx-auto flex w-full max-w-xs flex-col gap-4 sm:max-w-none sm:flex-row sm:items-end'>
      <Field className='flex-1'>
        <FieldLabel htmlFor='visit-date'>Date</FieldLabel>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type='button'
              variant='outline'
              id='visit-date'
              className='h-auto w-full justify-between gap-3 whitespace-normal px-3 py-2 font-normal text-left'
            >
              <span className='text-sm leading-5'>
                {selectedDate
                  ? selectedDate.toISOString().split("T")[0]
                  : "No date selected"}
              </span>
              <ChevronDownIcon className='shrink-0' />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className='w-auto overflow-hidden p-0 relative z-500'
            align='start'
          >
            <Calendar
              mode='single'
              selected={selectedDate ?? undefined}
              captionLayout='dropdown'
              defaultMonth={selectedDate ?? new Date()}
              onSelect={(date) => {
                if (!date) {
                  return;
                }

                onChange(updateDatePart(value, date));
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </Field>

      <Field className='w-full sm:w-44'>
        <FieldLabel htmlFor='visit-time'>Time</FieldLabel>
        <Input
          type='time'
          id='visit-time'
          step='60'
          value={toTimeInputValue(selectedDate)}
          onChange={(event) =>
            onChange(updateTimePart(value, event.target.value))
          }
          className='appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none'
        />
      </Field>
    </FieldGroup>
  );
}
