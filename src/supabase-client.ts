import { createClient } from "@supabase/supabase-js";
import type { Database } from "../database.types";

export const project_url: string = import.meta.env.VITE_PROJECT_URL;
const database_key: string = import.meta.env.VITE_DATABASE_KEY;

export const supabaseClient = createClient<Database>(project_url, database_key);
