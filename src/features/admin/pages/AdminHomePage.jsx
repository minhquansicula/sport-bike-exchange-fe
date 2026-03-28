import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BikeCard from "../../bicycle/components/BikeCard";
import { bikeService } from "../../../services/bikeService";
import { reservationService } from "../../../services/reservationService";
import { userService } from "../../../services/userService";
import {
  MdArrowForward,
  MdArticle,
  MdSwapHoriz,
  MdPeople,
  MdWarning,
  MdLocationOn,
} from "react-icons/md";

const AdminHomePage = () => {
  const [filterStatus, setFilterStatus] = useState("all");
  const [bikes, setBikes] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Chuẩn hóa trạng thái để so sánh ổn định với dữ liệu BE có thể khác format.
  const normalizeStatus = (status) =>
    (status || "")
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_");

  // Gọi API lấy dữ liệu thật từ database cho toàn bộ dashboard
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [bikeResponse, reservationResponse, userResponse] =
          await Promise.all([
            bikeService.getAllBikeListings(),
            reservationService.getAllReservations(),
            userService.getAllUsers(),
          ]);

        if (bikeResponse?.result) {
          // Sắp xếp xe mới nhất lên đầu
          const sortedBikes = [...bikeResponse.result].sort(
            (a, b) => b.listingId - a.listingId,
          );
          setBikes(sortedBikes);
        }

        if (reservationResponse?.result) {
          // Chỉ lấy giao dịch xe thường, đồng bộ với trang /admin/transactions
          const regularReservations = reservationResponse.result.filter(
            (r) => !r.eventBicycleId && !r.eventBikeId,
          );
          setReservations(regularReservations);
        }

        if (userResponse?.result) {
          setUsers(userResponse.result);
        }
      } catch (error) {
        console.error("Lỗi tải dữ liệu dashboard admin:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Thống kê thật cho 4 nhãn tổng quan
  const pendingCount = bikes.filter(
    (bike) => normalizeStatus(bike.status) === "pending",
  ).length;

  const processingStatuses = ["pending_cancel", "deposited", "completed"];
  const pendingTransactionsCount = reservations.filter((reservation) =>
    processingStatuses.includes(normalizeStatus(reservation.status)),
  ).length;

  const violatedMembersCount = users.filter((user) => {
    const role = (user.role || "").toLowerCase();
    const status = normalizeStatus(user.status);

    return role !== "admin" && status && status !== "active";
  }).length;

  const totalMembersCount = users.filter(
    (user) => (user.role || "").toLowerCase() !== "admin",
  ).length;

  // Không dùng mock data, tất cả giá trị lấy từ API
  const stats = [
    {
      label: "Tin chờ duyệt",
      value: pendingCount,
      icon: <MdArticle size={24} />,
      color: "bg-blue-500",
      link: "/admin/posts",
    },
    {
      label: "Giao dịch chờ xử lý",
      value: pendingTransactionsCount,
      icon: <MdSwapHoriz size={24} />,
      color: "bg-orange-500",
      link: "/admin/transactions",
    },
    {
      label: "Thành viên vi phạm",
      value: violatedMembersCount,
      icon: <MdWarning size={24} />,
      color: "bg-red-500",
      link: "/admin/users",
    },
    {
      label: "Tổng thành viên",
      value: totalMembersCount,
      icon: <MdPeople size={24} />,
      color: "bg-green-500",
      link: "/admin/users",
    },
  ];


  // Lọc xe theo trạng thái từ data API
  const getFilteredBikes = () => {
    switch (filterStatus) {
      case "pending":
        return bikes.filter((bike) => normalizeStatus(bike.status) === "pending");
      case "approved":
        // Đồng bộ trạng thái đã duyệt với các case API đang trả về.
        return bikes.filter(
          (bike) =>
            ["available", "available_in_event"].includes(
              normalizeStatus(bike.status),
            ),
        );
      default:
        return bikes;
    }
  };

  return (
    <div className="space-y-6">
      {/* --- 1. WELCOME SECTION --- */}
      <div className="bg-gradient-to-r from-zinc-900 to-orange-700 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">Xin chào, Admin! 👋</h1>
            <p className="text-orange-100 text-sm">
              Đây là tổng quan hoạt động hệ thống OldBike hôm nay.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/admin/posts"
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-all backdrop-blur-sm"
            >
              Duyệt tin đăng
            </Link>
            <Link
              to="/admin/transactions"
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-sm font-medium transition-all shadow-lg"
            >
              Xử lý giao dịch
            </Link>
          </div>
        </div>
      </div>

      {/* --- 2. QUICK STATS CARDS --- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className="bg-white rounded-xl p-5 border border-gray-100 hover:shadow-lg hover:border-orange-200 transition-all duration-300 group"
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className={`w-12 h-12 ${stat.color} text-white rounded-xl flex items-center justify-center shadow-lg`}
              >
                {stat.icon}
              </div>
              <MdArrowForward className="text-gray-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-2xl font-black text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </Link>
        ))}
      </div>

      

      {/* --- 4. PRODUCT LISTING --- */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Sản phẩm trên sàn
            </h2>
            <p className="text-sm text-gray-500">
              Xem và quản lý các xe đang được bán trên hệ thống
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Filter Buttons */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setFilterStatus("all")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  filterStatus === "all"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setFilterStatus("pending")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  filterStatus === "pending"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Chờ duyệt
              </button>
              <button
                onClick={() => setFilterStatus("approved")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  filterStatus === "approved"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Đã duyệt
              </button>
            </div>
            <Link
              to="/bikes"
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
            >
              Xem tất cả
              <MdArrowForward />
            </Link>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {getFilteredBikes()
                .slice(0, 8)
                .map((bike) => (
                  <BikeCard key={bike.listingId || bike.id} bike={bike} />
                ))}
            </div>

            {/* Thông báo nếu không có sản phẩm */}
            {getFilteredBikes().length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MdArticle className="text-gray-400" size={32} />
                </div>
                <p className="text-gray-500">Không có sản phẩm nào phù hợp</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* --- 5. QUICK INFO CARDS --- */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Card 1: Kiểm duyệt */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg hover:border-blue-200 transition-all">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
            <MdArticle size={24} />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Duyệt tin Online</h3>
          <p className="text-sm text-gray-500 mb-4">
            Kiểm tra nội dung tin, so sánh ảnh và thông số. Duyệt hoặc từ chối
            kèm lý do.
          </p>
          <Link
            to="/admin/posts"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            Đi đến <MdArrowForward />
          </Link>
        </div>

        {/* Card 2: Điều phối */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg hover:border-orange-200 transition-all">
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-4">
            <MdLocationOn size={24} />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Điều phối giao dịch</h3>
          <p className="text-sm text-gray-500 mb-4">
            Sắp xếp địa điểm, chốt thời gian và gán Inspector cho các giao dịch.
          </p>
          <Link
            to="/admin/transactions"
            className="text-sm font-medium text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            Đi đến <MdArrowForward />
          </Link>
        </div>

        {/* Card 3: Quản lý vi phạm */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg hover:border-red-200 transition-all">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-4">
            <MdWarning size={24} />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Xử lý vi phạm</h3>
          <p className="text-sm text-gray-500 mb-4">
            Quản lý các tài khoản "boom hàng" - không đến điểm hẹn giao dịch.
          </p>
          <Link
            to="/admin/users"
            className="text-sm font-medium text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            Đi đến <MdArrowForward />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
