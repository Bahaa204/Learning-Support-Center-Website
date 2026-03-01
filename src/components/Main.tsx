import { useEffect } from "react";
import { useDataContext } from "../context/context";
import InputForm from "./InputForm";
import Table from "./Table";
import { supabaseClient } from "../supabase-client";
import Login from "./Login";
import Header from "./Header";
import Footer from "./Footer";

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

  return (
    <>
      <div className="d-flex flex-column min-vh-100">
        <Header />
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
        <Footer />
      </div>
    </>
  );
}
