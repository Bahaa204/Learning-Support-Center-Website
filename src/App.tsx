import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Suspense, type ReactNode, lazy } from "react";
import MainLayout from "./layouts/MainLayout.tsx";
import AuthLayout from "./layouts/AuthLayout.tsx";
import LoadingCard from "./components/loading-card.tsx";

const Login = lazy(() => import("./pages/AuthPages/Login.tsx"));
const WorkStudy = lazy(() => import("./pages/WorkStudy.tsx"));
const StudentRecords = lazy(() => import("./pages/StudentRecords.tsx"));
const Home = lazy(() => import("./pages/Home.tsx"));
const Settings = lazy(() => import("./pages/Settings.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const ErrorPage = lazy(() => import("./pages/ErrorPage.tsx"));
const AuthHome = lazy(() => import("./pages/AuthPages/AuthHome.tsx"));
const ResetPassword = lazy(() => import("./pages/AuthPages/ResetPassword.tsx"));
const Support = lazy(() => import("./pages/Support.tsx"));



function SuspensePage({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<LoadingCard message="Loading Page..." />}>
      {children}
    </Suspense>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      // List all your individual pages here:
      { index: true, element: <SuspensePage><Home /></SuspensePage> },
      { path: "support-center-staff", element: <SuspensePage><WorkStudy /></SuspensePage> },
      { path: "student-records", element: <SuspensePage><StudentRecords /></SuspensePage> },
      { path: "settings", element: <SuspensePage><Settings /></SuspensePage> },
      { path: "feedback", element: <SuspensePage><Support type="feedback" /></SuspensePage> },
      { path: "report", element: <SuspensePage><Support type="report" /></SuspensePage> },
      { path: "*", element: <SuspensePage><NotFound /></SuspensePage> },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <SuspensePage><AuthHome /></SuspensePage> },
      { path: "login", element: <SuspensePage><Login /></SuspensePage> },
      { path: "reset-password", element: <SuspensePage><ResetPassword /></SuspensePage> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
