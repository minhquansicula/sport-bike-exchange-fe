import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Sidebar from "../components/layout/Sidebar"; // Import Sidebar

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header nhận hàm mở Sidebar */}
      <Header onOpenSidebar={() => setIsSidebarOpen(true)} />

      {/* Sidebar nhận trạng thái và hàm đóng */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-grow animate-in fade-in duration-500">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
