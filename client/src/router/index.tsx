import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  Outlet,
} from "react-router-dom";

import DefaultLayout from "@/components/layout/DefaultLayout";
import AuthLayout from "@/components/layout/AuthLayout";
import { useAuth } from "@/contexts/auth.context";

import HomePage from "@/pages/Home";
import LoginPage from "@/pages/Login";
import RegisterPage from "@/pages/Register";
import UnauthorizedPage from "@/pages/403";
import NotFoundPage from "@/pages/404";

import { Spinner } from "@/components/ui/spinner";

// Protect routes that require authentication
const ProtectedRoute = () => {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return <Spinner size="lg" className="bg-black dark:bg-white" />;
  }

  if (!currentUser) {
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet />;
};

const Router = () => {
  const router = createBrowserRouter([
    // Auth routes with AuthLayout
    {
      element: <AuthLayout />,
      children: [
        {
          path: "/login",
          element: <LoginPage />,
        },
        {
          path: "/register",
          element: <RegisterPage />,
        },
      ],
    },
    // Main application routes with Layout
    {
      element: <DefaultLayout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: "unauthorized", element: <UnauthorizedPage /> },
        // Add more routes here as needed
        { path: "*", element: <NotFoundPage /> },
        {
          element: <ProtectedRoute />,
          children: [],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
