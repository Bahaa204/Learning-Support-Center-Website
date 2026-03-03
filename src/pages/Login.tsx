import { useState, type SubmitEvent } from "react";
import type { LoginInput } from "../types/types";
import { supabaseClient } from "../supabase-client";
import { Navigate, useNavigate } from "react-router-dom";
import { useGetSession } from "../hooks/CustomHooks";
import Spinner from "../components/Spinner";

export default function Login() {
  const [Login, setLogin] = useState<LoginInput>({
    username: "",
    password: "",
  });
  const [Error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const { Session, Loading: SessionLoading } = useGetSession();
  const navigate = useNavigate();

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoggingIn(true);

    const email = `${Login.username}@learningcenter.com`;
    const password = Login.password;

    const response = supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    const { error: LogInError } = await response;

    if (LogInError) {
      const msg = `Error: ${LogInError.message}`;
      console.error(msg);
      setError(msg);
      setIsLoggingIn(false);
      return;
    }

    setIsLoggingIn(false);
    navigate("/");
  }

  if (SessionLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "50vh" }}
      >
        <Spinner text="Checking Authentication" />
      </div>
    );
  }

  if (Session) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-sm p-4" style={{ width: "350px" }}>
        <h2 className="text-center mb-4">Login</h2>

        {Error && (
          <div className="alert alert-danger" role="alert">
            {Error}
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

          <button
            type="submit"
            className="btn btn-dark w-100"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <>
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <span>Logging In</span>
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
