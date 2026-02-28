import { supabaseClient } from "../supabase-client";
import type { Data } from "../types/types";

const TableName = "Students";

export async function addStudent(student: Data) {
  const { error } = await supabaseClient
    .from(TableName)
    .insert(student)
    .single();

  return error;
}

export async function getStudents() {
  const { error, data } = await supabaseClient.from(TableName).select("*");

  return { data, error };
}

export async function incrementVisits(student: Data) {
  const { error } = await supabaseClient
    .from(TableName)
    .update({ nb_visits: student.nb_visits + 1 })
    .eq("studentId", student.studentId);
  return error;
}
