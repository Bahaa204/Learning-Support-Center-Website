import { invokeFunction } from "@/lib/invokeFunction";
import { supabaseClient } from "@/supabase-client";
import type { Department } from "@/types/department";
import { AuthError, type Session, type User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { CustomError } from "@/types/types";
import {
  getUserPath,
  updateUserAvatarData,
  uploadProfilePicture,
} from "@/services/ProfilePictureService";

export function useAuth() {
  const [Session, setSession] = useState<Session | null>(null);
  const [Loading, setLoading] = useState<boolean>(true);
  const [Error, setError] = useState<CustomError | null>(null);

  const queryClient = useQueryClient();

  const bucketName = "Profile Pictures";

  //Helper reset some states
  function resetStates() {
    setLoading(true);
    setError(null);
  }

  function SetError(error: CustomError) {
    setLoading(false);
    setError(error);
  }

  useEffect(() => {
    async function getSession() {
      resetStates();

      const { data, error: SessionError } =
        await supabaseClient.auth.getSession();

      if (SessionError) return setError(SessionError);

      setSession(data.session);
      setLoading(false);
    }

    getSession();

    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      (_event, session) => {
        resetStates();
        setSession(session);
        queryClient.invalidateQueries();
        setLoading(false);
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function SignInWithPassword(email: string, password: string) {
    resetStates();

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
    resetStates();

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
    resetStates();

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
    resetStates();

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

  async function UpdateDisplayName(displayName: string) {
    resetStates();

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
    resetStates();

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
    resetStates();

    if (!Session?.user) {
      const error = new AuthError("No Authenticated User", 401, "no_user");
      SetError(error);
      return false;
    }

    const path = getUserPath(Session.user);

    const UploadError = await uploadProfilePicture(bucketName, path, file);

    if (UploadError) {
      SetError(UploadError);
      return false;
    }

    const UpdateError = await updateUserAvatarData(bucketName, path);

    if (UpdateError) {
      SetError(UpdateError);
      return false;
    }

    return true;
  }

  async function DeleteProfilePicture(userId: User["id"]) {
    resetStates();

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
    replyTo?: string,
  ) {
    resetStates();
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
    UpdateDisplayName,
    UpdatePassword,
    UpdateProfilePicture,
    DeleteProfilePicture,
    SendEmail,
  };
}
