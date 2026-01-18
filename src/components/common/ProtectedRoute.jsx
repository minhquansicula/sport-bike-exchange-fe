import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Loading from "./Loading";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Đang tải user từ LocalStorage thì hiện loading
  if (loading) return <Loading fullScreen />;

  // 1. Nếu chưa đăng nhập -> Đá về Login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Nếu trang yêu cầu Role cụ thể (ví dụ ADMIN) mà user không có -> Đá về Home hoặc trang lỗi 403
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />; // Hoặc trang /unauthorized
  }

  // 3. Hợp lệ -> Cho xem nội dung
  return children;
};

export default ProtectedRoute;
