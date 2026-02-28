import { createClient } from "@supabase/supabase-js";

export const project_url: string = import.meta.env.VITE_PROJECT_URL;
const database_key: string = import.meta.env.VITE_DATABASE_KEY;

export const supabaseClient = createClient(project_url, database_key);
