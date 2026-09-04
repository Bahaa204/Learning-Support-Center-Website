import { Outlet } from "react-router-dom";
import Logo from "/Images/rhu_logo.png";

export default function AuthLayout() {
  return (
    <div className="app-shell">
      <div className="layout">
        <div className="login-page scrollbar-none">
          <div className="login-panel">
            <div className="login-hero">
            <img src={Logo} alt="RHU Logo" />
            <h1>RHU Learning Support Center</h1>
            <p>
              Sign in to manage student visits, workstudy staff, and support
              records.
            </p>
            </div>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
