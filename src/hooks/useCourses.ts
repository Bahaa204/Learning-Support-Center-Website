import { fetchCourses } from "@/services/CoursesServices";
import type { Course } from "@/types/courses";
import type { PostgrestError } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";

export function useCourses() {
  const {
    data: Courses,
    isLoading: Loading,
    error: Error,
  } = useQuery<Course[], PostgrestError>({
    queryKey: ["courses"],
    queryFn: fetchCourses,
    staleTime:
      Infinity /* Courses never change so there is no need for it to go stale */,
    gcTime: Infinity,
  });

  return { Courses, Loading, Error };
}
