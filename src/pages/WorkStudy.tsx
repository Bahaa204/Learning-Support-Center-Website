import { useEffect, useState, type SubmitEvent } from "react";
import type { LoginInput, User } from "../types/types";
import { supabaseClient } from "../supabase-client";
import { useDataContext } from "../context/context";
import { titleCase } from "title-case";
import { Navigate } from "react-router-dom";

export default function WorkStudy() {
  const [Users, setUsers] = useState<User[]>([]);
  const [Input, setInput] = useState<LoginInput>({
    username: "",
    password: "",
  });
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const { error, setError, Loading, setLoading, Session, name } =
    useDataContext();

  useEffect(() => {
    async function getUsers() {
      setLoading(false);
      setError(null);
      const { data, error } = await supabaseClient.from("Users").select("*");

      if (error) {
        console.error("An Error has occurred: ", error.message);
        setError(`Failed to increment visits. Error message: ${error.message}`);
        return;
      }
      setUsers(data);
    }
    getUsers();
  }, [setError, setLoading]);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isAdding) return;
    setIsAdding(true);

    const email = `${Input.username}@learningcenter.com`;
    const password = Input.password;

    const { error: SignUpError } = await supabaseClient.auth.signUp({
      email,
      password,
    });

    if (SignUpError) {
      console.error("An Error has occurred: ", SignUpError.message);
      setError(
        `Failed to increment visits. Error message: ${SignUpError.message}`,
      );
      return;
    }

    const { data: user } = await supabaseClient.auth.getUser();

    console.log(user.user);

    const uuid = user.user?.id;

    const { error: InsertError } = await supabaseClient
      .from("Users")
      .insert({
        id: uuid,
        username: titleCase(Input.username),
        password: Input.password,
      })
      .single();

    if (InsertError) {
      console.error("An Error has occurred: ", InsertError.message);
      setError(`Failed to add student. Error message: ${InsertError.message}`);
      return;
    }

    setUsers((prev) => [...prev, Input]);

    setInput({ username: "", password: "" });

    setIsAdding(false);
  }

  if (!Session) {
    return <Navigate to="/login" replace />;
  }

  if (name !== "Lara") {
    return <Navigate to="/" replace />;
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
        <button type="submit" className="btn btn-dark" disabled={isAdding}>
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
              {Users.map((user) => (
                <tr key={user.password} className="text-center">
                  <th scope="row">{user.password}</th>
                  <td>{user.username}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
