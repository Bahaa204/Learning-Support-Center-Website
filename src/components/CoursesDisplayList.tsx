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
import { useCourses } from "@/hooks/useCourses";
import type { Course } from "@/types/courses";
import { useState } from "react";

type CoursesDisplayListProps = {
  selectedCourseCodes: Course["Course Code"][];
  maxVisible?: number;
};

export default function CoursesDisplayList({
  selectedCourseCodes,
  maxVisible,
}: CoursesDisplayListProps) {
  const [open, setOpen] = useState<boolean>(false);
  const { Courses } = useCourses();

  const selectedCourses = selectedCourseCodes
    .map((courseCode) =>
      Courses?.find((course) => course["Course Code"] === courseCode),
    )
    .filter(Boolean) as Course[];

  const fallbackCourses = selectedCourseCodes
    .filter(
      (courseCode) =>
        !selectedCourses.some((course) => course["Course Code"] === courseCode),
    )
    .map((courseCode) => ({
      "Course Code": courseCode,
      "Course Title": "",
    }));

  const resolvedCourses = [...selectedCourses, ...fallbackCourses];

  if (selectedCourseCodes.length === 0) {
    return <span className='text-[0.9rem] text-(--text-muted)'>-</span>;
  }

  const displayCount =
    typeof maxVisible === "number"
      ? Math.min(maxVisible, resolvedCourses.length)
      : resolvedCourses.length;

  return (
    <>
      <Button
        type='button'
        variant='outline'
        className='w-fit'
        onClick={() => setOpen(true)}
      >
        View Courses ({displayCount})
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder='Search for a course by its name or code...' />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading='Courses Asked About'>
              {resolvedCourses.map((course, index) => (
                <div key={course["Course Code"]}>
                  <CommandItem
                    value={`${course["Course Code"]} ${course["Course Title"]}`}
                  >
                    {course["Course Code"]}
                    {course["Course Title"]
                      ? `: ${course["Course Title"]}`
                      : ""}
                  </CommandItem>
                  {index !== resolvedCourses.length - 1 && <CommandSeparator />}
                </div>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
