import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import InspectorHeader from "../components/InspectorHeader";
import InspectorSidebar from "../components/InspectorSidebar";

const InspectorLayout = () => {
  const { user, loading } = useAuth();

  // Hiển thị loading khi đang kiểm tra auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Redirect nếu chưa đăng nhập
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect nếu không phải inspector
  if (user.role !== "inspector") {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar cố định bên trái */}
      <InspectorSidebar />

      {/* Main content area */}
      <div className="ml-[260px] min-h-screen flex flex-col">
        {/* Header */}
        <InspectorHeader />

        {/* Page Content */}
        <main className="flex-1 p-6 animate-in fade-in duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default InspectorLayout;
