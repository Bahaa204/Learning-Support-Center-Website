import type { AsyncSubmitFunction, Tables, UpdateFieldsType } from "./types";

type StudentsTable = Tables["Students"];

export type Student = StudentsTable["Row"];

export type NewStudent = StudentsTable["Insert"];

export type UpdatedStudent = StudentsTable["Update"];

export type StudentInput = {
  studentName: Student["studentName"];
  department_id: Student["department_id"];
  studentId: Student["studentId"];
  email?: Student["email"];
  askedCourses: string[];
  visitDateTime: string;
};

export type StudentMode = {
  mode: "student";
  studentInput: StudentInput;
  handleStudentSubmit: AsyncSubmitFunction;
  updateFields: UpdateFieldsType<StudentInput>;
  userInput?: never;
  handleUserSubmit?: never;
};
