import { Combobox as ComboboxPrimitive } from "@base-ui/react";

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
} from "@/components/ui/combobox";
import type { Course } from "@/types/courses";
import { useCallback, useMemo } from "react";

interface CoursesComboboxMultipleProps {
  /** Full list of courses to search/select from. */
  courses: Course[];
  /** Controlled selected course codes. */
  value?: string[];
  /** Uncontrolled initial selected course codes. */
  defaultValue?: string[];
  /** Fires with the array of selected course codes — never full Course objects. */
  onValueChange?: (value: string[]) => void;
  placeholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
}

export default function CoursesComboboxMultiple({
  courses,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Search by course code or title...",
  emptyMessage = "No courses found.",
  disabled,
  className,
}: CoursesComboboxMultipleProps) {
  const { contains } = ComboboxPrimitive.useFilter();

  // Selection value = course code only. Rendering/filtering still gets the
  // full Course object (code + title) via createItems.
  const items = useMemo(
    () =>
      ComboboxPrimitive.createItems(courses, {
        getValue: (course: Course) => course["Course Code"],
        getLabel: (course: Course) =>
          `${course["Course Code"]} ${course["Course Title"]}`,
      }),
    [courses],
  );

  // Match the typed query against code OR title.
  const filter = useCallback(
    (course: Course, query: string) =>
      contains(course["Course Code"], query) ||
      contains(course["Course Title"], query),
    [contains],
  );

  return (
    <Combobox
      items={items}
      filter={filter}
      multiple
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
      // Keep the popup open after picking a course so several can be added
      // in one go (the input lives outside the popup, in the chips row).
      onOpenChange={(open, eventDetails) => {
        if (!open && eventDetails.reason === "item-press") {
          eventDetails.cancel();
        }
      }}
    >
      <ComboboxChips className={className} aria-label="Selected courses">
        <ComboboxValue>
          {(selected: string[]) =>
            selected.map((code) => (
              <ComboboxChip
                key={code}
                aria-label={code}
                aria-description="Press Backspace or Delete to remove"
              >
                {code}
              </ComboboxChip>
            ))
          }
        </ComboboxValue>
        <ComboboxChipsInput
          placeholder={placeholder}
          aria-description="Type a course code or title to search"
        />
      </ComboboxChips>
      <ComboboxContent>
        <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
        <ComboboxList>
          {(course: Course) => (
            <ComboboxItem
              key={course["Course Code"]}
              value={course["Course Code"]}
            >
              <span className="flex flex-col">
                <span className="font-medium">{course["Course Code"]}</span>
                <span className="text-xs text-muted-foreground">
                  {course["Course Title"]}
                </span>
              </span>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
