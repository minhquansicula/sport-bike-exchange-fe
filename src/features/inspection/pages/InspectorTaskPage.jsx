import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  MdSearch,
  MdFilterList,
  MdLocationOn,
  MdAccessTime,
  MdPerson,
  MdCheckCircle,
  MdPending,
  MdCancel,
} from "react-icons/md";
import formatCurrency from "../../../utils/formatCurrency";

// Mock data cho các nhiệm vụ
const MOCK_TASKS = [
  {
    id: 1,
    bikeName: "Trek Marlin 7 Gen 2",
    bikeImage: "https://fxbike.vn/wp-content/uploads/2022/02/Trek-Marlin-7-2022-1-600x450.jpeg",
    buyer: { name: "Nguyễn Văn A", phone: "0914303252" },
    seller: { name: "Trần Thị B", phone: "0987654321" },
    location: "Trạm OldBike Đống Đa, Hà Nội",
    scheduledTime: "2026-01-29 14:00",
    status: "pending",
    price: 12500000,
  },
  {
    id: 2,
    bikeName: "Giant Escape 2 City Disc",
    bikeImage: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=400",
    buyer: { name: "Lê Văn C", phone: "0909123456" },
    seller: { name: "Hoàng Văn D", phone: "0911222333" },
    location: "Trạm OldBike Q1, TP.HCM",
    scheduledTime: "2026-01-30 10:00",
    status: "pending",
    price: 8200000,
  },
  {
    id: 3,
    bikeName: "Specialized Allez E5",
    bikeImage: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400",
    buyer: { name: "Phạm Thị E", phone: "0933444555" },
    seller: { name: "Nguyễn Văn F", phone: "0944555666" },
    location: "Trạm OldBike Hải Châu, Đà Nẵng",
    scheduledTime: "2026-01-31 09:00",
    status: "pending",
    price: 21000000,
  },
  {
    id: 4,
    bikeName: "Cannondale Trail 5",
    bikeImage: "https://images.unsplash.com/photo-1511994298241-608e28f14fde?w=400",
    buyer: { name: "Trần Văn G", phone: "0955666777" },
    seller: { name: "Lê Thị H", phone: "0966777888" },
    location: "Trạm OldBike Thanh Xuân, Hà Nội",
    scheduledTime: "2026-01-25 15:00",
    status: "completed",
    price: 14500000,
    completedAt: "2026-01-25 16:30",
  },
  {
    id: 5,
    bikeName: "Trinx M136 Pro",
    bikeImage: "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=400",
    buyer: { name: "Võ Văn I", phone: "0977888999" },
    seller: { name: "Đặng Thị K", phone: "0988999000" },
    location: "Trạm OldBike Q7, TP.HCM",
    scheduledTime: "2026-01-20 11:00",
    status: "cancelled",
    price: 3500000,
    cancelReason: "Người mua không đến điểm hẹn",
  },
];

const InspectorTaskPage = () => {
  const [tasks] = useState(MOCK_TASKS);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Lọc tasks
  const filteredTasks = tasks.filter((task) => {
    const matchSearch =
      task.bikeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.seller.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "all" || task.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
            <MdPending size={14} /> Chờ kiểm định
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <MdCheckCircle size={14} /> Hoàn thành
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            <MdCancel size={14} /> Đã hủy
          </span>
        );
      default:
        return null;
    }
  };

  // Thống kê
  const stats = {
    pending: tasks.filter((t) => t.status === "pending").length,
    completed: tasks.filter((t) => t.status === "completed").length,
    cancelled: tasks.filter((t) => t.status === "cancelled").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nhiệm vụ kiểm định</h1>
          <p className="text-gray-500 text-sm mt-1">
            Danh sách các buổi kiểm định xe đã được lên lịch
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-yellow-50 rounded-xl border border-yellow-100 p-4 text-center">
          <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
          <p className="text-xs text-yellow-600">Chờ kiểm định</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-100 p-4 text-center">
          <p className="text-2xl font-bold text-green-700">{stats.completed}</p>
          <p className="text-xs text-green-600">Hoàn thành</p>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-100 p-4 text-center">
          <p className="text-2xl font-bold text-red-700">{stats.cancelled}</p>
          <p className="text-xs text-red-600">Đã hủy</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo tên xe, người mua/bán..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-50 text-sm"
            />
          </div>

          {/* Filter Status */}
          <div className="flex items-center gap-2">
            <MdFilterList className="text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-300 text-sm bg-white"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ kiểm định</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-lg hover:border-emerald-200 transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* Bike Image */}
              <img
                src={task.bikeImage}
                alt={task.bikeName}
                className="w-full md:w-32 h-32 rounded-lg object-cover border border-gray-200"
              />

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">
                      {task.bikeName}
                    </h3>
                    <p className="text-emerald-600 font-semibold">
                      {formatCurrency(task.price)}
                    </p>
                  </div>
                  {getStatusBadge(task.status)}
                </div>

                <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MdPerson className="text-gray-400" />
                    <span>
                      <strong>Người mua:</strong> {task.buyer.name} ({task.buyer.phone})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MdPerson className="text-gray-400" />
                    <span>
                      <strong>Người bán:</strong> {task.seller.name} ({task.seller.phone})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MdLocationOn className="text-gray-400" />
                    <span>{task.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MdAccessTime className="text-gray-400" />
                    <span>{task.scheduledTime}</span>
                  </div>
                </div>

                {task.cancelReason && (
                  <p className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">
                    Lý do hủy: {task.cancelReason}
                  </p>
                )}
              </div>

              {/* Action */}
              <div className="flex md:flex-col gap-2 md:justify-center">
                {task.status === "pending" && (
                  <Link
                    to={`/inspector/create-report?taskId=${task.id}`}
                    className="flex-1 md:flex-none px-4 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium text-center hover:bg-emerald-700 transition-colors"
                  >
                    Kiểm định
                  </Link>
                )}
                <button className="flex-1 md:flex-none px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  Chi tiết
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTasks.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <MdSearch className="mx-auto text-gray-300" size={48} />
          <p className="mt-4 text-gray-500">Không tìm thấy nhiệm vụ nào</p>
        </div>
      )}
    </div>
  );
};

export default InspectorTaskPage;