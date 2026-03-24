import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPartyInfo } from "../../../utils/getPartyInfo";
import { toast } from "react-hot-toast";
import { useInspectorTasks } from "../hooks/useInspectorTasks";
import {
  MdSearch,
  MdFilterList,
  MdLocationOn,
  MdAccessTime,
  MdPerson,
  MdPhone,
  MdCheckCircle,
  MdPending,
  MdCancel,
  MdInfoOutline,
} from "react-icons/md";
import formatCurrency from "../../../utils/formatCurrency";

const InspectorTaskPage = () => {
  const { tasks, loading, error } = useInspectorTasks();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    if (error) {
      toast.error("Không thể tải danh sách nhiệm vụ");
    }
  }, [error]);

  // Lọc tasks
  const filteredTasks = tasks.filter((task) => {
    const buyer = getPartyInfo(task, "buyer");
    const seller = getPartyInfo(task, "seller");

    const matchSearch =
      task.bikeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.id.toString().includes(searchTerm);
    const matchStatus = filterStatus === "all" || task.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "Scheduled":
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            <MdPending size={14} /> Chờ kiểm định
          </span>
        );
      case "Completed":
      case "completed":
      case "Waiting_Payment":
      case "Inspection_Failed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <MdCheckCircle size={14} /> Hoàn thành
          </span>
        );
      case "Cancelled":
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            <MdCancel size={14} /> Đã hủy
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  // Thống kê
  const stats = {
    pending: tasks.filter((t) => ["Scheduled", "pending"].includes(t.status)).length,
    completed: tasks.filter((t) => ["Completed", "completed", "Waiting_Payment", "Inspection_Failed"].includes(t.status)).length,
    cancelled: tasks.filter((t) => ["Cancelled", "cancelled"].includes(t.status)).length,
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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Nhiệm vụ kiểm định
          </h1>
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
              placeholder="Tìm theo tên xe, người mua/bán, mã..."
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
              <option value="Scheduled">Chờ kiểm định</option>
              <option value="Completed">Hoàn thành</option>
              <option value="Cancelled">Đã hủy</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => {
          const buyer = getPartyInfo(task, "buyer");
          const seller = getPartyInfo(task, "seller");

          return (
            <div
              key={task.id}
              className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-lg hover:border-emerald-200 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row gap-4">
                {/* Bike Image */}
                <img
                  src={task.bikeImage || "https://via.placeholder.com/150"}
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
                    <div className="flex items-start gap-2">
                      <MdPerson className="text-gray-400 mt-0.5 shrink-0" />
                      <div>
                        <strong>Người mua:</strong> {buyer.name || "Đang cập nhật"}
                        <br />
                        {buyer.phone ? (
                          <a
                            href={`tel:${buyer.phone}`}
                            className="text-xs text-blue-600 flex items-center gap-1"
                          >
                            <MdPhone size={12} /> {buyer.phone}
                          </a>
                        ) : (
                          <span className="text-xs text-gray-400">Chưa có số điện thoại</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MdPerson className="text-gray-400 mt-0.5 shrink-0" />
                      <div>
                        <strong>Người bán:</strong> {seller.name || "Đang cập nhật"}
                        <br />
                        {seller.phone ? (
                          <a
                            href={`tel:${seller.phone}`}
                            className="text-xs text-blue-600 flex items-center gap-1"
                          >
                            <MdPhone size={12} /> {seller.phone}
                          </a>
                        ) : (
                          <span className="text-xs text-gray-400">Chưa có số điện thoại</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MdLocationOn className="text-gray-400 shrink-0" />
                      <span>{task.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MdAccessTime className="text-gray-400 shrink-0" />
                      <span>
                        {new Date(task.scheduledTime).toLocaleString("vi-VN")}
                      </span>
                    </div>
                  </div>

                  {task.cancelReason && (
                    <p className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-1.5 rounded-lg flex items-center gap-1">
                      <MdInfoOutline size={16} /> Lý do hủy: {task.cancelReason}
                    </p>
                  )}
                </div>

                {/* Action */}
                <div className="flex md:flex-col gap-2 md:justify-center">
                  {["Scheduled", "pending"].includes(task.status) && (
                    <Link
                      to={`/inspector/create-report?taskId=${task.id}`}
                      className="flex-1 md:flex-none px-4 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-bold text-center hover:bg-emerald-700 transition-colors shadow-sm"
                    >
                      Bắt đầu Kiểm định
                    </Link>
                  )}
                  <Link
                    to={`/inspector/tasks/${task.id}`}
                    className="flex-1 md:flex-none px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors text-center"
                  >
                    Chi tiết
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredTasks.length === 0 && !loading && (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <MdSearch className="mx-auto text-gray-300" size={48} />
          <p className="mt-4 text-gray-500">Không tìm thấy nhiệm vụ nào</p>
        </div>
      )}
    </div>
  );
};

export default InspectorTaskPage;
