import { Outlet } from "react-router-dom";
import Header from "../components/Header";

export default function MainLayout() {
  return (
    <>
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <main className="flex-grow-1 p-3">
          <Outlet />
        </main>
        <footer className="bg-dark text-white text-center p-3">
          <p className="mb-0">
            &copy; 2026 Bahaa El Rawass. All Rights Reserved.
          </p>
        </footer>
      </div>
    </>
  );
}
