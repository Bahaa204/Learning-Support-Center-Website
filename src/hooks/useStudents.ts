import { useEffect, useState } from "react";
import { PostgrestError, type User as AuthUser } from "@supabase/supabase-js";
import type { NewStudent, Student, UpdatedStudent } from "@/types/students";
import { supabaseClient } from "@/supabase-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addStudent,
  clearStudents,
  deleteStudent,
  fetchStudentsByDepartment,
  incrementStudentVisits,
  updateStudent,
} from "@/services/StudentsService";
import type { MutationOptions } from "@/types/types";

export function useStudents(user: AuthUser | undefined) {
  const queryClient = useQueryClient();

  const [IsUpdating, setIsUpdating] = useState<Student["studentId"] | null>(
    null,
  );
  const [Loading, setLoading] = useState<boolean>(false);

  const { data: Students, isLoading } = useQuery<Student[], PostgrestError>({
    queryKey: ["students", user?.user_metadata.department_id],
    queryFn: () => fetchStudentsByDepartment(user),
    enabled: !!user,
  });

  useEffect(() => {
    const channel = supabaseClient.channel("Students Channel");

    channel
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Students" },
        () => {
          queryClient.invalidateQueries({
            queryKey: ["students", user?.user_metadata.department_id],
          });
        },
      )
      .subscribe((status) => {
        console.log("Students Channel:", status);
      });

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [user]);

  const AddMutation = useMutation<Student, PostgrestError, NewStudent>({
    mutationFn: addStudent,
    onMutate: () => setLoading(true),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["students", user?.user_metadata.department_id],
      });
      setLoading(false);
    },
  });

  const IncrementMutation = useMutation<
    Student,
    PostgrestError,
    Student["studentId"]
  >({
    mutationFn: incrementStudentVisits,
    onMutate: (studentId) => setIsUpdating(studentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["students", user?.user_metadata.department_id],
      });
      setIsUpdating(null);
    },
  });

  const UpdateMutation = useMutation<
    Student,
    PostgrestError,
    { id: Student["studentId"]; updatedStudent: UpdatedStudent }
  >({
    mutationFn: updateStudent,
    onMutate: () => setLoading(true),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["students", user?.user_metadata.department_id],
      });
      setLoading(false);
    },
  });

  const DeleteMutation = useMutation<
    boolean,
    PostgrestError,
    Student["studentId"]
  >({
    mutationFn: deleteStudent,
    onMutate: () => setLoading(true),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["students", user?.user_metadata.department_id],
      });
      setLoading(false);
    },
  });

  const ClearMutation = useMutation<
    boolean,
    PostgrestError,
    AuthUser | undefined
  >({
    mutationFn: clearStudents,
    onMutate: () => setLoading(true),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["students", user?.user_metadata.department_id],
      });
      setLoading(false);
    },
  });

  async function AddStudent(
    student: NewStudent,
    options?: MutationOptions<Student, NewStudent>,
  ) {
    const { mutateAsync, isSuccess, data } = AddMutation;

    await mutateAsync(student, options);

    return isSuccess ? data : null;
  }

  async function IncrementStudentVisits(
    studentId: Student["studentId"],
    options?: MutationOptions<Student, Student["studentId"]>,
  ) {
    const { mutateAsync, isSuccess, data } = IncrementMutation;

    await mutateAsync(studentId, options);

    return isSuccess ? data : null;
  }

  async function UpdateStudent(
    id: Student["studentId"],
    updatedStudent: UpdatedStudent,
    options?: MutationOptions<
      Student,
      { id: Student["studentId"]; updatedStudent: UpdatedStudent }
    >,
  ) {
    const { mutateAsync, isSuccess, data } = UpdateMutation;

    await mutateAsync({ id, updatedStudent }, options);

    return isSuccess ? data : null;
  }

  async function DeleteStudent(
    id: Student["studentId"],
    options?: MutationOptions<boolean, Student["studentId"]>,
  ) {
    const { mutateAsync, isSuccess } = DeleteMutation;

    await mutateAsync(id, options);

    return isSuccess;
  }

  async function ClearStudents(
    options?: MutationOptions<boolean, AuthUser | undefined>,
  ) {
    const { mutateAsync, isSuccess } = ClearMutation;

    await mutateAsync(user, options);

    return isSuccess;
  }

  return {
    Students,
    Loading: Loading || isLoading,
    IsUpdating,
    AddStudent,
    IncrementStudentVisits,
    ClearStudents,
    UpdateStudent,
    DeleteStudent,
  };
}
