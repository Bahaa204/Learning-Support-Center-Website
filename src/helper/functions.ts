import { titleCase } from "title-case";
import type { Student } from "../types/types";
import type { Session } from "@supabase/supabase-js";

// Formatting the Date to this format: Day, Month, Year at HH:MM AM/PM
export function formatDate(): string {
  return new Date().toLocaleString("en-LB", {
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
export function checkDupes(students: Student[], id: number): boolean {
  for (const student of students) {
    if (student.studentId === id) {
      return true;
    }
  }
  return false;
}

// Gets the name of the user from the current session
export function getName(session: Session | null): string {
  const email = session?.user.email || "";
  if (email) {
    const name = email.slice(0, email.indexOf("@"));
    return titleCase(name);
  }
  return "";
}
