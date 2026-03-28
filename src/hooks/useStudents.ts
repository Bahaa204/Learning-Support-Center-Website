import { useEffect, useState } from "react";
import { useFetchFromTable } from "./useFetchFromTable";
import type { Student } from "../types/types";
import { supabaseClient } from "../supabase-client";

export function useStudents(added_by: string) {
  const { Data, Loading, Error } = useFetchFromTable("Students", added_by);

  const [Students, setStudents] = useState<Student[]>([]);

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

  return {
    Students,
    Loading,
    Error,
  };
}
