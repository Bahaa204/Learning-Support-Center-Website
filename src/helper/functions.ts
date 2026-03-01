import { titleCase } from "title-case";
import type { Data } from "../types/types";
import type { Session } from "@supabase/supabase-js";

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

export function checkDupes(data: Data[], id: number): boolean {
  for (const student of data) {
    if (student.studentId === id) {
      return true;
    }
  }
  return false;
}

export function getName(session: Session | null): string {
  const email = session?.user.email || "";
  if (email) {
    const name = email.slice(0, email.indexOf("@"));
    return titleCase(name);
  }
  return "";
}
