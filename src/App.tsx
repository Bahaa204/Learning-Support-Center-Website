import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import LoadingCard from "./components/loading-card.tsx";

const MainLayout = lazy(() => import("./layouts/MainLayout.tsx"));
const Home = lazy(() => import("./pages/Home.tsx"));
const Login = lazy(() => import("./pages/Login.tsx"));
const WorkStudy = lazy(() => import("./pages/WorkStudy.tsx"));
const Settings = lazy(() => import("./pages/Settings.tsx"));
const StudentRecords = lazy(() => import("./pages/StudentRecords.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const ErrorPage = lazy(() => import("./pages/ErrorPage.tsx"));
const Feedback = lazy(() => import("./pages/Feedback.tsx"));
const Report = lazy(() => import("./pages/Report.tsx"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      // List all your individual pages here:
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "support-center-staff", element: <WorkStudy /> },
      { path: "student-records", element: <StudentRecords /> },
      { path: "settings", element: <Settings /> },
      { path: "feedback", element: <Feedback /> },
      { path: "report", element: <Report /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default function App() {
  return (
    <Suspense fallback={<LoadingCard message='Loading layout' />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
