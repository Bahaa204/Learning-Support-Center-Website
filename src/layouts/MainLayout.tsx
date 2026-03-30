import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Github from "../assets/Images/github.png";
import LinkedIn from "../assets/Images/linkedin.png";
import Gmail from "../assets/Images/gmail.png";

export default function MainLayout() {
  return (
    <>
      <div className="d-flex flex-column flex-wrap min-vh-100">
        <Header />
        <main className="flex-grow-1 p-3">
          <Outlet />
        </main>
        <footer className="d-flex gap-1.5 flex-column justify-content-center align-items-center bg-dark text-white text-center p-3">
          <p>Made by Bahaa El Rawass</p>
          <div className="d-flex flex-column justify-content-center align-items-center">
            Contact:
            <div className="d-flex gap-4 flex-wrap justify-content-center align-items-center">
              <a
                href="https://github.com/Bahaa204"
                className="text-white text-decoration-none"
                target="_blank"
              >
                <img src={Github} width="25" height="25" alt="" />
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/bahaa-rawass-0153053b5/"
                className="text-white text-decoration-none"
                target="_blank"
              >
                <img src={LinkedIn} width="25" height="25" alt="" />
                LinkedIn
              </a>
              <a
                href="mailto:brawass6@gmail.com"
                className="text-white text-decoration-none"
                target="_blank"
              >
                <img src={Gmail} width="25" height="25" alt="" />
                Gmail
              </a>
            </div>
          </div>
          <div>
            <p className="mb-0">
              &copy; 2026 Bahaa El Rawass. All Rights Reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
