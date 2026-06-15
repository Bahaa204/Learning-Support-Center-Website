import { invokeFunction } from "@/lib/invokeFunction";
import { supabaseClient } from "@/supabase-client";
import { StorageError } from "@supabase/storage-js";
import type { Department } from "@/types/department";
import { AuthError, type Session, type User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { CustomError } from "@/types/types";

export function useAuth() {
  const [Session, setSession] = useState<Session | null>(null);
  const [Loading, setLoading] = useState<boolean>(true);
  const [Error, setError] = useState<CustomError | null>(null);

  const queryClient = useQueryClient();

  const bucketName = "Profile Pictures";
  const fileSizeLimit = 1 * 1024 * 1024; // 1MB

  //Helper reset some tates
  function resetSates() {
    setLoading(true);
    setError(null);
  }

  useEffect(() => {
    async function getSession() {
      resetSates();

      const { data, error: SessionError } =
        await supabaseClient.auth.getSession();

      if (SessionError) return setError(SessionError);

      setSession(data.session);
      setLoading(false);
    }

    getSession();

    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      (_event, session) => {
        resetSates();
        setSession(session);
        queryClient.invalidateQueries();
        setLoading(false);
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [Error]);

  async function SignInWithPassword(email: string, password: string) {
    resetSates();

    const { error: SignInError } = await supabaseClient.auth.signInWithPassword(
      {
        email,
        password,
      },
    );

    if (SignInError) {
      setError(SignInError);
      return false;
    }

    setLoading(false);
    return true;
  }

  async function SignUp(
    email: string,
    password: string,
    displayname: string,
    isSupervisor: boolean,
    department_id: Department["id"],
  ) {
    resetSates();

    const { data, error: SignUpError } = await invokeFunction(
      supabaseClient,
      "createUser",
      { email, password, displayname, isSupervisor, department_id },
    );

    if (SignUpError) {
      setError(SignUpError);
      return null;
    }

    setLoading(false);
    queryClient.invalidateQueries({ queryKey: ["users"] });

    return data;
  }

  async function SignOut() {
    resetSates();

    const { error: SignOutError } = await supabaseClient.auth.signOut();

    if (SignOutError) {
      setError(SignOutError);
      return false;
    }

    queryClient.clear();

    setLoading(false);
    return true;
  }

  async function DeleteUser(id: User["id"]) {
    resetSates();

    const { error } = await invokeFunction(supabaseClient, "deleteUser", {
      userId: id,
    });

    if (error) {
      setError(error);
      return false;
    }
    setLoading(false);
    queryClient.invalidateQueries({ queryKey: ["users"] });
    return true;
  }

  async function DeleteNonAdminUsers() {
    resetSates();

    const DeletionSummary = await invokeFunction(
      supabaseClient,
      "deleteAllNonAdminUsers",
      {},
    );
    setLoading(false);
    queryClient.invalidateQueries({ queryKey: ["users"] });

    return DeletionSummary;
  }

  async function UpdateDisplayName(displayName: string) {
    resetSates();

    const { error } = await supabaseClient.auth.updateUser({
      data: {
        display_name: displayName,
      },
    });

    if (error) {
      setError(error);
      return false;
    }

    setLoading(false);
    return true;
  }

  async function UpdatePassword(newPassword: string) {
    resetSates();

    const { error } = await supabaseClient.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setError(error);
      return false;
    }

    setLoading(false);
    return true;
  }

  async function UpdateProfilePicture(file: File) {
    resetSates();

    const user = Session?.user;

    if (!user) {
      const error = new AuthError("No Authenticated User", 401, "no_user");
      setError(error);
      return false;
    }

    if (file.size > fileSizeLimit) {
      const error = new StorageError(
        `File size exceeds ${fileSizeLimit / (1024 * 1024)}MB limit`,
      );
      setError(error);
      return false;
    }

    const path = `${user.id}/profile_picture`;

    const { error: UploadError } = await supabaseClient.storage
      .from(bucketName)
      .upload(path, file, { upsert: true, cacheControl: "0" });

    if (UploadError) {
      setError(UploadError);
      return false;
    }

    const { data } = supabaseClient.storage.from(bucketName).getPublicUrl(path);

    if (!data?.publicUrl) {
      const error = new StorageError(
        "Failed to retrieve public URL after upload",
      );
      setError(error);
      return false;
    }

    const { error: UpdateError } = await supabaseClient.auth.updateUser({
      data: {
        avatar_url: data.publicUrl,
      },
    });

    if (UpdateError) {
      setError(UpdateError);
      return false;
    }

    setLoading(false);
    return true;
  }

  async function DeleteProfilePicture(userId: User["id"]) {
    resetSates();

    const { error: DeleteError } = await supabaseClient.storage
      .from(bucketName)
      .remove([`${userId}/profile_picture`]);

    if (DeleteError) {
      setError(DeleteError);
      return false;
    }

    const { error: UpdateError } = await supabaseClient.auth.updateUser({
      data: {
        avatar_url: null,
      },
    });

    if (UpdateError) {
      setError(UpdateError);
      return false;
    }

    return true;
  }

  return {
    Session,
    Error,
    Loading,
    SignInWithPassword,
    SignUp,
    SignOut,
    DeleteUser,
    DeleteNonAdminUsers,
    UpdateDisplayName,
    UpdatePassword,
    UpdateProfilePicture,
    DeleteProfilePicture,
  };
}
