import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Loading from "./Loading";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loading fullScreen />;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // SỬA TẠI ĐÂY: Chuyển cả user.role và requiredRole về chữ hoa để so sánh không phân biệt hoa thường
  if (requiredRole && user.role?.toUpperCase() !== requiredRole.toUpperCase()) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
