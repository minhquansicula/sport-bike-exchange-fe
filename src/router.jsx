// src/router.jsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginForm from "./features/auth/LoginForm";
import RegisterForm from "./features/auth/RegisterForm";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />, // Tự động chuyển về trang Login
  },
  {
    path: "/login",
    element: <LoginForm />,
  },
  {
    path: "/register",
    element: <RegisterForm />,
  },
]);

export default router;
