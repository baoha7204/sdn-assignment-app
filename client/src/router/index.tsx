import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";

// Layouts
import DefaultLayout from "@/components/layout/DefaultLayout";
import AuthLayout from "@/components/layout/AuthLayout";

// Public pages
import HomePage from "@/pages/Home";
import LoginPage from "@/pages/Login";
import RegisterPage from "@/pages/Register";
import UnauthorizedPage from "@/pages/403";
import NotFoundPage from "@/pages/404";
import PerfumeDetailPage from "@/pages/Perfumes/PerfumeDetail";

// Protected pages
import ProfilePage from "@/pages/Profile";

// Admin pages
import ManageBrandsPage from "@/pages/Brands/ManageBrands";
import ManageBrandDetailPage from "@/pages/Brands/ManageBrandDetail";

import ManagePerfumesPage from "@/pages/Perfumes/ManagePerfumes";
import ManagePerfumeDetailPage from "@/pages/Perfumes/ManagePerfumeDetail";

import ManageUsers from "@/pages/Users/ManageUsers";
import { useAuth } from "@/hooks/useAuth";

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

const AdminRoute = () => {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return <Spinner size="lg" className="bg-black dark:bg-white" />;
  }

  if (!currentUser || !currentUser.isAdmin) {
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
        {
          path: "perfumes",
          children: [
            { index: true, element: <HomePage /> },
            {
              path: ":id",
              element: <PerfumeDetailPage />,
            },
          ],
        },
        { path: "unauthorized", element: <UnauthorizedPage /> },
        { path: "*", element: <NotFoundPage /> },
        // Protected route
        {
          element: <ProtectedRoute />,
          children: [{ path: "profile", element: <ProfilePage /> }],
        },
        // Admin route
        {
          path: "admin",
          element: <AdminRoute />,
          children: [
            {
              path: "brands",
              children: [
                { index: true, element: <ManageBrandsPage /> },
                { path: "add", element: <ManageBrandDetailPage mode="add" /> },
                {
                  path: ":id",
                  element: <ManageBrandDetailPage mode="edit" />,
                },
              ],
            },
            {
              path: "perfumes",
              children: [
                { index: true, element: <ManagePerfumesPage /> },
                {
                  path: "add",
                  element: <ManagePerfumeDetailPage mode="add" />,
                },
                {
                  path: ":id",
                  element: <ManagePerfumeDetailPage mode="edit" />,
                },
              ],
            },
            {
              path: "collectors",
              element: <ManageUsers />,
            },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
