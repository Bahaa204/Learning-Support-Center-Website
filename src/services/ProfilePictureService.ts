import { supabaseClient } from "@/supabase-client";
import { StorageError } from "@supabase/storage-js";
import { AuthError, type User as AuthUser } from "@supabase/supabase-js";

export type updateProfilePictureParams = {
  user: AuthUser | undefined;
  fileSizeLimit: number;
  bucketName: string;
  file: File;
};

export async function updateProfilePicture({
  user,
  bucketName,
  fileSizeLimit,
  file,
}: updateProfilePictureParams) {
  console.log("called the function");

  if (!user) throw new AuthError("No Authenticated User", 401, "no_user");

  console.log("passed user auth");

  if (file.size > fileSizeLimit)
    throw new StorageError(
      `File size exceeds ${fileSizeLimit / (1024 * 1024)}MB limit`,
    );

  const path = `${user.id}/profile_picture`;

  console.log("Uploading to path:", path, "and file size:", file.size);

  const { error: UploadError } = await supabaseClient.storage
    .from(bucketName)
    .upload(path, file, { upsert: true, cacheControl: "0" });

  if (UploadError) throw UploadError;

  const { data } = supabaseClient.storage.from(bucketName).getPublicUrl(path);

  if (!data?.publicUrl)
    throw new StorageError("Failed to retrieve public URL after upload");

  const { error: UpdateError } = await supabaseClient.auth.updateUser({
    data: {
      avatar_url: data.publicUrl,
    },
  });

  if (UpdateError) throw UpdateError;

  return true;
}
