import type { PostgrestError } from "@supabase/supabase-js";
import type { Dispatch, SetStateAction } from "react";
import type { Database } from "../../database.types";

export type UpdaterFunction<T> = Dispatch<SetStateAction<T>>;

export type TableName = keyof Database["public"]["Tables"];
export type RowType<T extends TableName> =
  Database["public"]["Tables"][T]["Row"];

export type Data<T extends TableName> = {
  data: RowType<T>[] | null;
  error: PostgrestError | null;
};

export type Student = RowType<"Students">;
export type User = RowType<"Users">;

export type LoginInput = { username: string; password: string };

export type Input = {
  studentName: string;
  studentId: number;
};

export type Props = { Students: Student[] };
