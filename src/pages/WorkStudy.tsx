import { useEffect, useState, type SubmitEvent } from "react";
import type { LoginInput, User } from "../types/types";
import { supabaseClient } from "../supabase-client";
import { Navigate, useNavigate } from "react-router-dom";
import deleteImage from "../assets/Images/delete_24dppng.png";
import { titleCase } from "title-case";
import { useFetchFromTable, useGetSession } from "../hooks/CustomHooks";

export default function WorkStudy() {
  const [Input, setInput] = useState<LoginInput>({
    username: "",
    password: "",
  });
  const { Session, Loading: SessionLoading } = useGetSession();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [Users, setUsers] = useState<User[]>([]);
  const { Data, Error, Loading } = useFetchFromTable<"Users">("Users", "Lara");

  // Real Time Listeners to update the State
  useEffect(() => {
    (async () => setUsers(Data))();
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
        console.log(status);
      });

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, []);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isEditing) return;
    setIsEditing(true);

    const email = `${Input.username}@learningcenter.com`;
    const password = Input.password;

    const { error: SignUpError } = await supabaseClient.auth.signUp({
      email,
      password,
    });

    if (SignUpError) {
      console.error("An Error has occurred: ", SignUpError.message);
      return;
    }

    await supabaseClient.auth.signInWithPassword({
      email: "lara@learningcenter.com",
      password: "supportcenter",
    });

    const newUser: User = {
      id: crypto.randomUUID(),
      username: titleCase(Input.username),
      password: Input.password,
    };

    const { error: InsertError } = await supabaseClient
      .from("Users")
      .insert(newUser)
      .single();

    if (InsertError) {
      console.error("An Error has occurred: ", InsertError.message);
      return;
    }

    setInput({ username: "", password: "" });

    setIsEditing(false);
  }

  async function handleClick(user: User) {
    if (isEditing) return;
    setIsEditing(true);

    const { error: DeleteError } = await supabaseClient
      .from("Users")
      .delete()
      .eq("id", user.id);

    if (DeleteError) {
      console.error("An Error has occurred: ", DeleteError.message);
      return;
    }

    setIsEditing(false);
  }

  if (SessionLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "50vh" }}
      >
        {SessionLoading ? "Checking Authentication" : "Loading Data"} Please
        Wait...
      </div>
    );
  }

  if (!Session) {
    return <Navigate to="/login" replace />;
  }

  if (Error) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "50vh" }}
      >
        {Error}
      </div>
    );
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="d-flex flex-column flex-wrap gap-3 justify-content-center align-items-center"
        style={{ height: "50vh" }}
      >
        <div className="form-group">
          <label htmlFor="name">WorkStudy Name:</label>
          <input
            required
            type="text"
            className="form-control border-2 border-secondary"
            id="name"
            value={Input.username}
            onChange={(event) => {
              setInput((prev) => ({
                ...prev,
                username: event.target.value,
              }));
            }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="id">WorkStudy ID:</label>
          <input
            required
            type="text"
            id="id"
            className="form-control border-2 border-secondary"
            value={Input.password}
            onChange={(event) => {
              setInput((prev) => ({
                ...prev,
                password: event.target.value.trim(),
              }));
            }}
          />
        </div>
        <button type="submit" className="btn btn-dark" disabled={isEditing}>
          Submit
        </button>
      </form>

      {Loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "50vh" }}
        >
          Loading Data Please Wait...
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-center mb-5">
            <button
              className="btn btn-success"
              onClick={() => {
                navigate("/");
              }}
            >
              Go Back
            </button>
          </div>

          <div
            className="table-responsive"
            style={{ maxHeight: "50vh", overflowY: "auto" }}
          >
            <table className="table table-secondary table-striped table-hover table-bordered text-center align-middle">
              <thead className="table-light">
                <tr className="sticky-top">
                  <th scope="col">WorkStudy ID</th>
                  <th scope="col">WorkStudy Name</th>
                </tr>
              </thead>
              <tbody>
                {Users.map((user) => {
                  if (user.username === "Lara") return;
                  return (
                    <tr key={user.password} className="text-center">
                      <th scope="row">{user.password}</th>
                      <td className="hover-cell">
                        <div className="d-flex flex-wrap align-items-center">
                          <span className="flex-grow-1 text-center">
                            {user.username}
                          </span>
                          <button
                            className="btn btn-sm btn-danger hover-btn"
                            onClick={() => handleClick(user)}
                            disabled={isEditing}
                          >
                            <img src={deleteImage} alt="delete user" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}
