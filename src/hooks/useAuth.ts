import type { EdgeFunctionError } from "@/lib/functions.types";
import { invokeFunction } from "@/lib/invokeFunction";
import { supabaseClient } from "@/supabase-client";
import { StorageError } from "@supabase/storage-js";
import type { Department } from "@/types/department";
import {
  AuthError,
  PostgrestError,
  type Session,
  type User,
} from "@supabase/supabase-js";
import { useEffect, useState } from "react";

type Error = PostgrestError | AuthError | StorageError | EdgeFunctionError;

export function useAuth() {
  const [Session, setSession] = useState<Session | null>(null);
  const [Loading, setLoading] = useState<boolean>(true);
  const [Error, setError] = useState<string>("");

  const bucketName = "Profile Pictures";

  //Helper reset some tates
  function resetSates() {
    setLoading(true);
    setError("");
  }

  // Helper function to set the error
  function SetError(error: Error) {
    const msg = `An Error has occured\n Error message: ${error.message}`;
    console.error(msg);
    setError(msg);
    setLoading(false);
  }

  useEffect(() => {
    async function getSession() {
      resetSates();

      const { data, error: SessionError } =
        await supabaseClient.auth.getSession();

      if (SessionError) return SetError(SessionError);

      setSession(data.session);
      setLoading(false);
    }

    getSession();

    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      (_event, session) => {
        resetSates();
        setSession(session);
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
      SetError(SignInError);
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
      SetError(SignUpError);
      return null;
    }

    setLoading(false);
    return data;
  }

  async function SignOut() {
    resetSates();

    const { error: SignOutError } = await supabaseClient.auth.signOut();

    if (SignOutError) {
      SetError(SignOutError);
      return false;
    }

    localStorage.removeItem("profilePicture");
    // window.dispatchEvent(new Event("profilePictureUpdated"));
    setLoading(false);
    return true;
  }

  async function RestoreSession(prevSession: Session) {
    const { error } = await supabaseClient.auth.setSession(prevSession);
    if (error) {
      SetError(error);
      return false;
    }
    setLoading(false);
    return true;
  }

  async function DeleteUser(id: User["id"]) {
    resetSates();

    const { error } = await invokeFunction(supabaseClient, "deleteUser", {
      userId: id,
    });
    if (error) {
      SetError(error);
      return false;
    }
    setLoading(false);
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

    return DeletionSummary;
  }

  /**
   * Update the current user's display name.
   * @param displayName - New display name
   * @returns true if successful, false otherwise
   */
  async function UpdateDisplayName(displayName: string) {
    resetSates();

    const { error } = await supabaseClient.auth.updateUser({
      data: {
        display_name: displayName,
      },
    });

    if (error) {
      SetError(error);
      return false;
    }

    setLoading(false);
    return true;
  }

  /**
   * Update the current user's password directly (not via email).
   * @param newPassword - The new password
   * @returns true if successful, false otherwise
   */
  async function UpdatePassword(newPassword: string) {
    resetSates();

    const { error } = await supabaseClient.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      SetError(error);
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
      SetError(error);
      return false;
    }

    const path = `${user.id}/profile_picture`;

    const { error: UploadError } = await supabaseClient.storage
      .from(bucketName)
      .upload(path, file, { upsert: true, cacheControl: "0" });

    if (UploadError) {
      SetError(UploadError);
      return false;
    }

    const { data } = supabaseClient.storage.from(bucketName).getPublicUrl(path);

    if (!data?.publicUrl) {
      const error = new StorageError(
        "Failed to retrieve public URL after upload",
      );
      SetError(error);
      return false;
    }

    const { error: UpdateError } = await supabaseClient.auth.updateUser({
      data: {
        avatar_url: data.publicUrl,
      },
    });

    if (UpdateError) {
      SetError(UpdateError);
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
      SetError(DeleteError);
      return false;
    }

    const { error: UpdateError } = await supabaseClient.auth.updateUser({
      data: {
        avatar_url: null,
      },
    });

    if (UpdateError) {
      SetError(UpdateError);
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
    RestoreSession,
    DeleteUser,
    DeleteNonAdminUsers,
    UpdateDisplayName,
    UpdatePassword,
    UpdateProfilePicture,
    DeleteProfilePicture,
  };
}
