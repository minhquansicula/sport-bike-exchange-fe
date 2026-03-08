import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BikeCard from "../../bicycle/components/BikeCard";
import { bikeService } from "../../../services/bikeService";
import {
  MdArrowForward,
  MdArticle,
  MdSwapHoriz,
  MdPeople,
  MdWarning,
  MdTrendingUp,
  MdAttachMoney,
  MdLocationOn,
} from "react-icons/md";

const AdminHomePage = () => {
  const [filterStatus, setFilterStatus] = useState("all");
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gọi API lấy dữ liệu thật từ database
  useEffect(() => {
    const fetchBikes = async () => {
      try {
        setLoading(true);
        const response = await bikeService.getAllBikeListings();
        if (response && response.result) {
          // Sắp xếp xe mới nhất lên đầu
          const sortedBikes = response.result.sort(
            (a, b) => b.listingId - a.listingId,
          );
          setBikes(sortedBikes);
        }
      } catch (error) {
        console.error("Lỗi tải danh sách xe:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBikes();
  }, []);

  // Tính toán số lượng tin chờ duyệt thực tế
  const pendingCount = bikes.filter(
    (bike) => bike.status?.toLowerCase() === "pending",
  ).length;

  // Mock thống kê tổng quan (Cập nhật giá trị "Tin chờ duyệt" bằng data thật)
  const stats = [
    {
      label: "Tin chờ duyệt",
      value: pendingCount, // Sử dụng data thật
      icon: <MdArticle size={24} />,
      color: "bg-blue-500",
      link: "/admin/posts",
    },
    {
      label: "Giao dịch chờ xử lý",
      value: 5,
      icon: <MdSwapHoriz size={24} />,
      color: "bg-orange-500",
      link: "/admin/transactions",
    },
    {
      label: "Thành viên vi phạm",
      value: 3,
      icon: <MdWarning size={24} />,
      color: "bg-red-500",
      link: "/admin/violations",
    },
    {
      label: "Tổng thành viên",
      value: 1250,
      icon: <MdPeople size={24} />,
      color: "bg-green-500",
      link: "/admin/members",
    },
  ];

  // Mock thống kê doanh thu
  const revenueStats = [
    {
      label: "Doanh thu hôm nay",
      value: "2,500,000đ",
      trend: "+12%",
      trendUp: true,
    },
    {
      label: "Doanh thu tháng này",
      value: "45,800,000đ",
      trend: "+8%",
      trendUp: true,
    },
    {
      label: "Giao dịch thành công",
      value: "48",
      trend: "+5",
      trendUp: true,
    },
    {
      label: "Tỷ lệ hoàn thành",
      value: "94%",
      trend: "-2%",
      trendUp: false,
    },
  ];

  // Lọc xe theo trạng thái từ data API
  const getFilteredBikes = () => {
    switch (filterStatus) {
      case "pending":
        return bikes.filter((bike) => bike.status?.toLowerCase() === "pending");
      case "approved":
        // Giả sử xe đã duyệt có status là 'available'
        return bikes.filter(
          (bike) => bike.status?.toLowerCase() === "available",
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

      {/* --- 3. REVENUE OVERVIEW --- */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <MdAttachMoney className="text-orange-500" />
            Thống kê doanh thu
          </h2>
          <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-orange-300">
            <option>Hôm nay</option>
            <option>7 ngày qua</option>
            <option>Tháng này</option>
            <option>Năm nay</option>
          </select>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {revenueStats.map((item, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">{item.label}</p>
              <div className="flex items-end gap-2">
                <span className="text-xl font-bold text-gray-900">
                  {item.value}
                </span>
                <span
                  className={`text-xs font-medium flex items-center gap-0.5 ${
                    item.trendUp ? "text-green-600" : "text-red-500"
                  }`}
                >
                  <MdTrendingUp className={!item.trendUp ? "rotate-180" : ""} />
                  {item.trend}
                </span>
              </div>
            </div>
          ))}
        </div>
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
            to="/admin/violations"
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
