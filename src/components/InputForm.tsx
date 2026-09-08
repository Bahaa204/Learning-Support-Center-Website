import type { InputFormProps } from "@/types/types";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "./ui/field";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import PasswordInput from "./PasswordInput";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { useState, type SubmitEvent } from "react";
import CoursesMenu from "./CoursesMenu";
import { DateTimePicker } from "./DateTimePicker.tsx";
// import TimeSlots from "./TimeSlots.tsx";
import {
  validateStudentInput,
  validateUserInput,
} from "@/helper/validation.ts";
import { Spinner } from "./ui/spinner.tsx";
import TimeSlots from "./TimeSlots.tsx";

export default function InputForm({
  isSubmitting,
  mode,
  handleStudentSubmit,
  handleUserSubmit,
  studentInput,
  userInput,
  updateFields,
  Departments,
  formError,
}: InputFormProps) {
  const isStudent = mode === "student";

  if (isStudent) return <h1>test</h1>;

  return <h1>test</h1>;
}
