import { useEffect } from "react";
import { PostgrestError } from "@supabase/supabase-js";
import type { NewUser, User } from "@/types/users";
import { supabaseClient } from "@/supabase-client";
import type { User as AuthUser } from "@supabase/supabase-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addUser, fetchUsers, removeUser } from "@/services/UsersService";
import type { MutationOptions } from "@/types/types";

export function useUsers(user: AuthUser | undefined) {
  const queryClient = useQueryClient();

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

  const { data: Users, isLoading: Loading } = useQuery<User[], PostgrestError>({
    queryKey: ["users"],
    queryFn: () => fetchUsers(user),
    enabled: !!user,
  });

  const AddMutation = useMutation<User, PostgrestError, NewUser>({
    mutationFn: addUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const DeleteMutation = useMutation<boolean, PostgrestError, User["id"]>({
    mutationFn: removeUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
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

  return {
    Users,
    Loading,
    AddUser,
    RemoveUser,
  };
}
