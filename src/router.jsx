import { createBrowserRouter, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Import Layouts
import AdminLayout from "./features/admin/layouts/AdminLayout";
import InspectorLayout from "./features/inspection/layouts/InspectorLayout";
import ScrollToTop from "./components/common/ScrollToTop";

// Root Layout
const RootLayout = () => {
  return (
    <AuthProvider>
      <WishlistProvider>
        <ScrollToTop />
        <Outlet />
      </WishlistProvider>
    </AuthProvider>
  );
};

// Các trang chức năng
import HomePage from "./pages/HomePage";
import BikeListPage from "./features/bicycle/pages/BikeListPage";
import BikeDetailPage from "./features/bicycle/pages/BikeDetailPage";
import PostBikePage from "./features/bicycle/pages/PostBikePage";
import EditBikePage from "./features/bicycle/pages/EditBikePage";
import EventListPage from "./features/event-meeting/pages/EventListPage";
import EventDetailPage from "./features/event-meeting/pages/EventDetailPage";

// Các trang Auth
import LoginForm from "./features/auth/LoginForm";
import RegisterForm from "./features/auth/RegisterForm";
import UserProfilePage from "./features/user/pages/UserProfilePage";

// Trang Wishlist
import WishlistPage from "./features/wishlist/pages/WishlistPage";

// Các trang Admin
import AdminHomePage from "./features/admin/pages/AdminHomePage";
import AdminUsersPage from "./features/admin/pages/AdminUsersPage";
import AdminTransactionsPage from "./features/admin/pages/AdminTransactionsPage";
import AdminEventsPage from "./features/admin/pages/AdminEventsPage";
import AdminEventBicyclesPage from "./features/admin/pages/AdminEventBicyclesPage";
import AdminPostsPage from "./features/admin/pages/AdminPostsPage";
import AdminPostDetailPage from "./features/admin/pages/AdminPostDetailPage";
import AdminPricingPage from "./features/admin/pages/AdminPricingPage";
import AdminLocationsPage from "./features/admin/pages/AdminLocationsPage";
import AdminSettingsPage from "./features/admin/pages/AdminSettingsPage";
// Đã xóa import AdminEventFormPage

// Các trang Inspector
import InspectorHomePage from "./features/inspection/pages/InspectorHomePage";
import InspectorTaskPage from "./features/inspection/pages/InspectorTaskPage";
import CreateReportPage from "./features/inspection/pages/CreateReportPage";
import InspectorProfilePage from "./features/inspection/pages/InspectorProfilePage";
import InspectorTaskDetailPage from "./features/inspection/pages/InspectorTaskDetailPage";
import InspectorHistoryPage from "./features/inspection/pages/InspectorHistoryPage";

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
          { path: "edit-bike/:id", element: <EditBikePage /> },
          { path: "profile", element: <UserProfilePage /> },
          { path: "wishlist", element: <WishlistPage /> },
          { path: "events", element: <EventListPage /> },
          { path: "events/:id", element: <EventDetailPage /> },
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
      // Routes cho Admin
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
          // Đã xóa routes "events/create" và "events/:id/edit"
          { path: "event-bicycles", element: <AdminEventBicyclesPage /> },
          { path: "posts", element: <AdminPostsPage /> },
          { path: "posts/:id", element: <AdminPostDetailPage /> },
          { path: "pricing", element: <AdminPricingPage /> },
          { path: "locations", element: <AdminLocationsPage /> },
          { path: "settings", element: <AdminSettingsPage /> },
        ],
      },
      // Routes cho Inspector
      {
        path: "/inspector",
        element: (
          <ProtectedRoute requiredRole="INSPECTOR">
            <InspectorLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <InspectorHomePage /> },
          { path: "tasks", element: <InspectorTaskPage /> },
          { path: "tasks/:id", element: <InspectorTaskDetailPage /> },
          { path: "create-report", element: <CreateReportPage /> },
          { path: "history", element: <InspectorHistoryPage /> },
          { path: "profile", element: <InspectorProfilePage /> },

        ],
      },
    ],
  },
]);

export default router;
