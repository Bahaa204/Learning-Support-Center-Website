import { BuildCustomPostgrestError } from "@/helper/errorhelpers";
import { supabaseClient } from "@/supabase-client";
import type { Data } from "@/types/types";
import type { NewUser, User } from "@/types/users";
import type { User as AuthUser } from "@supabase/supabase-js";

export async function fetchUsers(user: AuthUser | undefined) {
  if (!user)
    throw BuildCustomPostgrestError("User is not authenticated", "401");

  const { data, error } = (await supabaseClient
    .from("Users")
    .select("*")
    .eq("department_id", user.user_metadata.department_id)) as Data<User[]>;

  if (error) throw error;

  return data;
}

export async function addUser(user: NewUser) {
  const { data, error } = (await supabaseClient
    .from("Users")
    .insert(user)
    .select("*")
    .single()) as Data<User>;

  if (error) throw error;

  return data;
}

export async function removeUser(id: User["id"]) {
  const { error } = await supabaseClient.from("Users").delete().eq("id", id);

  if (error) throw error;

  return true;
}
