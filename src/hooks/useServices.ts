import { useState } from "react";
import { supabaseClient } from "../supabase-client";
import type { Student, User } from "../types/types";

export function useServices() {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  async function addStudent(student: Student) {
    setIsAdding(true);

    const { error } = await supabaseClient
      .from("Students")
      .insert(student)
      .single();

    if (error) {
      const msg = `An Error Occurred: ${error.message}`;
      console.error(msg);
      setIsAdding(false);
      return false;
    }
    setIsAdding(false);
    return true;
  }

  async function incrementStudentVisits(studentId: number) {
    setIsUpdating(studentId);

    const { error } = await supabaseClient.rpc("increment_student_visits", {
      student_id_input: studentId,
    });

    if (error) {
      const msg = `An Error Occurred: ${error.message}`;
      console.error(msg);
      setIsUpdating(null);
      return false;
    }
    setIsUpdating(null);
    return true;
  }

  async function addUser(user: User) {
    setIsAdding(true);

    const { error } = await supabaseClient.from("Users").insert(user).single();

    if (error) {
      const msg = `An Error Occurred: ${error.message}`;
      console.error(msg);
      setIsAdding(false);
      return false;
    }
    setIsAdding(false);
    return true;
  }

  async function deleteUser(userId: string) {
    setIsDeleting(userId);

    const { error } = await supabaseClient
      .from("Users")
      .delete()
      .eq("id", userId);

    if (error) {
      const msg = `An Error Occurred: ${error.message}`;
      console.error(msg);
      setIsDeleting(null);
      return false;
    }
    setIsDeleting(null);
    return true;
  }

  return {
    addStudent,
    incrementStudentVisits,
    addUser,
    deleteUser,
    isAdding,
    isDeleting,
    isUpdating,
  };
}
