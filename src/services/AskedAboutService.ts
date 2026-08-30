import { supabaseClient } from "@/supabase-client";
import type {
  AskedAbout,
  AskedAboutInsert,
  AskedAboutUpdate,
} from "@/types/asked_about";
import type { Data } from "@/types/types";

export async function fetchAskedAbout() {
  const { data, error } = (await supabaseClient
    .from("Asked_About")
    .select("*")) as Data<AskedAbout[]>;

  if (error) throw error;

  return data;
}

export async function addAskedAbout(AskedAbout: AskedAboutInsert) {
  const { data, error } = (await supabaseClient
    .from("Asked_About")
    .insert(AskedAbout)
    .select("*")
    .single()) as Data<AskedAbout>;


  if (error) throw error;

  return data;
}

export async function updateAskedAbout({
  id,
  AskedAbout,
}: {
  id: AskedAbout["id"];
  AskedAbout: AskedAboutUpdate;
}) {
  const { data, error } = (await supabaseClient
    .from("Asked_About")
    .update(AskedAbout)
    .eq("id", id)
    .select("*")
    .single()) as Data<AskedAbout>;

  if (error) throw error;

  return data;
}

export async function removeAskedAbout(id: AskedAbout["id"]) {
  const { error } = await supabaseClient
    .from("Asked_About")
    .delete()
    .eq("id", id);

  if (error) throw error;

  return true;
}

export async function bulkRemoveAskedAbout(ids: AskedAbout["id"][]) {
  const { error } = await supabaseClient
    .from("Asked_About")
    .delete()
    .in("id", ids);

  if (error) throw error;

  return true;
}

export async function bulkAddAskedAbout(rows: AskedAboutInsert[]) {
  const { data, error } = (await supabaseClient
    .from("Asked_About")
    .insert(rows)
    .select("*")) as Data<AskedAbout[]>;

  if (error) throw error;

  return data;
}
