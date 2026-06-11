import type { PostgrestError } from "@supabase/supabase-js";
import type { Dispatch, SetStateAction, SubmitEvent } from "react";
import type { Database } from "../../database.types";
import type { UserMode } from "./users";
import type { Department } from "./department";
import type { Student, StudentMode } from "./students";

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
  loading: boolean;
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
