import type { Student, StudentInput } from "@/types/students";

// Formatting the Date to this format: Day, Month, Year at HH:MM AM/PM
export function formatDate(_date?: string) {
  const date = _date ? new Date(_date) : new Date();

  return date.toLocaleString("en-LB", {
    timeZone: "Asia/Beirut",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// Preventing duplication in the Table
export function checkDupes(
  students: Student[],
  studentInput: StudentInput,
): boolean {
  students.forEach((student) => {
    if (
      student.studentId === studentInput.studentId ||
      student.email === studentInput.email
    ) {
      return true;
    }
  });
  return false;
}