import { useState, type SubmitEvent } from "react";
import type { LoginInput, User } from "../types/types";
import { supabaseClient } from "../supabase-client";
import { Navigate } from "react-router-dom";
import deleteImage from "../assets/Images/delete_24dppng.png";
import { titleCase } from "title-case";
import { getName } from "../helper/functions";
import Spinner from "../components/Spinner";
import SmallSpinnerButton from "../components/SmallSpinnerButton";
import SpinnerButton from "../components/SpinnerButton";
import { useAuth } from "../hooks/useAuth";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { UseUsers } from "../hooks/useUsers";
import { useServices } from "../hooks/useServices";

export default function WorkStudy() {
  useDocumentTitle("Workstudy");

  const InitialValue: LoginInput = { username: "", password: "" };

  const [Input, setInput] = useState<LoginInput>(InitialValue);
  const { Session, Loading: AuthLoading, Error: AuthError, SignUp } = useAuth();

  const name = getName(Session);

  const { Users, Loading: UsersLoading, Error: UsersError } = UseUsers();
  const { addUser, deleteUser, isAdding, isDeleting } = useServices();

  const loading = AuthLoading || UsersLoading;
  const error = AuthError || UsersError;

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isAdding) return;
    if (name !== "Laraabouorm") {
      alert("You cannot insert any user");
      return;
    }

    const prevSession = Session;

    await SignUp(Input.username, Input.password);

    if (prevSession) await supabaseClient.auth.setSession(prevSession);

    const newUser: User = {
      id: crypto.randomUUID(),
      username: titleCase(Input.username),
      password: Input.password,
    };

    const ok = await addUser(newUser);

    if (ok) setInput(InitialValue);
  }

  async function handleClick(userId: string) {
    if (isDeleting === userId) return;
    if (name !== "Laraabouorm") {
      alert("You cannot delete any user");
      return;
    }

    await deleteUser(userId);
  }

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

  if (loading) {
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

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="d-flex flex-wrap flex-column flex-wrap gap-3 justify-content-center align-items-center"
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
        {isAdding ? (
          <SpinnerButton />
        ) : (
          <button type="submit" className="btn btn-dark" disabled={isAdding}>
            Submit
          </button>
        )}
      </form>

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
                      {isDeleting === user.id ? (
                        <SmallSpinnerButton />
                      ) : (
                        <button
                          className="btn btn-sm btn-danger hover-btn"
                          onClick={() => handleClick(user.id)}
                          disabled={isDeleting === user.id}
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
