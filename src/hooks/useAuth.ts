import { invokeFunction } from "@/lib/invokeFunction";
import { supabaseClient } from "@/supabase-client";
import type { Department } from "@/types/department";
import { type Session, type User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CustomError } from "@/types/types";
import {
  updateProfilePicture,
  type updateProfilePictureParams,
} from "@/services/ProfilePictureService";

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

  const UpdateProfileMutation = useMutation<
    boolean,
    CustomError,
    updateProfilePictureParams
  >({
    mutationFn: updateProfilePicture,
    onMutate: () => setLoading(true),
    onSettled: () => setLoading(false),
  });

  async function UpdateProfilePicture(file: File) {
    const { mutateAsync, isSuccess } = UpdateProfileMutation;

    await mutateAsync({
      user: Session?.user,
      bucketName: bucketName,
      file: file,
      fileSizeLimit: fileSizeLimit,
    });

    return isSuccess;
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

  async function SendEmail(
    to: string,
    from: string,
    subject: string,
    message: string,
    replyTo?: string
  ) {
    resetSates();
    const { error } = await invokeFunction(supabaseClient, "sendEmail", {
      to,
      from,
      subject,
      message,
      replyTo,
    });

    if (error) {
      setError(error);
      return false;
    }
    setLoading(false);
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
    SendEmail
  };
}
