import type { CustomError } from "@/types/types";
import { PostgrestError } from "@supabase/supabase-js";
import { StorageError } from "@supabase/storage-js";

function simplifyError(error: CustomError) {
  const simplifiedError = error;

  const lowerMessage = simplifiedError.message.toLowerCase();

  if (
    lowerMessage.includes("duplicate key value") ||
    lowerMessage.includes("already exists")
  )
    simplifiedError.message = "This Student/User already exists.";

  if (
    lowerMessage.includes("invalid login") ||
    lowerMessage.includes("authentication failed")
  )
    simplifiedError.message = "Invalid email or password.";

  if (
    lowerMessage.includes("row-level security") ||
    lowerMessage.includes("permission denied")
  )
    simplifiedError.message = "You do not have permission to do that.";

  if (lowerMessage.includes("network") || lowerMessage.includes("fetch"))
    simplifiedError.message = "Network error. Please try again.";

  if (lowerMessage.includes("quota") || lowerMessage.includes("storage limit"))
    simplifiedError.message = "Storage Capacity Exceeded.";

  return simplifiedError;
}

export function SetErrorMessage(error: CustomError) {
  const simplifiedError = simplifyError(error);

  const isStorageError = simplifiedError instanceof StorageError;

  const msg = `An Error has occurred: ${simplifiedError.message} ${!isStorageError ? `(Error code: ${simplifiedError.code})` : ""}`;

  console.error("ERROR: ", error);
  return msg;
}

export function BuildCustomPostgrestError(
  message: string,
  code: string,
  details: string = "",
  hint: string = "",
) {
  return new PostgrestError({ message, code, details, hint });
}
