import React, { useState } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import { useAuth } from "../../../hooks/useAuth";

const AdminLayout = () => {
  const { user, loading } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();

  // Đóng sidebar trên mobile mỗi khi chuyển trang
  React.useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  // Hiển thị loading khi đang kiểm tra auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  // Redirect nếu chưa đăng nhập hoặc không phải admin
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = String(user.role || "").toUpperCase();

  if (!userRole.includes("ADMIN")) {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar cố định bên trái (có hỗ trợ vuốt trên Mobile) */}
      <AdminSidebar
        isOpen={isMobileSidebarOpen}
        setIsOpen={setIsMobileSidebarOpen}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-[260px] transition-all duration-300">
        {/* Header */}
        <AdminHeader onMenuClick={() => setIsMobileSidebarOpen(true)} />

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden animate-in fade-in duration-300">
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay: Làm tối màn hình đằng sau khi mở menu trên đt */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
