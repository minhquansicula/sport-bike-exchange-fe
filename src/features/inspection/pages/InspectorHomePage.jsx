import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useInspectorTasks } from "../hooks/useInspectorTasks"; // Đảm bảo hook này hoạt động tốt
import { getPartyInfo } from "../../../utils/getPartyInfo";
import { toast } from "react-hot-toast";
import {
  MdAssignment,
  MdCheckCircle,
  MdAccessTime,
  MdTrendingUp,
  MdArrowForward,
  MdLocationOn,
  MdPedalBike,
  MdPerson,
  MdEventAvailable,
} from "react-icons/md";

const InspectorHomePage = () => {
  const { user } = useAuth();
  const { tasks, loading, error } = useInspectorTasks();

  useEffect(() => {
    if (error) {
      toast.error("Không thể tải dữ liệu thống kê nhiệm vụ");
    }
  }, [error]);

  // Phân loại task từ dữ liệu thật
  const pendingTasks = tasks.filter((t) =>
    ["Scheduled", "pending"].includes(t.status),
  );
  const completedTasksThisWeek = tasks.filter((t) =>
    ["Completed"].includes(t.status),
  ); // Bạn có thể thêm logic lọc theo tuần thực tế
  const totalTasksThisMonth = tasks.length; // Thống kê tạm theo tổng số task

  // Lấy danh sách nhiệm vụ sắp tới (Tối đa 5 task)
  const upcomingTasks = pendingTasks
    .sort((a, b) => new Date(a.scheduledTime) - new Date(b.scheduledTime))
    .slice(0, 5);

  // Thống kê động
  const stats = [
    {
      label: "Nhiệm vụ cần xử lý",
      value: pendingTasks.length,
      icon: <MdAssignment size={24} />,
      color: "bg-blue-500",
    },
    {
      label: "Đã hoàn thành",
      value: completedTasksThisWeek.length,
      icon: <MdCheckCircle size={24} />,
      color: "bg-emerald-500",
    },
    {
      label: "Tổng số phân công",
      value: totalTasksThisMonth,
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">
              Xin chào, {user?.name}! 👋
            </h1>
            <p className="text-emerald-100 text-sm">
              Bạn có <strong>{pendingTasks.length} nhiệm vụ</strong> đang chờ
              kiểm định.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/inspector/tasks"
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-all backdrop-blur-sm"
            >
              Xem tất cả
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
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
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Nhiệm vụ sắp tới
            </h2>
            <p className="text-sm text-gray-500">
              Các buổi kiểm định đã được lên lịch gần nhất
            </p>
          </div>
          <Link
            to="/inspector/tasks"
            className="flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg"
          >
            Xem tất cả <MdArrowForward />
          </Link>
        </div>

        <div className="space-y-4">
          {upcomingTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              Không có nhiệm vụ nào sắp tới.
            </div>
          ) : (
            upcomingTasks.map((task) => {
              const buyer = getPartyInfo(task, "buyer");
              const seller = getPartyInfo(task, "seller");

              return (
                <div
                  key={task.id}
                  className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors border border-gray-100 relative overflow-hidden"
                >
                  {/* Badge Sự kiện */}
                  {task.isEventBike && (
                    <div className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-sm z-10 flex items-center gap-1">
                      <MdEventAvailable size={14} /> Sự kiện
                    </div>
                  )}

                  {/* Bike Image */}
                  <img
                    src={
                      task.bikeImage?.split(",")[0] ||
                      "https://via.placeholder.com/150"
                    }
                    alt={task.bikeName}
                    className="w-20 h-20 rounded-lg object-cover border border-gray-200 bg-white"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0 pr-4">
                    <h3 className="font-bold text-gray-900 truncate text-base">
                      {task.bikeName}
                    </h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-md border border-gray-200">
                        <MdPerson size={14} className="text-gray-400" />
                        <span className="truncate max-w-[100px]">
                          {buyer.name}
                        </span>
                        <span className="text-gray-300">↔</span>
                        <span className="truncate max-w-[100px]">
                          {seller.name}
                        </span>
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-gray-500">
                      <span
                        className={`flex items-center gap-1 ${task.isEventBike ? "text-orange-700 font-medium" : ""}`}
                      >
                        <MdLocationOn
                          size={14}
                          className={task.isEventBike ? "text-orange-500" : ""}
                        />
                        {task.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <MdAccessTime size={14} />
                        {task.scheduledTime
                          ? new Date(task.scheduledTime).toLocaleString("vi-VN")
                          : "Chưa cập nhật"}
                      </span>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto mt-4 md:mt-0 border-t md:border-t-0 border-gray-200 pt-4 md:pt-0">
                    <div className="text-left md:text-right">
                      <p className="font-bold text-emerald-600 text-lg">
                        {formatCurrency(task.price)}
                      </p>
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-[11px] font-bold bg-yellow-100 text-yellow-700 mt-1 uppercase tracking-wider">
                        Chờ kiểm định
                      </span>
                    </div>

                    <Link
                      to={`/inspector/tasks/${task.id}`}
                      className="px-5 py-2.5 bg-zinc-900 text-white rounded-lg text-sm font-bold hover:bg-emerald-600 transition-colors mt-0 md:mt-3"
                    >
                      Chi tiết
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Quick Tips */}
      <div className="bg-emerald-50 rounded-xl border border-emerald-100 p-6 shadow-sm">
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
