import { useEffect, useState } from "react";
import { supabaseClient } from "../supabase-client";
import type { Student, User } from "../types/types";

export function useRealTimeListeners() {
  const [Students, setStudents] = useState<Student[]>([]);
  const [Users, setUsers] = useState<User[]>([]);

  // Real Time Listeners to update the State
  useEffect(() => {
    const StudentsChannel = supabaseClient.channel("Students-Channel");
    StudentsChannel.on(
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
      .subscribe((status) => {
        console.log("Students Channel:", status);
      });

    const UsersChannel = supabaseClient.channel("Users-Channel");

    UsersChannel.on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "Users" },
      (payload) => {
        const newUser = payload.new as User;
        setUsers((prev) => [...prev, newUser]);
      },
    )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "Users" },
        (payload) => {
          const oldUser = payload.old as User;
          setUsers((prev) => prev.filter((user) => user.id !== oldUser.id));
        },
      )
      .subscribe((status) => {
        console.log("Users Channel:", status);
      });

    return () => {
      supabaseClient.removeChannel(StudentsChannel);
      supabaseClient.removeChannel(UsersChannel);
    };
  }, []);

  return { Students, Users };
}
