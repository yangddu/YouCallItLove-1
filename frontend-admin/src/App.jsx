import { useState } from "react";
import { useEffect } from "react";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import AdminLogin from "@pages/Admin/AdminLogin";
import AdminPosts from "@pages/Admin/AdminPosts";
import { fetchApi } from "@api/feature/api/fetchApi";

function Layout() {
  return (
    <>
      <Outlet />
    </>
  );
}

function RequireAuthRoute() {
  const authStatus = useAuthCheck();

  if (authStatus === null) return null;
  if (authStatus === false) return <Navigate to="/login" replace />;

  return <Outlet />;
}

function AuthRedirectRoute() {
  const authStatus = useAuthCheck();

  if (authStatus === null) return null;
  if (authStatus === true) return <Navigate to="/admin/posts" replace />;

  return <Outlet />;
}

function useAuthCheck() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await fetchApi("/auth/verify-token", "POST");
        setIsAuthenticated(true);
      } catch (error) {
        console.log("토큰 인증 실패: ", error);
        setIsAuthenticated(false);
      }
    };
    verifyToken();
  }, []);

  return isAuthenticated;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
  },
  {
    path: "/login",
    element: <AuthRedirectRoute />,
    children: [{ index: true, element: <AdminLogin /> }],
  },
  {
    path: "/admin",
    element: <RequireAuthRoute />,
    children: [
      {
        path: "posts",
        element: <AdminPosts />,
      },
    ],
  },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
