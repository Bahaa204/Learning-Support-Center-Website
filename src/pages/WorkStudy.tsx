import { useState, type SubmitEvent } from "react";
import type { LoginInput, User } from "../types/types";
import { supabaseClient } from "../supabase-client";
import { Navigate, useNavigate } from "react-router-dom";
import deleteImage from "../assets/Images/delete_24dppng.png";
import { titleCase } from "title-case";
import { getName } from "../helper/functions";
import Spinner from "../components/Spinner";
import SmallSpinnerButton from "../components/SmallSpinnerButton";
import SpinnerButton from "../components/SpinnerButton";
import { useAuth } from "../hooks/useAuth";
import { useFetchFromTable } from "../hooks/useFetchFromTable";
import { useRealTimeListeners } from "../hooks/useRealTimeListeners";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export default function WorkStudy() {
  useDocumentTitle("Workstudy");

  const InitialValue: LoginInput = { username: "", password: "" };

  const [Input, setInput] = useState<LoginInput>(InitialValue);
  const {
    Session,
    Loading: AuthLoading,
    Error: AuthError,
    SignInWithPassword,
    SignUp,
  } = useAuth();

  const name = getName(Session);
  const navigate = useNavigate();
  const [DeleteUser, setDeleteUser] = useState<string | null>(null);
  // const [Users, setUsers] = useState<User[]>([]);
  const {
    Data,
    Loading: DataLoading,
    Error: DataError,
  } = useFetchFromTable("Users", "Laraabouorm");

  const { Users } = useRealTimeListeners();

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (AuthLoading) return;
    if (name !== "Laraabouorm") {
      alert("You cannot insert any user");
      return;
    }

    await SignUp(Input.username, Input.password);

    await SignInWithPassword("laraabouorm@learningcenter.com", "supportcenter");

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
      alert(`An Error has occurred: ${InsertError.message}`);
      return;
    }

    setInput(InitialValue);
  }

  async function handleClick(user: User) {
    if (DeleteUser === user.id) return;
    if (name !== "Laraabouorm") {
      alert("You cannot delete any user");
      return;
    }
    setDeleteUser(user.id);

    const { error: DeleteError } = await supabaseClient
      .from("Users")
      .delete()
      .eq("id", user.id);

    if (DeleteError) {
      alert(`An Error has occurred: ${DeleteError.message}`);
      return;
    }

    setDeleteUser(null);
  }

  if (AuthLoading || DataLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "50vh" }}
      >
        <Spinner
          text={AuthLoading ? "Checking Authentication" : "Loading Data"}
        />
      </div>
    );
  }

  if (!Session) {
    return <Navigate to="/login" replace />;
  }

  const error = DataError || AuthError;
  if (error) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "50vh" }}
      >
        {error}
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
        {AuthLoading ? (
          <SpinnerButton />
        ) : (
          <button type="submit" className="btn btn-dark" disabled={AuthLoading}>
            Submit
          </button>
        )}
      </form>

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
              if (user.username === "Lara Abou Orm") return;
              return (
                <tr key={user.id} className="text-center">
                  <th scope="row">{user.password}</th>
                  <td className="hover-cell">
                    <div className="d-flex flex-wrap align-items-center">
                      <span className="flex-grow-1 text-center">
                        {user.username}
                      </span>
                      {DeleteUser === user.id ? (
                        <SmallSpinnerButton />
                      ) : (
                        <button
                          className="btn btn-sm btn-danger hover-btn"
                          onClick={() => handleClick(user)}
                          disabled={DeleteUser === user.id}
                        >
                          <img src={deleteImage} alt="delete user" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
