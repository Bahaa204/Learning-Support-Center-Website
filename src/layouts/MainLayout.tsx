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
        <footer className="bg-dark text-white text-center p-3 d-flex-column">
          <p>Made By Bahaa El Rawass</p>
          <div className="d-flex flex-column justify-content-center align-items-center">
            Socials:
            <div className="d-flex gap-4 flex-wrap justify-content-center align-items-center">
              <a
                href="https://github.com/Bahaa204"
                className="text-white text-decoration-none"
              >
                <img src={Github} width="25" height="25" alt="" />
                GitHub
              </a>
              <a
                href="https://github.com/Bahaa204"
                className="text-white text-decoration-none"
              >
                <img src={LinkedIn} width="25" height="25" alt="" />
                LinkedIn
              </a>
              <a
                href="https://github.com/Bahaa204"
                className="text-white text-decoration-none"
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
