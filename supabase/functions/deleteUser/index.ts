import { corsHeaders } from "../_shared/cors.ts";
import { getAdminClient } from "../_shared/adminClient.ts";
import { jsonResponse, parseJsonBody } from "../_shared/response.ts";
import { serializeError } from "../_shared/errors.ts";

interface DeleteUserRequest {
  userId: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await parseJsonBody<DeleteUserRequest>(req);
    const { userId } = body;

    if (!userId || typeof userId !== "string") {
      return jsonResponse(
        { data: null, error: { message: "Missing or invalid field: userId" } },
        400,
      );
    }

    const supabaseAdmin = getAdminClient();

    const { data: fetchData, error: fetchError } =
      await supabaseAdmin.auth.admin.getUserById(userId);

    if (fetchError || !fetchData?.user) {
      return jsonResponse(
        {
          data: null,
          error: fetchError
            ? serializeError(fetchError)
            : { message: "User not found" },
        },
        404,
      );
    }

    const role = fetchData.user.user_metadata?.role;

    if (role === "admin") {
      return jsonResponse(
        { data: null, error: { message: "Admin users cannot be deleted" } },
        403,
      );
    }

    // Delete profile picture from storage
    const bucketName = Deno.env.get("VITE_PROFILE_PICTURES_BUCKET");
    const profilePictureFolder = `${userId}`;

    if (!bucketName) {
      return jsonResponse(
        {
          data: null,
          error: { message: "VITE_PROFILE_PICTURES_BUCKET is not configured" },
        },
        500,
      );
    }

    // List and delete all files in the user's profile picture folder
    const { data: filesData, error: listError } = await supabaseAdmin.storage
      .from(bucketName)
      .list(profilePictureFolder);

    if (!listError && filesData && filesData.length > 0) {
      const profilePictureFiles = filesData as Array<{ name: string }>;
      const filesToDelete = profilePictureFiles
        .filter((file) => file.name !== ".emptyFolderPlaceholder")
        .map((file) => `${profilePictureFolder}/${file.name}`);

      if (filesToDelete.length > 0) {
        await supabaseAdmin.storage.from(bucketName).remove(filesToDelete);
      }
    }

    // Delete user from auth
    const { error: deleteError } =
      await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteError) {
      return jsonResponse(
        { data: null, error: serializeError(deleteError) },
        400,
      );
    }

    return jsonResponse(
      { data: { message: `User ${userId} deleted successfully` }, error: null },
      200,
    );
  } catch (err: unknown) {
    return jsonResponse({ data: null, error: serializeError(err) }, 500);
  }
});
