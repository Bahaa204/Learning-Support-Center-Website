import { BuildCustomPostgrestError } from "@/helper/errorhelpers";
import { supabaseClient } from "@/supabase-client";
import type { NewStudent, Student, UpdatedStudent } from "@/types/students";
import type { Data } from "@/types/types";
import type { User as AuthUser } from "@supabase/supabase-js";

export async function fetchStudentsByDepartment(user: AuthUser | undefined) {
  if (!user)
    throw BuildCustomPostgrestError("User is not authenticated", "401");

  let query = supabaseClient.from("Students").select("*");
  // .eq("department_id", user.user_metadata.department_id);

  if (user.user_metadata.role !== "admin")
    query = query.eq("added_by", user.id);

  const { data, error } = (await query) as Data<Student[]>;

  if (error) throw error;

  return data;
}

export async function addStudent(student: NewStudent) {
  const { data, error } = (await supabaseClient
    .from("Students")
    .insert(student)
    .select("*")
    .single()) as Data<Student>;

  if (error) throw error;

  return data;
}

export async function incrementStudentVisits(studentId: Student["studentId"]) {
  const { data, error } = (await supabaseClient.rpc(
    "increment_student_visits",
    {
      student_id_input: studentId,
    },
  )) as Data<Student>;

  if (error) throw error;
  return data;
}

export async function updateStudent({
  id,
  updatedStudent,
}: {
  id: Student["studentId"];
  updatedStudent: UpdatedStudent;
}) {
  const { data, error } = (await supabaseClient
    .from("Students")
    .update(updatedStudent)
    .eq("studentId", id)
    .select("*")
    .single()) as Data<Student>;

  if (error) throw error;

  return data;
}

export async function deleteStudent(id: Student["studentId"]) {
  const { error } = await supabaseClient
    .from("Students")
    .delete()
    .eq("studentId", id);

  if (error) throw error;

  return true;
}
