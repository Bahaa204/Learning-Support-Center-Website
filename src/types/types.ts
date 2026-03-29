import type { PostgrestError } from "@supabase/supabase-js";
import type { Dispatch, SetStateAction, SubmitEvent } from "react";
import type { Database } from "../../database.types";

type UpdaterFunction<T> = Dispatch<SetStateAction<T>>;

type Tables = Database["public"]["Tables"];

export type TableName = keyof Tables;
export type RowType<T extends TableName> = Tables[T]["Row"];

export type Data<T extends TableName> = {
  data: RowType<T>[] | null;
  error: PostgrestError | null;
};

export type Student = RowType<"Students">;
export type User = RowType<"Users">;

export type LoginInput = { username: string; password: string };

export type Input = {
  name: string;
  id: number;
};

export type InputFormProps = {
  loading: boolean;
  Input: Input;
  setInput: UpdaterFunction<Input>;
  handleSubmit: (event: SubmitEvent<HTMLFormElement>) => Promise<void>;
};

export type TableProps = {
  Students: Student[];
  handleUpdate: (studentId: number) => Promise<void>;
  isUpdating: number | null;
};

export type SpinnerProps = { text: string };
