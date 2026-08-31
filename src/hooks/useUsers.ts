import { useEffect, useState } from "react";
import { PostgrestError } from "@supabase/supabase-js";
import type { NewUser, UpdatedUser, User } from "@/types/users";
import { supabaseClient } from "@/supabase-client";
import type { User as AuthUser } from "@supabase/supabase-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addUser,
  fetchUsers,
  removeUser,
  updateUser,
} from "@/services/UsersService";
import type { MutationOptions } from "@/types/types";

export function useUsers(user: AuthUser | undefined, enableFetch = true) {
  const queryClient = useQueryClient();
  const [Loading, setLoading] = useState<boolean>(false);
  const [Error, setError] = useState<PostgrestError | null>(null);

  useEffect(() => {
    const channel = supabaseClient.channel("Users Channel");

    channel
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "Users" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["users"] });
        },
      )
      .subscribe((status) => {
        console.log("Users Channel:", status);
      });

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [user]);

  const {
    data: Users,
    isLoading,
    error: QueryError,
  } = useQuery<User[], PostgrestError>({
    queryKey: ["users"],
    queryFn: () => fetchUsers(user),
    enabled: enableFetch && !!user,
  });

  const AddMutation = useMutation<User, PostgrestError, NewUser>({
    mutationFn: addUser,
    onMutate: () => setLoading(true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onSettled: (_data, error) => {
      if (error) setError(error);
      setLoading(false);
    },
  });

  const DeleteMutation = useMutation<boolean, PostgrestError, User["id"]>({
    mutationFn: removeUser,
    onMutate: () => setLoading(true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onSettled: (_data, error) => {
      if (error) setError(error);
      setLoading(false);
    },
  });

  const UpdateMutation = useMutation<
    User,
    PostgrestError,
    { userId: User["id"]; updatedUser: UpdatedUser }
  >({
    mutationFn: ({ userId, updatedUser }) =>
      updateUser({ userId, updatedUser }),
    onMutate: () => setLoading(true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onSettled: (_data, error) => {
      if (error) setError(error);
      setLoading(false);
    },
  });

  async function AddUser(
    User: NewUser,
    options?: MutationOptions<User, NewUser>,
  ) {
    const { mutateAsync, isSuccess, data } = AddMutation;

    await mutateAsync(User, options);

    return isSuccess ? data : null;
  }

  async function RemoveUser(
    id: User["id"],
    options?: MutationOptions<boolean, User["id"]>,
  ) {
    const { mutateAsync, isSuccess } = DeleteMutation;

    await mutateAsync(id, options);

    return isSuccess;
  }

  async function UpdateUser(
    userId: User["id"],
    updatedUser: UpdatedUser,
    options?: MutationOptions<
      User,
      { userId: User["id"]; updatedUser: UpdatedUser }
    >,
  ) {
    const { mutateAsync, isSuccess, data } = UpdateMutation;

    await mutateAsync({ userId, updatedUser }, options);

    return isSuccess ? data : null;
  }

  return {
    Users,
    Loading: Loading || isLoading,
    Error: QueryError || Error,
    AddUser,
    RemoveUser,
    UpdateUser,
  };
}
