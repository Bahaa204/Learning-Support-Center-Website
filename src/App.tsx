import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.tsx";
import Main from "./pages/Main.tsx";
import Login from "./pages/Login.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      // List all your individual pages here:
      { index: true, element: <Main /> },
      { path: "login", element: <Login /> },
      { path: "*", element: <div>404: Not Found</div> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
