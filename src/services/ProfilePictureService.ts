import { supabaseClient } from "@/supabase-client";
import { StorageError } from "@supabase/storage-js";
import { type User } from "@supabase/supabase-js";

export function getUserPath(user: User) {
  return `${user.id}/profile_picture`;
}

export async function uploadProfilePicture(
  bucketname: string,
  path: string,
  file: File,
) {
  const { error: UploadError } = await supabaseClient.storage
    .from(bucketname)
    .upload(path, file, { upsert: true, cacheControl: "0" });

  if (UploadError) return UploadError;
}

export async function updateUserAvatarData(bucketname: string, path: string) {
  const { data } = supabaseClient.storage.from(bucketname).getPublicUrl(path);

  if (!data?.publicUrl)
    return new StorageError("Failed to retrieve public URL after upload");

  const { error: UpdateError } = await supabaseClient.auth.updateUser({
    data: {
      avatar_url: data.publicUrl,
    },
  });

  if (UpdateError) return UpdateError;
}
