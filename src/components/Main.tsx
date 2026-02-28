import { useEffect } from "react";
import { useDataContext } from "../context/context";
import InputForm from "./InputForm";
import Table from "./Table";
import { supabaseClient } from "../supabase-client";
import Login from "./Login";
import accountImage from "../assets/Images/account_circle_30.png";
import logoutImage from "../assets/Images/logout_24.png";
import { getName } from "../helper/functions";

export default function Main() {
  const { setSession, setError, Session } = useDataContext();

  useEffect(() => {
    async function getSession() {
      const { data, error } = await supabaseClient.auth.getSession();

      if (error) {
        console.error("An Error has occurred: ", error.message);
        setError(`Failed to fetch Data. Error message: ${error.message}`);
        return;
      }

      if (data.session) {
        console.log(data.session);
        setSession(data.session);
      }
    }

    getSession();
  }, [setSession, setError]);

  let name = "";
  if (Session) {
    name = getName(Session.user.email);
  }

  async function LogOut() {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      console.error("An Error has occurred: ", error.message);
      setError(`Failed to LogOut. Error message: ${error.message}`);
      return;
    }
    console.log(Session);
    setSession(null); // to trigger a refresh
  }

  return (
    <>
      <div className="d-flex flex-column min-vh-100">
        <header className="bg-dark text-white d-flex justify-content-between align-items-center p-3">
          <div
            className="d-flex align-items-center"
            onClick={() => {
              console.log(Session);
            }}
          >
            <img
              src={accountImage}
              alt="Profile"
              className="rounded-circle me-2"
              style={{ width: "40px", height: "40px" }}
            />
            <p className="mb-0">{name}</p>
          </div>

          <button
            className="btn btn-danger d-flex align-items-center"
            onClick={LogOut}
          >
            <img
              src={logoutImage}
              alt="Logout"
              className="me-2"
              style={{ width: "20px", height: "20px" }}
            />
            Logout
          </button>
        </header>

        <main className="flex-grow-1 p-3">
          {Session ? (
            <>
              <InputForm />
              <Table />
            </>
          ) : (
            <Login />
          )}
        </main>

        {/* Footer */}
        <footer className="bg-dark text-white text-center p-3">
          <p className="mb-0">
            &copy; 2026 Bahaa El Rawass. All Rights Reserved.
          </p>
        </footer>
      </div>
    </>
  );
}
