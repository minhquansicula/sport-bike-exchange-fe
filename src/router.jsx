import { createBrowserRouter, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/common/ProtectedRoute"; // Import ProtectedRoute để bảo vệ các trang

// Import Layouts
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
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <MainLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: "bikes", element: <BikeListPage /> },
          { path: "bikes/:id", element: <BikeDetailPage /> },
          { path: "post-bike", element: <PostBikePage /> },
          { path: "profile", element: <UserProfilePage /> },
        ],
      },
      {
        path: "/login",
        element: <LoginForm />,
      },
      {
        path: "/register",
        element: <RegisterForm />,
      },
      {
        path: "/unauthorized",
        element: <UnauthorizedPage />,
      },
      // Routes cho Admin - Đã được bọc ProtectedRoute với requiredRole="ADMIN"
      {
        path: "/admin",
        element: (
          <ProtectedRoute requiredRole="ADMIN">
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <AdminHomePage /> },
          { path: "users", element: <AdminUsersPage /> },
          { path: "transactions", element: <AdminTransactionsPage /> },
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
      // Routes cho Inspector - Đã được bọc ProtectedRoute với requiredRole="INSPECTOR"
      {
        path: "/inspector",
        element: (
          <ProtectedRoute requiredRole="INSPECTOR">
            <InspectorLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <InspectorDashboard /> },
          { path: "tasks", element: <InspectorTaskPage /> },
          { path: "tasks/:id", element: <InspectorTaskPage /> },
          { path: "create-report", element: <CreateReportPage /> },
          { path: "history", element: <InspectorTaskPage /> },
        ],
      },
    ],
  },
]);

export default router;
