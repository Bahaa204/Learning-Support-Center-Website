import { supabaseClient } from "@/supabase-client";
import type { Course } from "@/types/courses";
import type { Data } from "@/types/types";

export async function fetchCourses() {
  const { data, error } = (await supabaseClient
    .from("Courses")
    .select("*")) as Data<Course[]>;
  if (error) throw error;

  return data;
}
