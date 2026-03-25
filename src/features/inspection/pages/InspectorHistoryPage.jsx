import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { getPartyInfo } from "../../../utils/getPartyInfo";
import formatCurrency from "../../../utils/formatCurrency";
import ReportViewerModal from "../components/ReportViewer";
import { toast } from "react-hot-toast";
import { useInspectorTasks } from "../hooks/useInspectorTasks";
import {
  MdSearch,
  MdFilterList,
  MdPerson,
  MdPhone,
  MdAccessTime,
  MdCheckCircle,
  MdCancel,
  MdAssignment,
  MdTrendingUp,
  MdDescription,
  MdCalendarToday,
  MdRefresh,
} from "react-icons/md";

// History only shows done statuses
const DONE_STATUSES = [
  "Completed",
  "Waiting_Payment",
  "Inspection_Failed",
  "Cancelled",
];

const STATUS_OPTIONS = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "Completed", label: "Completed" },
  { value: "Waiting_Payment", label: "Waiting Payment" },
  { value: "Inspection_Failed", label: "Inspection Failed" },
  { value: "Cancelled", label: "Cancelled" },
];

const RESULT_OPTIONS = [
  { value: "all", label: "Tất cả kết quả" },
  { value: "passed", label: "Đạt" },
  { value: "failed", label: "Không đạt" },
];

const InspectorHistoryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    tasks: allTasks,
    loading,
    error,
    refetch,
  } = useInspectorTasks();
  const [reportModal, setReportModal] = useState({
    isOpen: false,
    reservationId: null,
    taskData: null,
  });

  // Filters from query string
  const searchTerm = searchParams.get("q") || "";
  const filterStatus = searchParams.get("status") || "all";
  const filterResult = searchParams.get("result") || "all";
  const fromDate = searchParams.get("fromDate") || "";
  const toDate = searchParams.get("toDate") || "";

  // Update query string helper
  const updateFilter = useCallback(
    (key, value) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value && value !== "all" && value !== "") {
          next.set(key, value);
        } else {
          next.delete(key);
        }
        return next;
      });
    },
    [setSearchParams]
  );

  useEffect(() => {
    if (error) {
      console.error("Lỗi tải lịch sử:", error);
      toast.error("Không thể tải lịch sử kiểm định");
    }
  }, [error]);

  const tasks = useMemo(
    () => allTasks.filter((t) => DONE_STATUSES.includes(t.status)),
    [allTasks]
  );

  // Apply client-side filters
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Status filter
      if (filterStatus !== "all" && task.status !== filterStatus) return false;

      // Result filter (SUCCESS = passed, else = failed)
      if (filterResult !== "all") {
        const hasReport =
          task.status === "Completed" || task.status === "Waiting_Payment";
        const isFailed =
          ["Inspection_Failed", "Cancelled", "Refunded", "Compensated"].includes(task.status);
        if (filterResult === "passed" && !hasReport) return false;
        if (filterResult === "failed" && !isFailed) return false;
      }

      // Date range filter
      if (fromDate || toDate) {
        const taskDate = task.scheduledTime
          ? new Date(task.scheduledTime)
          : null;
        if (taskDate) {
          if (fromDate && taskDate < new Date(fromDate)) return false;
          if (toDate) {
            const endOfDay = new Date(toDate);
            endOfDay.setHours(23, 59, 59, 999);
            if (taskDate > endOfDay) return false;
          }
        }
      }

      // Search filter
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const buyer = getPartyInfo(task, "buyer");
        const seller = getPartyInfo(task, "seller");
        const matchSearch =
          task.bikeName?.toLowerCase().includes(q) ||
          buyer.name.toLowerCase().includes(q) ||
          seller.name.toLowerCase().includes(q) ||
          task.id?.toString().includes(q);
        if (!matchSearch) return false;
      }

      return true;
    });
  }, [tasks, filterStatus, filterResult, fromDate, toDate, searchTerm]);

  // Stats
  const stats = useMemo(() => {
    const total = filteredTasks.length;
    const passed = filteredTasks.filter((t) =>
      ["Completed", "Waiting_Payment"].includes(t.status)
    ).length;
    const failed = filteredTasks.filter((t) =>
      ["Inspection_Failed", "Cancelled", "Refunded", "Compensated"].includes(t.status)
    ).length;
    const rate = total > 0 ? Math.round((passed / total) * 100) : 0;
    return { total, passed, failed, rate };
  }, [filteredTasks]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
            <MdCheckCircle size={14} /> Completed
          </span>
        );
      case "Waiting_Payment":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
            <MdAccessTime size={14} /> Waiting Payment
          </span>
        );
      case "Inspection_Failed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
            <MdCancel size={14} /> Inspection Failed
          </span>
        );
      case "Cancelled":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
            <MdCancel size={14} /> Cancelled
          </span>
        );
      case "Refunded":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
            <MdCheckCircle size={14} /> Refunded
          </span>
        );
      case "Compensated":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
            <MdCheckCircle size={14} /> Compensated
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
            {status}
          </span>
        );
    }
  };

  const getResultBadge = (status) => {
    if (["Completed", "Waiting_Payment"].includes(status)) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white">
          ✓ Đạt
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-500 text-white">
        ✗ Không đạt
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Lịch sử kiểm định
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Tra cứu và quản lý lịch sử các buổi kiểm định đã hoàn thành
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <MdRefresh size={18} /> Làm mới
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <MdAssignment size={22} className="text-blue-600" />
            </div>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Tổng số ca
            </span>
          </div>
          <p className="text-3xl font-black text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
              <MdCheckCircle size={22} className="text-emerald-600" />
            </div>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Số ca đạt
            </span>
          </div>
          <p className="text-3xl font-black text-emerald-600">{stats.passed}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
              <MdCancel size={22} className="text-red-500" />
            </div>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Không đạt
            </span>
          </div>
          <p className="text-3xl font-black text-red-500">{stats.failed}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
              <MdTrendingUp size={22} className="text-purple-600" />
            </div>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Tỷ lệ đạt
            </span>
          </div>
          <p className="text-3xl font-black text-purple-600">{stats.rate}%</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center gap-2 mb-4">
          <MdFilterList size={20} className="text-gray-400" />
          <span className="text-sm font-bold text-gray-700">Bộ lọc</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Search */}
          <div className="lg:col-span-3 relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo mã task, tên xe, buyer/seller..."
              value={searchTerm}
              onChange={(e) => updateFilter("q", e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-50 text-sm"
            />
          </div>

          {/* From date */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              <MdCalendarToday size={12} className="inline mr-1" />
              Từ ngày
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => updateFilter("fromDate", e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-300 text-sm bg-white"
            />
          </div>

          {/* To date */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              <MdCalendarToday size={12} className="inline mr-1" />
              Đến ngày
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => updateFilter("toDate", e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-300 text-sm bg-white"
            />
          </div>

          {/* Result filter */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Kết quả kiểm định
            </label>
            <select
              value={filterResult}
              onChange={(e) => updateFilter("result", e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-300 text-sm bg-white"
            >
              {RESULT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div className="lg:col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Trạng thái giao dịch
            </label>
            <select
              value={filterStatus}
              onChange={(e) => updateFilter("status", e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-300 text-sm bg-white"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Clear filters */}
          <div className="flex items-end">
            <button
              onClick={() => setSearchParams({})}
              className="w-full px-4 py-2.5 text-sm font-medium text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => {
          const buyer = getPartyInfo(task, "buyer");
          const seller = getPartyInfo(task, "seller");

          return (
            <div
              key={task.id}
              className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-lg hover:border-emerald-200 transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Left: Task info */}
                <div className="flex-1 min-w-0">
                  {/* Top row: ID + time + badges */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-xs font-mono font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded">
                      #{task.id}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <MdAccessTime size={14} />
                      {task.scheduledTime
                        ? new Date(task.scheduledTime).toLocaleString("vi-VN")
                        : "N/A"}
                    </span>
                    {getStatusBadge(task.status)}
                    {getResultBadge(task.status)}
                  </div>

                  {/* Bike info */}
                  <div className="flex items-start gap-3 mb-3">
                    {task.bikeImage && (
                      <img
                        src={task.bikeImage}
                        alt={task.bikeName}
                        className="w-16 h-16 rounded-lg object-cover border border-gray-200 shrink-0"
                      />
                    )}
                    <div>
                      <h3 className="font-bold text-gray-900 text-base">
                        {task.bikeName || "Chưa có tên xe"}
                      </h3>
                      <p className="text-emerald-600 font-semibold text-sm">
                        {formatCurrency(task.price)}
                      </p>
                    </div>
                  </div>

                  {/* Buyer/Seller */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-start gap-2">
                      <MdPerson className="text-blue-400 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-gray-400 text-xs">
                          Người mua:
                        </span>
                        <p className="font-medium text-gray-800">
                          {buyer.name || "Đang cập nhật"}
                        </p>
                        {buyer.phone ? (
                          <a
                            href={`tel:${buyer.phone}`}
                            className="text-xs text-blue-600 flex items-center gap-1"
                          >
                            <MdPhone size={12} /> {buyer.phone}
                          </a>
                        ) : (
                          <span className="text-xs text-gray-400">
                            Chưa có SĐT
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MdPerson className="text-orange-400 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-gray-400 text-xs">
                          Người bán:
                        </span>
                        <p className="font-medium text-gray-800">
                          {seller.name || "Đang cập nhật"}
                        </p>
                        {seller.phone ? (
                          <a
                            href={`tel:${seller.phone}`}
                            className="text-xs text-blue-600 flex items-center gap-1"
                          >
                            <MdPhone size={12} /> {seller.phone}
                          </a>
                        ) : (
                          <span className="text-xs text-gray-400">
                            Chưa có SĐT
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex lg:flex-col gap-2 lg:justify-center shrink-0">
                  <button
                    onClick={() =>
                      setReportModal({
                        isOpen: true,
                        reservationId: task.id,
                        taskData: task,
                      })
                    }
                    className="flex-1 lg:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 transition-colors shadow-sm"
                  >
                    <MdDescription size={16} /> Xem báo cáo
                  </button>
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
          <p className="mt-4 text-gray-500 font-medium">
            Không tìm thấy lịch sử kiểm định nào
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
          </p>
          {(searchTerm ||
            filterStatus !== "all" ||
            filterResult !== "all" ||
            fromDate ||
            toDate) && (
            <button
              onClick={() => setSearchParams({})}
              className="mt-4 px-4 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
            >
              Xóa tất cả bộ lọc
            </button>
          )}
        </div>
      )}

      {/* Report Viewer Modal */}
      <ReportViewerModal
        reservationId={reportModal.reservationId}
        isOpen={reportModal.isOpen}
        taskData={reportModal.taskData}
        onClose={() =>
          setReportModal({ isOpen: false, reservationId: null, taskData: null })
        }
      />
    </div>
  );
};

export default InspectorHistoryPage;
