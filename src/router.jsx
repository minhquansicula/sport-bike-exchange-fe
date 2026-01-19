import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

// Các trang chức năng
import HomePage from "./pages/HomePage";
import BikeListPage from "./features/bicycle/pages/BikeListPage";
import BikeDetailPage from "./features/bicycle/pages/BikeDetailPage";

// Các trang Auth
import LoginForm from "./features/auth/LoginForm";
import RegisterForm from "./features/auth/RegisterForm";
import UserProfilePage from "./features/auth/pages/UserProfilePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />, // Áp dụng khung sườn có Header
    children: [
      { index: true, element: <HomePage /> }, // Trang chủ
      { path: "bikes", element: <BikeListPage /> }, // Danh sách xe
      { path: "bikes/:id", element: <BikeDetailPage /> }, // Chi tiết xe
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
  {
    path: "/",
    element: <MainLayout />,
    children: [
      // ... các route khác
      { path: "profile", element: <UserProfilePage /> }, // <-- Thêm dòng này
    ],
  },
]);

export default router;
