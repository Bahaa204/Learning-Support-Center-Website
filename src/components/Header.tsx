import { useDataContext } from "../context/context";
import { getName } from "../helper/functions";
import { supabaseClient } from "../supabase-client";
import accountImage from "../assets/Images/account_circle_30.png";
import logoutImage from "../assets/Images/logout_24.png";

export default function Header() {
  const { setError, Session } = useDataContext();

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
  }
  return (
    <header className="bg-dark text-white d-flex justify-content-between align-items-center p-3">
      <div className="d-flex align-items-center">
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
  );
}
