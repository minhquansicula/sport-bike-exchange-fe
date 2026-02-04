import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import {
  MdAssignment,
  MdCheckCircle,
  MdAccessTime,
  MdTrendingUp,
  MdArrowForward,
  MdLocationOn,
  MdPedalBike,
  MdPerson,
} from "react-icons/md";

// Mock data cho các nhiệm vụ
const MOCK_TASKS = [
  {
    id: 1,
    bikeName: "Trek Marlin 7 Gen 2",
    bikeImage: "https://fxbike.vn/wp-content/uploads/2022/02/Trek-Marlin-7-2022-1-600x450.jpeg",
    buyer: "Nguyễn Văn A",
    seller: "Trần Thị B",
    location: "Trạm OldBike Đống Đa",
    scheduledTime: "2026-01-29 14:00",
    status: "pending",
    price: 12500000,
  },
  {
    id: 2,
    bikeName: "Giant Escape 2 City Disc",
    bikeImage: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=400",
    buyer: "Lê Văn C",
    seller: "Hoàng Văn D",
    location: "Trạm OldBike Q1 HCM",
    scheduledTime: "2026-01-30 10:00",
    status: "pending",
    price: 8200000,
  },
  {
    id: 3,
    bikeName: "Specialized Allez E5",
    bikeImage: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400",
    buyer: "Phạm Thị E",
    seller: "Nguyễn Văn F",
    location: "Trạm OldBike Đà Nẵng",
    scheduledTime: "2026-01-31 09:00",
    status: "pending",
    price: 21000000,
  },
];

const InspectorHomePage = () => {
  const { user } = useAuth();

  // Thống kê
  const stats = [
    {
      label: "Nhiệm vụ hôm nay",
      value: 3,
      icon: <MdAssignment size={24} />,
      color: "bg-blue-500",
    },
    {
      label: "Đã hoàn thành tuần này",
      value: 12,
      icon: <MdCheckCircle size={24} />,
      color: "bg-emerald-500",
    },
    {
      label: "Chờ xử lý",
      value: 5,
      icon: <MdAccessTime size={24} />,
      color: "bg-orange-500",
    },
    {
      label: "Tổng tháng này",
      value: 48,
      icon: <MdTrendingUp size={24} />,
      color: "bg-purple-500",
    },
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">
              Xin chào, {user?.name}! 👋
            </h1>
            <p className="text-emerald-100 text-sm">
              Bạn có <strong>3 nhiệm vụ</strong> cần xử lý hôm nay.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/inspector/tasks"
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-all backdrop-blur-sm"
            >
              Xem tất cả
            </Link>
            <Link
              to="/inspector/create-report"
              className="px-4 py-2 bg-white text-emerald-700 hover:bg-emerald-50 rounded-lg text-sm font-medium transition-all shadow-lg"
            >
              Tạo báo cáo
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-5 border border-gray-100 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className={`w-12 h-12 ${stat.color} text-white rounded-xl flex items-center justify-center shadow-lg`}
              >
                {stat.icon}
              </div>
            </div>
            <p className="text-2xl font-black text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Upcoming Tasks */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Nhiệm vụ sắp tới
            </h2>
            <p className="text-sm text-gray-500">
              Các buổi kiểm định đã được lên lịch
            </p>
          </div>
          <Link
            to="/inspector/tasks"
            className="flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            Xem tất cả <MdArrowForward />
          </Link>
        </div>

        <div className="space-y-4">
          {MOCK_TASKS.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors"
            >
              {/* Bike Image */}
              <img
                src={task.bikeImage}
                alt={task.bikeName}
                className="w-16 h-16 rounded-lg object-cover border border-gray-200"
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">
                  {task.bikeName}
                </h3>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <MdPerson size={14} />
                    {task.buyer} ↔ {task.seller}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <MdLocationOn size={14} />
                    {task.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <MdAccessTime size={14} />
                    {task.scheduledTime}
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="text-right">
                <p className="font-bold text-emerald-600">
                  {formatCurrency(task.price)}
                </p>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 mt-1">
                  Chờ kiểm định
                </span>
              </div>

              {/* Action */}
              <Link
                to={`/inspector/tasks/${task.id}`}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
              >
                Chi tiết
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Tips */}
      <div className="bg-emerald-50 rounded-xl border border-emerald-100 p-6">
        <h3 className="font-bold text-emerald-900 mb-3 flex items-center gap-2">
          <MdPedalBike className="text-emerald-600" />
          Lưu ý khi kiểm định
        </h3>
        <ul className="space-y-2 text-sm text-emerald-800">
          <li>• Kiểm tra kỹ khung xe, phuộc, và các mối hàn</li>
          <li>• Đảm bảo hệ thống phanh hoạt động tốt</li>
          <li>• Xác minh thông tin xe khớp với mô tả đăng bán</li>
          <li>• Chụp ảnh đầy đủ các góc và chi tiết quan trọng</li>
          <li>• Ghi chú rõ ràng mọi vấn đề phát hiện được</li>
        </ul>
      </div>
    </div>
  );
};

export default InspectorHomePage;
