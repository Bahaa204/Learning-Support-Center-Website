import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.tsx";
import Login from "./pages/AuthPages/Login.tsx";
import WorkStudy from "./pages/WorkStudy.tsx";
import StudentRecords from "./pages/StudentRecords.tsx";
import Home from "./pages/Home.tsx";
import Settings from "./pages/Settings.tsx";
import NotFound from "./pages/NotFound.tsx";
import ErrorPage from "./pages/ErrorPage.tsx";
import AuthLayout from "./layouts/AuthLayout.tsx";
import AuthHome from "./pages/AuthPages/AuthHome.tsx";
import ResetPassword from "./pages/AuthPages/ResetPassword.tsx";
import Support from "./pages/Support.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      // List all your individual pages here:
      { index: true, element: <Home /> },
      { path: "support-center-staff", element: <WorkStudy /> },
      { path: "student-records", element: <StudentRecords /> },
      { path: "settings", element: <Settings /> },
      { path: "feedback", element: <Support type="feedback" /> },
      { path: "report", element: <Support type="report" /> },
      { path: "*", element: <NotFound /> },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <AuthHome /> },
      { path: "login", element: <Login /> },
      { path: "reset-password", element: <ResetPassword /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
