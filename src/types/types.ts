import type { AuthError, PostgrestError } from "@supabase/supabase-js";
import type { Dispatch, SetStateAction, SubmitEvent } from "react";
import type { Database } from "../../database.types";
import type { UserMode } from "./users";
import type { Department } from "./department";
import type { Student, StudentMode } from "./students";
import type { EdgeFunctionError } from "@/lib/functions.types";
import { StorageError } from "@supabase/storage-js";
import type { MutationOptions as Mutationoptions } from "@tanstack/react-query";

export type UpdaterFunction<T> = Dispatch<SetStateAction<T>>;

export type AsyncSubmitFunction = (
  event: SubmitEvent<HTMLFormElement>,
) => Promise<boolean>;

export type UpdateFieldsType<T> = (fields: Partial<T>) => void;

type PublicSchema = Database["public"];

export type Tables = PublicSchema["Tables"];

export type Data<T> =
  | {
      data: T;
      error: null;
    }
  | { data: null; error: PostgrestError };

export type InputFormProps = {
  isSubmitting: boolean;
  Departments: Department[];
  formError: string;
} & (StudentMode | UserMode);

export type ErrorNotice = {
  id: Student["studentId"];
  message: string;
};

export type BreadcrumbItem = {
  label: string;
  path: string;
};

export type Item = {
  name: string;
  description: string;
  avatar?: string;
  actions: ItemAction[];
};

type ItemAction = {
  name: string;
  link: string;
  icon: string;
};

export type CustomError =
  | PostgrestError
  | AuthError
  | StorageError
  | EdgeFunctionError;

export type MutationOptions<TData, TVariables> = Mutationoptions<
  TData,
  PostgrestError,
  TVariables
>;
