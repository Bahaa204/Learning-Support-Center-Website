import { Outlet } from "react-router-dom";
import logoutImage from "../assets/Images/logout_24.png";
import accountImage from "../assets/Images/account_circle_30.png";

export default function MainLayout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <header className="bg-dark text-white d-flex justify-content-between align-items-center p-3">
        <div className="d-flex align-items-center">
          <img
            src={accountImage}
            alt="Profile"
            className="rounded-circle me-2"
            style={{ width: "40px", height: "40px" }}
          />
          <p className="mb-0">Bahaa</p>
        </div>

        <button className="btn btn-danger d-flex align-items-center">
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
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-dark text-white text-center p-3">
        <p className="mb-0">
          &copy; 2026 Bahaa El Rawass. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}
