import { useState, type SubmitEvent } from "react";
import type { LoginInput } from "../types/types";
import { useDataContext } from "../context/context";
import { supabaseClient } from "../supabase-client";

export default function Login() {
  const [Login, setLogin] = useState<LoginInput>({
    username: "",
    password: "",
  });

  const { setSession, error, setError } = useDataContext();

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const email = `${Login.username}@learningcenter.com`;
    const password = Login.password;

    const { error, data } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error("An error has occurred: ", error.message);
      setError("Failed to Login");
      return;
    }

    console.log(data.session);
    setSession(data.session);
  }

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-sm p-4" style={{ width: "350px" }}>
        <h2 className="text-center mb-4">Login</h2>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              required
              type="text"
              id="username"
              className="form-control"
              placeholder="Enter your username"
              onChange={(event) =>
                setLogin({ ...Login, username: event.target.value })
              }
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              required
              type="password"
              id="password"
              className="form-control"
              placeholder="Enter your password"
              onChange={(event) =>
                setLogin({ ...Login, password: event.target.value })
              }
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
