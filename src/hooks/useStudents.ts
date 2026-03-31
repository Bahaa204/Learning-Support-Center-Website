import { useEffect, useState } from "react";
import { useFetchFromTable } from "./useFetchFromTable";
import type { Student } from "../types/types";
import { supabaseClient } from "../supabase-client";

export function useStudents(added_by: string) {
  const { Data, Loading, Error } = useFetchFromTable("Students", added_by);

  const [Students, setStudents] = useState<Student[]>([]);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<number | null>(null);

  // Sync fetched data to local state
  useEffect(() => {
    setStudents(Data);
  }, [Data]);

  // Realtime updates mutate the SAME state
  useEffect(() => {
    const channel = supabaseClient.channel("Students-Channel");

    channel
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "Students" },
        (payload) => {
          const newStudent = payload.new as Student;

          setStudents((prev) => [...prev, newStudent]);
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "Students" },
        (payload) => {
          const updatedStudent = payload.new as Student;

          setStudents((prev) =>
            prev.map((student) =>
              student.studentId === updatedStudent.studentId
                ? updatedStudent
                : student,
            ),
          );
        },
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "Students" },
        (payload) => {
          const deletedStudent = payload.old as Student;

          setStudents((prev) =>
            prev.filter(
              (student) => student.studentId !== deletedStudent.studentId,
            ),
          );
        },
      )
      .subscribe((status) => {
        console.log("Students Channel:", status);
      });

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, []);

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

  return {
    Students,
    Loading,
    Error,
    addStudent,
    incrementStudentVisits,
    isAdding,
    isUpdating,
  };
}
