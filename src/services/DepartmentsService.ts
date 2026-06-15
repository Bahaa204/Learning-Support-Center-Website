import { supabaseClient } from "@/supabase-client";
import type { Department } from "@/types/department";
import type { Data } from "@/types/types";

export async function fetchDepartments() {
  const { data, error } = (await supabaseClient
    .from("Department")
    .select("*")) as Data<Department[]>;

  if (error) throw error;

  return data;
}
