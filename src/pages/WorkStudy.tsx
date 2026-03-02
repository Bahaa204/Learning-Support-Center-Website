import { useEffect, useState, type SubmitEvent } from "react";
import type { LoginInput, User } from "../types/types";
import { supabaseClient } from "../supabase-client";
import { useDataContext } from "../context/context";
import { Navigate } from "react-router-dom";
import deleteImage from "../assets/Images/delete_24dppng.png";
import { titleCase } from "title-case";

export default function WorkStudy() {
  const [Users, setUsers] = useState<User[]>([]);
  const [Input, setInput] = useState<LoginInput>({
    username: "",
    password: "",
  });
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const { error, setError, Loading, setLoading, Session } = useDataContext();

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
      setError(`Failed to Sign Up. Error message: ${SignUpError.message}`);
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
      setError(
        `Failed to add Workstudy. Error message: ${InsertError.message}`,
      );
      return;
    }

    setUsers((prev) => [...prev, newUser]);

    setInput({ username: "", password: "" });

    setIsAdding(false);
  }

  async function handleClick(user: User) {
    if (isDeleting) return;
    setIsDeleting(true);

    const { error: DeleteError } = await supabaseClient
      .from("Users")
      .delete()
      .eq("id", user.id);

    if (DeleteError) {
      console.error("An Error has occurred: ", DeleteError.message);
      setError(
        `Failed to remove workstudy. Error message: ${DeleteError.message}`,
      );
      return;
    }

    setUsers(Users.filter((u) => u.id !== user.id));

    setIsDeleting(false);
  }

  if (Loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "50vh" }}
      >
        Checking Authentication Please Wait...
      </div>
    );
  }

  console.log("Session: ", Session);

  if (!Session) {
    return <Navigate to="/login" replace />;
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
                  <td className="hover-cell">
                    <div className="d-flex flex-wrap align-items-center">
                      <span className="flex-grow-1 text-center">
                        {user.username}
                      </span>
                      <button
                        className="btn btn-sm btn-danger hover-btn"
                        onClick={() => handleClick(user)}
                        disabled={isDeleting}
                      >
                        <img src={deleteImage} alt="delete user" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
