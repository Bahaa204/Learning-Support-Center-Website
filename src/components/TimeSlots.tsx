import type { TimeSlot, UserInput } from "@/types/users";
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

type TimeSlotProps = {
  userinput: UserInput;
  updateFields: (fields: Partial<UserInput>) => void;
  disabled?: boolean;
};

type Row = {
  rowId: ReturnType<typeof crypto.randomUUID>;
} & TimeSlot;

export default function TimeSlots({
  userinput,
  updateFields,
  disabled,
}: TimeSlotProps) {
  const Rows: Row[] = userinput.time_slots.map((slot) => ({
    rowId: crypto.randomUUID(),
    ...slot,
  }));

  function AddRow() {
    updateFields({
      time_slots: [
        ...userinput.time_slots,
        { weekday: "Monday", start_time: "09:00", end_time: "10:00" },
      ],
    });
  }

  function UpdateRow(rowId: Row["rowId"], updatedSlot: Partial<TimeSlot>) {
    const UpdatedRows = Rows.map((row) =>
      row.rowId === rowId ? { ...row, ...updatedSlot } : row,
    );

    updateFields({
      time_slots: UpdatedRows.map(({ rowId, ...slot }) => slot),
    });
  }

  function RemoveRow(rowId: Row["rowId"]) {
    const UpdatedRows = Rows.filter((row) => row.rowId !== rowId);

    updateFields({
      time_slots: UpdatedRows.map(({ rowId, ...slot }) => slot),
    });
  }

  function ValidateRow(row: Row) {
    if (!row.weekday) return "Weekday required";
    if (!row.start_time) return "Start time required";
    if (!row.end_time) return "End time required";
    if (row.end_time <= row.start_time) return "End must be after start";
    return "";
  }

  return (
    <div className='space-y-3'>
      {Rows.length === 0 && (
        <div className='text-sm'>No time slots added yet.</div>
      )}

      {Rows.map((row) => (
        <FieldGroup
          className='grid grid-rows-[auto_16px] mb-0!'
          key={row.rowId}
        >
          <div className='w-full flex gap-4 flex-wrap sm:flex-row! sm:flex-nowrap items-center justify-evenly'>
            <Field>
              <FieldLabel>Weekday</FieldLabel>
              <Select
                value={row.weekday}
                onValueChange={(value) =>
                  UpdateRow(row.rowId, {
                    weekday: value as TimeSlot["weekday"],
                  })
                }
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
                onChange={(event) =>
                  UpdateRow(row.rowId, { start_time: event.target.value })
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
                onChange={(event) =>
                  UpdateRow(row.rowId, { end_time: event.target.value })
                }
                disabled={disabled}
              />
            </Field>
            <Field>
              <Button
                variant='outline'
                size='sm'
                type='button'
                onClick={() => RemoveRow(row.rowId)}
                disabled={disabled}
              >
                Remove
              </Button>
            </Field>
          </div>

          <FieldError className='text-rose-600 w-full h-4 row-start-2'>
            {ValidateRow(row)}
          </FieldError>
        </FieldGroup>
      ))}

      <div>
        <Button
          type='button'
          variant='ghost'
          className='text-(--navy) hover:text-(--navy)'
          onClick={AddRow}
          disabled={disabled}
        >
          + Add time slot
        </Button>
      </div>
    </div>
  );
}
