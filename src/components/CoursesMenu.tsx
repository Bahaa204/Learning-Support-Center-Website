"use client";

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
import { useMemo, useState } from "react";

type CoursesMenuProps = {
  selectedCourseCodes: Course["Course Code"][];
  onSelectionChange: (courseCodes: Course["Course Code"][]) => void;
  buttonLabel?: string;
  maxVisible?: number;
};

export default function CoursesMenu({
  selectedCourseCodes,
  onSelectionChange,
  buttonLabel = "Open Menu",
  maxVisible = 3,
}: CoursesMenuProps) {
  const [open, setOpen] = useState<boolean>(false);

  const { Courses, Loading: CoursesLoading } = useCourses();

  const selectedCourses = useMemo(
    () =>
      selectedCourseCodes
        .map((courseCode) =>
          Courses?.find((course) => course["Course Code"] === courseCode),
        )
        .filter(Boolean) as Course[],
    [Courses, selectedCourseCodes],
  );

  const fallbackCourses = useMemo(
    () =>
      selectedCourseCodes
        .filter(
          (courseCode) =>
            !selectedCourses.some(
              (course) => course["Course Code"] === courseCode,
            ),
        )
        .map((courseCode) => ({
          "Course Code": courseCode,
          "Course Title": "",
        })),
    [selectedCourseCodes, selectedCourses],
  );

  const resolvedCourses = [...selectedCourses, ...fallbackCourses];
  const visibleCourses = resolvedCourses.slice(0, maxVisible);
  const hiddenCount = Math.max(0, resolvedCourses.length - maxVisible);

  function toggleCourse(courseCode: Course["Course Code"]) {
    if (selectedCourseCodes.includes(courseCode)) {
      onSelectionChange(
        selectedCourseCodes.filter(
          (selectedCode) => selectedCode !== courseCode,
        ),
      );
      return;
    }

    onSelectionChange([...selectedCourseCodes, courseCode]);
  }

  return (
    <div className='flex flex-wrap items-start gap-3'>
      <Button
        type='button'
        onClick={() => setOpen(true)}
        variant='outline'
        className='w-fit'
      >
        {buttonLabel}
      </Button>

      <div className='flex flex-col gap-1'>
        {resolvedCourses.length === 0 ? (
          <span className='text-xs text-(--text-muted)'>
            No courses selected yet.
          </span>
        ) : (
          <>
            {visibleCourses.map((course) => (
              <span key={course["Course Code"]} className='text-sm'>
                {course["Course Code"]}: {course["Course Title"]}
              </span>
            ))}
            {hiddenCount > 0 && (
              <span className='text-xs text-(--text-muted)'>
                +{hiddenCount} more
              </span>
            )}
          </>
        )}
      </div>

      <CommandDialog open={open} onOpenChange={setOpen} className="z-305">
        <Command>
          <CommandInput placeholder='Search for a course by its name or code...' />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading='Courses'>
              {CoursesLoading ? (
                <CommandItem>Loading...</CommandItem>
              ) : (
                Courses?.map((course, index) => {
                  const courseCode = course["Course Code"];
                  const isSelected = selectedCourseCodes.includes(courseCode);

                  return (
                    <div key={courseCode}>
                      <CommandItem
                        value={`${courseCode} ${course["Course Title"]}`}
                        onSelect={() => {
                          toggleCourse(courseCode);
                          setOpen(false);
                        }}
                        data-checked={isSelected}
                      >
                        {courseCode}:{course["Course Title"]}
                      </CommandItem>
                      {index !== Courses.length - 1 && <CommandSeparator />}
                    </div>
                  );
                })
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
}
