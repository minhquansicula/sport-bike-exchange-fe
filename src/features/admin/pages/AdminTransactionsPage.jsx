import React, { useState, useEffect } from "react";
import {
  MdSearch,
  MdFilterList,
  MdVisibility,
  MdCheckCircle,
  MdCancel,
  MdAccessTime,
  MdAttachMoney,
  MdPerson,
  MdPedalBike,
  MdEventAvailable,
  MdClose,
  MdEdit,
} from "react-icons/md";
import formatCurrency from "../../../utils/formatCurrency";
// Giả định bạn đã tạo 2 file service này:
import { reservationService } from "../../../services/reservationService";
import { userService } from "../../../services/userService"; // Để get list Inspectors

const AdminTransactionsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Modal Lên lịch
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedRes, setSelectedRes] = useState(null);
  const [inspectors, setInspectors] = useState([]);

  // Form State
  const [scheduleData, setScheduleData] = useState({
    inspectorId: "",
    meetingLocation: "",
    meetingTime: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const res = await reservationService.getAllReservations();
      if (res && res.result) {
        setReservations(res.result.reverse());
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách reservation:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInspectors = async () => {
    try {
      // Giả sử API lấy danh sách User theo Role. Bạn thay thế bằng hàm API thực tế của bạn
      const res = await userService.getAllUsers();
      if (res && res.result) {
        const listInspector = res.result.filter(
          (u) =>
            u.role?.toUpperCase() === "INSPECTOR" ||
            u.role?.toUpperCase() === "ADMIN",
        );
        setInspectors(listInspector);
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách inspector:", error);
    }
  };

  useEffect(() => {
    fetchReservations();
    fetchInspectors();
  }, []);

  const handleOpenScheduleModal = (res) => {
    setSelectedRes(res);
    setScheduleData({
      inspectorId: res.inspectorId || "",
      meetingLocation: res.meetingLocation || "",
      meetingTime: res.meetingTime
        ? new Date(res.meetingTime).toISOString().slice(0, 16)
        : "",
    });
    setShowScheduleModal(true);
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await reservationService.scheduleReservation(selectedRes.reservationId, {
        inspectorId: parseInt(scheduleData.inspectorId),
        meetingLocation: scheduleData.meetingLocation,
        meetingTime: new Date(scheduleData.meetingTime).toISOString(),
      });
      alert("Lên lịch thành công!");
      setShowScheduleModal(false);
      fetchReservations(); // Tải lại danh sách
    } catch (error) {
      alert(error.response?.data?.message || "Lỗi khi lên lịch hẹn!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Lọc reservations
  const filteredReservations = reservations.filter((r) => {
    const matchSearch =
      r.reservationId.toString().includes(searchTerm) ||
      (r.buyerName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.listingTitle || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "all" || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "Waiting_Payment":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500 uppercase">
            <MdAccessTime size={12} /> Chờ TT
          </span>
        );
      case "Deposited":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-yellow-100 text-yellow-700 uppercase">
            <MdAccessTime size={12} /> Đã cọc
          </span>
        );
      case "Scheduled":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 uppercase animate-pulse">
            <MdEventAvailable size={12} /> Đã xếp lịch
          </span>
        );
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700 uppercase">
            <MdCheckCircle size={12} /> Hoàn thành
          </span>
        );
      default:
        return <span className="text-xs">{status}</span>;
    }
  };

  // Thống kê nhanh
  const stats = {
    total: reservations.length,
    deposited: reservations.filter((t) => t.status === "Deposited").length,
    scheduled: reservations.filter((t) => t.status === "Scheduled").length,
    completed: reservations.filter((t) => t.status === "Completed").length,
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Quản lý Đặt chỗ & Lịch hẹn
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Xếp lịch hẹn kiểm tra xe cho các giao dịch đã được thanh toán cọc.
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <p className="text-3xl font-black text-gray-900">{stats.total}</p>
          <p className="text-sm font-medium text-gray-500 mt-1">Tổng yêu cầu</p>
        </div>
        <div className="bg-yellow-50 rounded-2xl border border-yellow-100 p-5 shadow-sm">
          <p className="text-3xl font-black text-yellow-700">
            {stats.deposited}
          </p>
          <p className="text-sm font-medium text-yellow-600 mt-1">
            Chờ xếp lịch (Đã cọc)
          </p>
        </div>
        <div className="bg-blue-50 rounded-2xl border border-blue-100 p-5 shadow-sm">
          <p className="text-3xl font-black text-blue-700">{stats.scheduled}</p>
          <p className="text-sm font-medium text-blue-600 mt-1">
            Đã lên lịch hẹn
          </p>
        </div>
        <div className="bg-green-50 rounded-2xl border border-green-100 p-5 shadow-sm">
          <p className="text-3xl font-black text-green-700">
            {stats.completed}
          </p>
          <p className="text-sm font-medium text-green-600 mt-1">
            Giao dịch thành công
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Tìm theo mã, tên người mua, tên xe..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 outline-none text-sm font-medium"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 outline-none text-sm font-bold text-slate-700 cursor-pointer min-w-[200px]"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Waiting_Payment">Chờ thanh toán</option>
            <option value="Deposited">Đã cọc (Chờ xếp lịch)</option>
            <option value="Scheduled">Đã xếp lịch</option>
            <option value="Completed">Hoàn thành</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-slate-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Mã GD
                </th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Người mua
                </th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Tiền cọc
                </th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="text-right px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-10 text-gray-500 font-medium"
                  >
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : filteredReservations.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-10 text-gray-500 font-medium"
                  >
                    Không tìm thấy Đặt chỗ nào.
                  </td>
                </tr>
              ) : (
                filteredReservations.map((r) => (
                  <tr
                    key={r.reservationId}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono font-bold text-slate-700 text-sm">
                      #{r.reservationId}
                    </td>
                    <td className="px-6 py-4">
                      <p
                        className="font-bold text-sm text-gray-900 line-clamp-2 max-w-[200px]"
                        title={r.listingTitle}
                      >
                        {r.listingTitle}
                      </p>
                    </td>
                    <td className="px-6 py-4 font-medium text-sm text-gray-800">
                      {r.buyerName}
                    </td>
                    <td className="px-6 py-4 font-bold text-orange-600">
                      {formatCurrency(r.depositAmount || 0)}
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(r.status)}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {r.status === "Deposited" ? (
                        <button
                          onClick={() => handleOpenScheduleModal(r)}
                          className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-orange-500 transition-colors shadow-sm inline-flex items-center gap-1.5"
                        >
                          <MdEventAvailable size={14} /> Lên Lịch Hẹn
                        </button>
                      ) : r.status === "Scheduled" ? (
                        <button
                          onClick={() => handleOpenScheduleModal(r)}
                          className="px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors inline-flex items-center gap-1.5"
                        >
                          <MdEdit size={14} /> Đổi lịch
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400 font-medium">
                          Không khả dụng
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SCHEDULE MODAL */}
      {showScheduleModal && selectedRes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-black text-lg text-gray-900 flex items-center gap-2">
                <MdEventAvailable className="text-orange-500" /> Xếp lịch cho Mã
                #{selectedRes.reservationId}
              </h3>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-gray-400 hover:text-red-500"
              >
                <MdClose size={24} />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Chọn Inspector (Kiểm định viên){" "}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={scheduleData.inspectorId}
                  onChange={(e) =>
                    setScheduleData({
                      ...scheduleData,
                      inspectorId: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none cursor-pointer"
                >
                  <option value="">-- Chọn nhân sự --</option>
                  {inspectors.map((ins) => (
                    <option key={ins.userId} value={ins.userId}>
                      {ins.fullName || ins.username} - SĐT: {ins.phone}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Thời gian hẹn gặp <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  required
                  value={scheduleData.meetingTime}
                  onChange={(e) =>
                    setScheduleData({
                      ...scheduleData,
                      meetingTime: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Địa điểm VeloX Hub <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Trạm VeloX Quận 1, HCM"
                  value={scheduleData.meetingLocation}
                  onChange={(e) =>
                    setScheduleData({
                      ...scheduleData,
                      meetingLocation: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-6 py-2.5 rounded-xl font-bold bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl font-bold bg-slate-900 text-white hover:bg-orange-500 shadow-md disabled:opacity-70 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    "Đang lưu..."
                  ) : (
                    <>
                      <MdCheckCircle /> Lưu lịch hẹn
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTransactionsPage;
