import accountImage from "../assets/Images/account_circle_30.png";
import logoutImage from "../assets/Images/logout_24.png";
import { getName } from "../helper/functions";
import { useAuth } from "../hooks/useAuth";

export default function Header() {
  // Getting the name from the current Session
  const { Session, SignOut } = useAuth();
  const name = getName(Session);

  async function LogOut() {
    await SignOut();
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

      {Session && (
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
      )}
    </header>
  );
}
