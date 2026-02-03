import { createBrowserRouter, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import MainLayout from "./layouts/MainLayout";

// Import Layouts (Theo đúng đường dẫn bạn gửi)
import AdminLayout from "./features/admin/layouts/AdminLayout";
import InspectorLayout from "./features/inspection/layouts/InspectorLayout";

// Root Layout để wrap AuthProvider cho tất cả routes
const RootLayout = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};

// Các trang chức năng
import HomePage from "./pages/HomePage";
import BikeListPage from "./features/bicycle/pages/BikeListPage";
import BikeDetailPage from "./features/bicycle/pages/BikeDetailPage";
import PostBikePage from "./features/bicycle/pages/PostBikePage";

// Các trang Auth
import LoginForm from "./features/auth/LoginForm";
import RegisterForm from "./features/auth/RegisterForm";
import UserProfilePage from "./features/user/pages/UserProfilePage";

// Các trang Admin
import AdminHomePage from "./features/admin/pages/AdminHomePage";
import AdminUsersPage from "./features/admin/pages/AdminUsersPage";
import AdminTransactionsPage from "./features/admin/pages/AdminTransactionsPage";
// 👇 [MỚI] Thêm 2 trang Event vào đây
import AdminEventsPage from "./features/admin/pages/AdminEventsPage";
import AdminEventFormPage from "./features/admin/pages/AdminEventFormPage";
import AdminPostsPage from "./features/admin/pages/AdminPostsPage";
import AdminPostDetailPage from "./features/admin/pages/AdminPostDetailPage";
import AdminPricingPage from "./features/admin/pages/AdminPricingPage";
import AdminLocationsPage from "./features/admin/pages/AdminLocationsPage";
import AdminSettingsPage from "./features/admin/pages/AdminSettingsPage";

// Các trang Inspector
import InspectorDashboard from "./features/inspection/pages/InspectorDashboard";
import InspectorTaskPage from "./features/inspection/pages/InspectorTaskPage";
import CreateReportPage from "./features/inspection/pages/CreateReportPage";

// Trang lỗi
import UnauthorizedPage from "./pages/UnauthorizedPage";

const router = createBrowserRouter([
  {
    // Root route bọc AuthProvider cho tất cả routes con
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <MainLayout />, // Áp dụng khung sườn có Header
        children: [
          { index: true, element: <HomePage /> }, // Trang chủ
          { path: "bikes", element: <BikeListPage /> }, // Danh sách xe
          { path: "bikes/:id", element: <BikeDetailPage /> }, // Chi tiết xe
          { path: "post-bike", element: <PostBikePage /> },
          { path: "profile", element: <UserProfilePage /> },
        ],
      },
      // Các trang Login/Register nằm riêng (không cần Header/Footer của MainLayout)
      {
        path: "/login",
        element: <LoginForm />,
      },
      {
        path: "/register",
        element: <RegisterForm />,
      },
      // Trang không có quyền truy cập
      {
        path: "/unauthorized",
        element: <UnauthorizedPage />,
      },
      // Routes cho Admin (có AdminLayout với sidebar và header riêng)
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminHomePage /> }, // Dashboard - Trang chủ Admin
          { path: "users", element: <AdminUsersPage /> }, // Quản lý Users (Member/Inspector)
          { path: "transactions", element: <AdminTransactionsPage /> }, // Quản lý Transactions

          // 👇 [MỚI] Thêm các route cho Events vào đây
          { path: "events", element: <AdminEventsPage /> },
          { path: "events/create", element: <AdminEventFormPage /> },
          { path: "events/:id/edit", element: <AdminEventFormPage /> },
          { path: "posts", element: <AdminPostsPage /> },
          { path: "posts/:id", element: <AdminPostDetailPage /> },
          { path: "pricing", element: <AdminPricingPage /> },
          { path: "locations", element: <AdminLocationsPage /> },
          { path: "settings", element: <AdminSettingsPage /> },
        ],
      },
      // Routes cho Inspector (có InspectorLayout với sidebar và header riêng)
      {
        path: "/inspector",
        element: <InspectorLayout />,
        children: [
          { index: true, element: <InspectorDashboard /> }, // Dashboard Inspector
          { path: "tasks", element: <InspectorTaskPage /> }, // Danh sách nhiệm vụ
          { path: "tasks/:id", element: <InspectorTaskPage /> }, // Chi tiết nhiệm vụ
          { path: "create-report", element: <CreateReportPage /> }, // Tạo báo cáo
          { path: "history", element: <InspectorTaskPage /> }, // Lịch sử (tạm dùng chung)
        ],
      },
    ],
  },
]);

export default router;
