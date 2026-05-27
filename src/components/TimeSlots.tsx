import { useEffect, useState } from "react";
import type { UserInput } from "@/types/users";
import type { LocalTimeSlot } from "@/types/time_slots";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from "./ui/select";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";

type Draft = LocalTimeSlot & { _id: string };

type TimeSlotProps = {
  userinput: UserInput;
  updateFields: (fields: Partial<UserInput>) => void;
  disabled?: boolean;
};

function makeId() {
  return `${Date.now()}_${Math.floor(Math.random() * 100000)}`;
}

export default function TimeSlots({
  userinput,
  updateFields,
  disabled,
}: TimeSlotProps) {
  const [drafts, setDrafts] = useState<Draft[]>(() =>
    (userinput.time_slots || []).map((s) => ({ ...s, _id: makeId() })),
  );

  useEffect(() => {
    // keep local drafts in sync when parent value changes
    setDrafts((prev) => {
      const incoming = (userinput.time_slots || []).map((s) => ({
        ...s,
        _id: makeId(),
      }));
      // simple heuristic: replace when lengths differ
      if (incoming.length !== prev.length) return incoming;
      return prev;
    });
  }, [userinput.time_slots]);

  useEffect(() => {
    // propagate changes up (strip _id)
    const stripped: LocalTimeSlot[] = drafts.map(({ _id, ...rest }) => rest);
    updateFields({ time_slots: stripped });
  }, [drafts, updateFields]);

  function addRow() {
    if (disabled) return;
    const newRow: Draft = {
      _id: makeId(),
      Weekday: "Monday",
      start_time: "09:00",
      end_time: "10:00",
    };
    setDrafts((prev) => [...prev, newRow]);
  }

  function updateRow(id: string, patch: Partial<LocalTimeSlot>) {
    setDrafts((prev) =>
      prev.map((r) => (r._id === id ? { ...r, ...patch } : r)),
    );
  }

  function removeRow(id: string) {
    if (disabled) return;
    setDrafts((prev) => prev.filter((r) => r._id !== id));
  }

  function validateRow(r: Draft) {
    if (!r.Weekday) return "Weekday required";
    if (!r.start_time) return "Start time required";
    if (!r.end_time) return "End time required";
    if (r.end_time <= r.start_time) return "End must be after start";
    return "";
  }

  return (
    <div className='space-y-3'>
      {drafts.length === 0 && (
        <div className='text-sm'>No time slots added yet.</div>
      )}

      {drafts.map((row) => (
        <FieldGroup className='grid grid-rows-[auto_16px] mb-0!' key={row._id}>
          <div className='w-full flex gap-4 flex-wrap sm:flex-row! sm:flex-nowrap items-center justify-evenly'>
            <Field>
              <FieldLabel>Weekday</FieldLabel>
              <Select
                value={row.Weekday}
                onValueChange={(v) => updateRow(row._id, { Weekday: v as any })}
                disabled={disabled}
              >
                <SelectTrigger size='sm'>
                  <SelectValue placeholder='Select a weekday' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Weekday</SelectLabel>
                    <SelectItem value='Monday'>Monday</SelectItem>
                    <SelectItem value='Tuesday'>Tuesday</SelectItem>
                    <SelectItem value='Wednesday'>Wednesday</SelectItem>
                    <SelectItem value='Thursday'>Thursday</SelectItem>
                    <SelectItem value='Friday'>Friday</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Start Time</FieldLabel>
              <Input
                type='time'
                className='w-28'
                value={row.start_time}
                onChange={(e) =>
                  updateRow(row._id, { start_time: e.target.value })
                }
                disabled={disabled}
              />
            </Field>
            <Field>
              <FieldLabel>End Time</FieldLabel>
              <Input
                type='time'
                className='w-28'
                value={row.end_time}
                onChange={(e) =>
                  updateRow(row._id, { end_time: e.target.value })
                }
                disabled={disabled}
              />
            </Field>
            <Field>
              <Button
                variant='outline'
                size='sm'
                type='button'
                onClick={() => removeRow(row._id)}
                disabled={disabled}
              >
                Remove
              </Button>
            </Field>
          </div>

          <FieldError className='text-rose-600 w-full h-4 row-start-2'>
            {validateRow(row)}
          </FieldError>
        </FieldGroup>
      ))}

      <div>
        <Button
          type='button'
          variant='ghost'
          className='text-(--navy) hover:text-(--navy)'
          onClick={addRow}
          disabled={disabled}
        >
          + Add time slot
        </Button>
      </div>
    </div>
  );
}
