import { useEffect, useState } from "react";
import { supabaseClient } from "@/supabase-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  AskedAbout,
  AskedAboutInsert,
  AskedAboutUpdate,
} from "@/types/asked_about";
import {
  addAskedAbout,
  bulkAddAskedAbout,
  bulkRemoveAskedAbout,
  fetchAskedAbout,
  removeAskedAbout,
  updateAskedAbout,
} from "@/services/AskedAboutService";
import type { PostgrestError } from "@supabase/supabase-js";

export default function useAskedAbout() {
  const queryClient = useQueryClient();

  const [Loading, setLoading] = useState<boolean>(false);
  const [Error, setError] = useState<PostgrestError | null>(null);

  useEffect(() => {
    const channel = supabaseClient.channel("Asked About Channel");

    channel
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Asked_About" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["AskedAbout"] });
        },
      )
      .subscribe((status) => {
        console.log("Asked About Channel:", status);
      });

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, []);

  const {
    data: AskedAbout,
    isLoading,
    error: QueryError,
  } = useQuery<AskedAbout[], PostgrestError>({
    queryKey: ["AskedAbout"],
    queryFn: fetchAskedAbout,
  });

  const AddMutation = useMutation<AskedAbout, PostgrestError, AskedAboutInsert>(
    {
      mutationFn: addAskedAbout,
      onMutate: () => setLoading(true),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["AskedAbout"] });
      },
      onSettled: (_data, error) => {
        if (error) setError(error);
        setLoading(false);
      },
    },
  );

  const UpdateMutation = useMutation<
    AskedAbout,
    PostgrestError,
    { id: AskedAbout["id"]; AskedAbout: AskedAboutUpdate }
  >({
    mutationFn: updateAskedAbout,
    onMutate: () => setLoading(true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["AskedAbout"] });
    },
    onSettled: (_data, error) => {
      if (error) setError(error);
      setLoading(false);
    },
  });

  const RemoveMutation = useMutation<boolean, PostgrestError, AskedAbout["id"]>(
    {
      mutationFn: removeAskedAbout,
      onMutate: () => setLoading(true),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["AskedAbout"] });
      },
      onSettled: (_data, error) => {
        if (error) setError(error);
        setLoading(false);
      },
    },
  );

  const BulkRemoveMutation = useMutation<
    boolean,
    PostgrestError,
    AskedAbout["id"][]
  >({
    mutationFn: bulkRemoveAskedAbout,
    onMutate: () => setLoading(true),
    onSettled: (_data, error) => {
      if (error) setError(error);
      setLoading(false);
    },
  });

  const BulkAddMuation = useMutation<
    AskedAbout[],
    PostgrestError,
    AskedAboutInsert[]
  >({
    mutationFn: bulkAddAskedAbout,
    onMutate: () => setLoading(true),
    onSettled: (_data, error) => {
      if (error) setError(error);
      setLoading(false);
    },
  });

  async function AddAskedAbout(AskedAbout: AskedAboutInsert) {
    const { mutateAsync, isSuccess, data } = AddMutation;

    console.log("called add with AskedAbout: ", AskedAbout);

    await mutateAsync(AskedAbout, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["AskedAbout"] });
      },
    });

    if (isSuccess) return data;
  }

  async function UpdateAskedAbout(
    id: AskedAbout["id"],
    AskedAbout: AskedAboutUpdate,
  ) {
    const { mutateAsync, isSuccess, data } = UpdateMutation;

    await mutateAsync(
      { id, AskedAbout },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["AskedAbout"] });
        },
      },
    );

    if (isSuccess) return data;
  }

  async function RemoveAskedAbout(id: AskedAbout["id"]) {
    const { mutateAsync, isSuccess } = RemoveMutation;

    await mutateAsync(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["AskedAbout"] });
      },
    });

    if (isSuccess) return true;
  }

  async function syncStudentCourses(
    studentId: AskedAbout["student_Id"],
    courseCodes: AskedAbout["course_code"][],
  ) {
    const uniqueCourseCodes = Array.from(new Set(courseCodes));
    const existingRecords = AskedAbout?.filter(
      (record) => record.student_Id === studentId,
    );

    const existingCourseCodeSet = new Set(
      existingRecords?.map((record) => record.course_code),
    );

    const idsToDelete = existingRecords
      ?.filter((record) => !uniqueCourseCodes.includes(record.course_code))
      .map((record) => record.id);

    const codesToInsert = uniqueCourseCodes.filter(
      (courseCode) => !existingCourseCodeSet.has(courseCode),
    );

    if (idsToDelete && idsToDelete.length > 0) {
      await BulkRemoveMutation.mutateAsync(idsToDelete);
    }

    if (codesToInsert.length > 0) {
      const rowsToInsert: AskedAboutInsert[] = codesToInsert.map(
        (courseCode) => ({
          student_Id: studentId,
          course_code: courseCode,
        }),
      );

      await BulkAddMuation.mutateAsync(rowsToInsert);
    }

    queryClient.invalidateQueries({ queryKey: ["AskedAbout"] });

    return true;
  }

  return {
    AskedAbout,
    Loading: Loading || isLoading,
    Error: QueryError || Error,
    AddAskedAbout,
    UpdateAskedAbout,
    RemoveAskedAbout,
    syncStudentCourses,
  };
}
