import { useEffect, useState } from "react";
import { useFetchFromTable } from "./useFetchFromTable";
import type { User } from "../types/types";
import { supabaseClient } from "../supabase-client";

export function UseUsers() {
  const { Data, Loading, Error } = useFetchFromTable("Users", "Laraabouorm");

  const [Users, setUsers] = useState<User[]>([]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  // Sync fetched data to the local State
  useEffect(() => {
    setUsers(Data);
  }, [Data]);

  useEffect(() => {
    const channel = supabaseClient.channel("Users-Channel");

    channel
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "Users" },
        (payload) => {
          const newUser = payload.new as User;
          setUsers((prev) => [...prev, newUser]);
        },
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "Users" },
        (payload) => {
          const oldUser = payload.old as User;
          setUsers((prev) => prev.filter((user) => user.id !== oldUser.id));
        },
      )
      .subscribe((status) => {
        console.log("Users Channel:", status);
      });

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, []);

  async function addUser(user: User) {
    setIsAdding(true);

    const { error } = await supabaseClient.from("Users").insert(user).single();

    if (error) {
      const msg = `An Error Occurred: ${error.message}`;
      console.error(msg);
      setIsAdding(false);
      return false;
    }
    setIsAdding(false);
    return true;
  }

  async function deleteUser(userId: string) {
    setIsDeleting(userId);

    const { error } = await supabaseClient
      .from("Users")
      .delete()
      .eq("id", userId);

    if (error) {
      const msg = `An Error Occurred: ${error.message}`;
      console.error(msg);
      setIsDeleting(null);
      return false;
    }
    setIsDeleting(null);
    return true;
  }

  return { Users, Loading, Error, addUser, deleteUser, isAdding, isDeleting };
}
