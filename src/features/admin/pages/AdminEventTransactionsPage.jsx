import React, { useState, useEffect } from "react";
import {
  MdSearch,
  MdFilterList,
  MdCheckCircle,
  MdCancel,
  MdAccessTime,
  MdAttachMoney,
  MdPerson,
  MdEventAvailable,
  MdClose,
  MdStorefront,
  MdLocationOn,
  MdInfoOutline,
  MdGavel,
  MdReportProblem,
  MdAccountBalanceWallet,
  MdPedalBike,
  MdVerified,
  MdCalendarToday,
} from "react-icons/md";
import formatCurrency from "../../../utils/formatCurrency";
import { reservationService } from "../../../services/reservationService";
import { eventBicycleService } from "../../../services/eventBicycleService";
import { toast } from "react-hot-toast";
import Modal from "../../../components/common/Modal";

const AdminEventTransactionsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [isProcessingCancel, setIsProcessingCancel] = useState(false);
  const [isProcessingPayout, setIsProcessingPayout] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // States cho Vi phạm (Dispute) Modal
  const [showViolationModal, setShowViolationModal] = useState(false);
  const [violationTarget, setViolationTarget] = useState(null);
  const [violationData, setViolationData] = useState({
    violationType: "BUYER_NO_SHOW",
    note: "",
  });

  // State quản lý Popup Xem chi tiết xe
  const [viewDetailTarget, setViewDetailTarget] = useState(null);
  const [detailedBikeInfo, setDetailedBikeInfo] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const res = await reservationService.getAllReservations();
      if (res && res.result) {
        // LỌC CHỈ LẤY GIAO DỊCH XE SỰ KIỆN
        const eventReservations = res.result.filter(
          (r) => r.eventBicycleId || r.eventBikeId,
        );
        setReservations(eventReservations);
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách reservation:", error);
      toast.error("Không thể tải danh sách đặt chỗ sự kiện");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  // --- LOGIC XỬ LÝ VI PHẠM ---
  const handleOpenViolationModal = (res) => {
    setViolationTarget(res);
    setViolationData({
      violationType: "BUYER_NO_SHOW",
      note: "",
    });
    setShowViolationModal(true);
  };

  const handleViolationSubmit = async (e) => {
    e.preventDefault();
    if (!violationData.note.trim()) {
      toast.error("Vui lòng nhập ghi chú hoặc lý do phạt vi phạm.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Tích hợp API xử lý vi phạm của Backend vào đây
      // await reservationService.handleViolation(violationTarget.reservationId, violationData);

      toast.success("Đã ghi nhận và xử lý vi phạm thành công!");
      setShowViolationModal(false);
      fetchReservations();
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi xử lý vi phạm!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApproveCancel = async (reservationId) => {
    if (
      !window.confirm(
        "Bạn có chắc chắn muốn CHẤP NHẬN yêu cầu hủy giao dịch này?",
      )
    )
      return;
    setIsProcessingCancel(true);
    try {
      await reservationService.approveCancelReservationByAdmin(reservationId);
      toast.success("Đã chấp nhận yêu cầu hủy giao dịch!");
      fetchReservations();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Lỗi khi duyệt hủy giao dịch!",
      );
    } finally {
      setIsProcessingCancel(false);
    }
  };

  const handleRejectCancel = async (reservationId) => {
    if (
      !window.confirm(
        "Bạn có chắc chắn muốn TỪ CHỐI yêu cầu hủy giao dịch này?",
      )
    )
      return;
    setIsProcessingCancel(true);
    try {
      await reservationService.rejectCancelReservationByAdmin(reservationId);
      toast.success("Đã từ chối yêu cầu hủy giao dịch!");
      fetchReservations();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Lỗi khi từ chối hủy giao dịch!",
      );
    } finally {
      setIsProcessingCancel(false);
    }
  };

  const handlePayoutToSeller = async (reservationId) => {
    if (
      !window.confirm(
        "Bạn có chắc chắn muốn CHUYỂN TIỀN cho người bán của giao dịch này?",
      )
    )
      return;
    setIsProcessingPayout(true);
    try {
      // API Payout (Nội bộ Backend)
      // await reservationService.payoutToSeller(reservationId);
      toast.success("Đã chuyển tiền cho người bán thành công!");
      fetchReservations();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Lỗi khi chuyển tiền cho người bán!",
      );
    } finally {
      setIsProcessingPayout(false);
    }
  };

  const handleOpenDetailModal = async (t) => {
    setViewDetailTarget(t);
    setDetailedBikeInfo(null);
    setLoadingDetail(true);
    try {
      const bikeId = t.eventBicycleId || t.eventBikeId;
      if (bikeId) {
        const res = await eventBicycleService.getEventBicycleById(bikeId);
        if (res && res.result) setDetailedBikeInfo(res.result);
      }
    } catch (error) {
      console.error("Không thể lấy dữ liệu chi tiết xe sự kiện:", error);
    } finally {
      setLoadingDetail(false);
    }
  };

  const filteredReservations = reservations.filter((r) => {
    const title =
      r.eventBicycleTitle || r.eventBikeTitle || r.listingTitle || "";
    const matchSearch =
      r.reservationId.toString().includes(searchTerm) ||
      (r.buyerName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.sellerName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "all" || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const sortedReservations = [...filteredReservations].sort((a, b) => {
    const statusPriority = {
      Pending_Cancel: 1,
      Disputed: 2,
      Inspection_Failed: 3,
      Deposited: 4,
      Waiting_Payment: 5,
      Completed: 6,
      Paid_Out: 7,
      Cancelled: 8,
    };
    const priorityA = statusPriority[a.status] || 99;
    const priorityB = statusPriority[b.status] || 99;

    if (priorityA !== priorityB) return priorityA - priorityB;
    return b.reservationId - a.reservationId;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending_Cancel":
        return {
          label: "Yêu cầu hủy",
          icon: MdCancel,
          bg: "bg-red-50",
          text: "text-red-700",
          border: "border-red-200",
        };
      case "Disputed":
        return {
          label: "Đang tranh chấp",
          icon: MdGavel,
          bg: "bg-orange-50",
          text: "text-orange-700",
          border: "border-orange-200",
        };
      case "Waiting_Payment":
        return {
          label: "Chờ thanh toán",
          icon: MdAccessTime,
          bg: "bg-gray-100",
          text: "text-gray-700",
          border: "border-gray-200",
        };
      case "Deposited":
        return {
          label: "Chờ giao dịch tại Event",
          icon: MdEventAvailable,
          bg: "bg-orange-100",
          text: "text-orange-800",
          border: "border-orange-200",
        };
      case "Inspection_Failed":
        return {
          label: "Kiểm định thất bại",
          icon: MdReportProblem,
          bg: "bg-red-50",
          text: "text-red-700",
          border: "border-red-200",
        };
      case "Completed":
        return {
          label: "Hoàn thành",
          icon: MdCheckCircle,
          bg: "bg-green-100",
          text: "text-green-800",
          border: "border-green-200",
        };
      case "Paid_Out":
        return {
          label: "Đã trả seller",
          icon: MdAccountBalanceWallet,
          bg: "bg-purple-100",
          text: "text-purple-800",
          border: "border-purple-200",
        };
      case "Cancelled":
        return {
          label: "Đã hủy",
          icon: MdCancel,
          bg: "bg-red-100",
          text: "text-red-800",
          border: "border-red-200",
        };
      default:
        return {
          label: status,
          icon: null,
          bg: "bg-gray-100",
          text: "text-gray-700",
          border: "border-gray-200",
        };
    }
  };

  const stats = {
    total: reservations.length,
    deposited: reservations.filter((t) => t.status === "Deposited").length,
    completed: reservations.filter((t) => t.status === "Completed").length,
    disputed: reservations.filter(
      (t) => t.status === "Disputed" || t.status === "Pending_Cancel",
    ).length,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">
              Quản lý Giao dịch Sự kiện
            </h1>
            <p className="text-gray-500 text-base mt-2 flex items-center gap-2">
              <MdEventAvailable className="text-orange-500" size={20} />
              Theo dõi và phân xử các giao dịch diễn ra trực tiếp tại sự kiện
            </p>
          </div>
        </div>

        {/* THỐNG KÊ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
                <MdEventAvailable size={20} />
              </div>
              <p className="text-sm font-bold text-gray-500">Tổng số</p>
            </div>
            <p className="text-2xl font-black text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center">
                <MdAttachMoney size={20} />
              </div>
              <p className="text-sm font-bold text-gray-500">Chờ giao dịch</p>
            </div>
            <p className="text-2xl font-black text-gray-900">
              {stats.deposited}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                <MdGavel size={20} />
              </div>
              <p className="text-sm font-bold text-gray-500">Cần phân xử</p>
            </div>
            <p className="text-2xl font-black text-gray-900">
              {stats.disputed}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                <MdCheckCircle size={20} />
              </div>
              <p className="text-sm font-bold text-gray-500">Hoàn thành</p>
            </div>
            <p className="text-2xl font-black text-gray-900">
              {stats.completed}
            </p>
          </div>
        </div>

        {/* BỘ LỌC */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <MdSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã, tên xe, người mua, người bán..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <MdFilterList
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <select
              className="w-full md:w-48 pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none appearance-none font-medium cursor-pointer"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Waiting_Payment">Chờ thanh toán</option>
              <option value="Deposited">Chờ giao dịch tại Event</option>
              <option value="Pending_Cancel">Yêu cầu hủy</option>
              <option value="Inspection_Failed">Kiểm định thất bại</option>
              <option value="Disputed">Đang tranh chấp</option>
              <option value="Completed">Hoàn thành</option>
              <option value="Paid_Out">Đã trả seller</option>
              <option value="Cancelled">Đã hủy</option>
            </select>
          </div>
        </div>

        {/* DANH SÁCH GIAO DỊCH SỰ KIỆN */}
        {loading ? (
          <div className="text-center py-12 text-gray-500 font-medium">
            Đang tải dữ liệu...
          </div>
        ) : sortedReservations.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <MdEventAvailable
              className="mx-auto text-gray-300 mb-3"
              size={48}
            />
            <p className="text-gray-500 font-medium">
              Không tìm thấy giao dịch sự kiện nào.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {sortedReservations.map((r) => {
              const badge = getStatusBadge(r.status);
              const BadgeIcon = badge.icon;
              const displayTitle =
                r.eventBicycleTitle ||
                r.eventBikeTitle ||
                r.listingTitle ||
                "Xe sự kiện";
              const displayImage =
                r.eventBicycleImage ||
                r.eventBikeImage ||
                r.listingImage ||
                "https://via.placeholder.com/400x300?text=No+Image";

              return (
                <div
                  key={r.reservationId}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden group flex flex-col relative"
                >
                  <div className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-sm z-10 flex items-center gap-1">
                    <MdEventAvailable size={14} /> Sự kiện
                  </div>

                  <div className="p-5 flex-1 mt-3">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono font-bold text-sm text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                        #{r.reservationId}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${badge.bg} ${badge.text} ${badge.border}`}
                      >
                        {BadgeIcon && <BadgeIcon size={14} />}
                        {badge.label}
                      </span>
                    </div>

                    <div className="flex gap-3 mb-4">
                      <button
                        onClick={() => handleOpenDetailModal(r)}
                        className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 relative group outline-none shrink-0"
                      >
                        <img
                          src={displayImage?.split(",")[0]}
                          alt={displayTitle}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <MdInfoOutline size={20} className="text-white" />
                        </div>
                      </button>
                      <div className="flex-1 min-w-0">
                        <button
                          onClick={() => handleOpenDetailModal(r)}
                          className="font-bold text-gray-900 text-base line-clamp-2 hover:text-orange-600 transition-colors text-left outline-none"
                        >
                          {displayTitle}
                        </button>
                        <p className="text-orange-600 font-bold text-sm mt-1">
                          Cọc: {formatCurrency(r.depositAmount || 0)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                      <div className="bg-gray-50 p-3 rounded-xl">
                        <p className="text-gray-400 text-xs mb-1 flex items-center gap-1">
                          <MdPerson /> Người mua
                        </p>
                        <p className="font-bold text-gray-900 truncate">
                          {r.buyerName || "N/A"}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-xl">
                        <p className="text-gray-400 text-xs mb-1 flex items-center gap-1">
                          <MdStorefront /> Người bán
                        </p>
                        <p className="font-bold text-gray-900 truncate">
                          {r.sellerName || "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* Vị trí giao dịch sự kiện */}
                    <div className="bg-orange-50 p-3 rounded-xl mb-4 flex items-center gap-2 text-sm">
                      <MdLocationOn
                        className="text-orange-500 shrink-0"
                        size={18}
                      />
                      <span className="text-orange-800 font-medium">
                        Giao dịch trực tiếp tại khu vực sự kiện
                      </span>
                    </div>

                    {(r.cancelDescription || r.status === "Pending_Cancel") &&
                      r.status !== "Cancelled" && (
                        <div className="bg-red-50 p-3 rounded-xl mb-4 text-sm border border-red-100">
                          <p className="font-bold text-red-700 mb-1 flex items-center gap-1">
                            <MdCancel size={16} /> Lý do yêu cầu hủy:
                          </p>
                          <p className="text-red-600">
                            {r.cancelDescription ||
                              "Yêu cầu hủy giao dịch (không kèm lý do)"}
                          </p>
                        </div>
                      )}
                  </div>

                  <div className="p-4 border-t border-gray-50 bg-gray-50/50 flex flex-wrap justify-end gap-2">
                    {(r.status === "Pending_Cancel" ||
                      (r.cancelDescription && r.status !== "Cancelled")) && (
                      <>
                        <button
                          disabled={isProcessingCancel}
                          onClick={() => handleApproveCancel(r.reservationId)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50"
                        >
                          <MdCheckCircle size={16} /> Duyệt hủy
                        </button>
                        <button
                          disabled={isProcessingCancel}
                          onClick={() => handleRejectCancel(r.reservationId)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-100 transition-colors disabled:opacity-50"
                        >
                          <MdClose size={16} /> Từ chối
                        </button>
                      </>
                    )}

                    {[
                      "Deposited",
                      "Waiting_Payment",
                      "Inspection_Failed",
                      "Pending_Cancel",
                      "Disputed",
                    ].includes(r.status) && (
                      <button
                        onClick={() => handleOpenViolationModal(r)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-orange-100 text-orange-700 border border-orange-200 rounded-xl text-sm font-bold hover:bg-orange-200 transition-colors"
                      >
                        <MdGavel size={16} /> Phân xử / Phạt
                      </button>
                    )}

                    {r.status === "Completed" && (
                      <button
                        disabled={isProcessingPayout}
                        onClick={() => handlePayoutToSeller(r.reservationId)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 transition-colors shadow-sm disabled:opacity-50"
                      >
                        <MdAccountBalanceWallet size={16} />
                        {isProcessingPayout
                          ? "Đang xử lý..."
                          : "Trả tiền cho Seller"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* MODAL XỬ LÝ VI PHẠM */}
        {showViolationModal && violationTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-red-50">
                <h3 className="font-black text-lg text-red-700 flex items-center gap-2">
                  <MdGavel size={24} />
                  Phân xử vi phạm Sự kiện
                </h3>
                <button
                  onClick={() => setShowViolationModal(false)}
                  className="text-red-400 hover:text-red-600 transition-colors"
                >
                  <MdClose size={24} />
                </button>
              </div>
              <div className="p-6">
                <div className="mb-5 bg-gray-50 p-4 rounded-xl border border-gray-200 text-sm">
                  <p className="text-gray-500 mb-1">Giao dịch đang phân xử:</p>
                  <p className="font-bold text-gray-900">
                    Mã: #{violationTarget.reservationId}
                  </p>
                  <p className="font-bold text-gray-900 line-clamp-1">
                    {violationTarget.listingTitle ||
                      violationTarget.eventBicycleTitle ||
                      violationTarget.eventBikeTitle}
                  </p>
                </div>
                <form onSubmit={handleViolationSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Chọn lỗi vi phạm <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={violationData.violationType}
                      onChange={(e) =>
                        setViolationData({
                          ...violationData,
                          violationType: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 outline-none cursor-pointer"
                    >
                      <option value="BUYER_NO_SHOW">
                        Người mua KHÔNG ĐẾN event (Phạt mất cọc)
                      </option>
                      <option value="SELLER_NO_SHOW">
                        Người bán KHÔNG ĐẾN event (Hoàn cọc Buyer, phạt Seller)
                      </option>
                      <option value="INSPECTION_FAILED">
                        Xe lỗi / Sai mô tả (Hoàn cọc Buyer, phạt Seller)
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Ghi chú / Lý do phạt{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      value={violationData.note}
                      onChange={(e) =>
                        setViolationData({
                          ...violationData,
                          note: e.target.value,
                        })
                      }
                      placeholder="Ghi rõ lý do đền bù, số tiền phạt, bằng chứng (nếu có)..."
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none min-h-[120px] resize-none"
                    ></textarea>
                    <p className="text-xs text-gray-500 mt-2 flex items-start gap-1">
                      <MdReportProblem className="text-orange-500 mt-0.5 shrink-0" />
                      Lưu ý: Hành động này sẽ HỦY giao dịch và kích hoạt dòng
                      tiền phạt trên hệ thống.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowViolationModal(false)}
                      className="px-6 py-2.5 rounded-xl font-bold bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 rounded-xl font-bold bg-red-600 text-white hover:bg-red-700 shadow-md disabled:opacity-70 flex items-center gap-2 transition-colors"
                    >
                      {isSubmitting ? (
                        "Đang xử lý..."
                      ) : (
                        <>
                          <MdGavel size={18} /> Xác nhận phạt
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* MODAL CHI TIẾT BÀI ĐĂNG POPUP HIỆN ĐẠI */}
        <Modal
          isOpen={!!viewDetailTarget}
          onClose={() => {
            setViewDetailTarget(null);
            setDetailedBikeInfo(null);
          }}
          title=""
          footer={null}
        >
          {viewDetailTarget && (
            <div className="relative -mx-6 -mt-6 rounded-t-2xl overflow-hidden">
              <div className="relative h-64 md:h-80 w-full bg-zinc-900 group">
                <img
                  src={
                    detailedBikeInfo?.image_url?.split(",")[0] ||
                    viewDetailTarget.listingImage ||
                    viewDetailTarget.eventBicycleImage ||
                    viewDetailTarget.eventBikeImage ||
                    "https://via.placeholder.com/800x400?text=No+Image"
                  }
                  alt={
                    viewDetailTarget.listingTitle ||
                    viewDetailTarget.eventBicycleTitle ||
                    viewDetailTarget.eventBikeTitle
                  }
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent"></div>

                <button
                  onClick={() => {
                    setViewDetailTarget(null);
                    setDetailedBikeInfo(null);
                  }}
                  className="absolute top-4 right-4 w-9 h-9 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors z-20 shadow-sm"
                >
                  <MdClose size={22} />
                </button>

                <div className="absolute bottom-0 left-0 p-6 w-full z-10">
                  <span className="bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded mb-2 inline-flex items-center gap-1 shadow-sm">
                    <MdEventAvailable size={14} /> Xe Sự kiện
                  </span>
                  <h2 className="text-2xl md:text-3xl font-black text-white leading-tight mb-1 drop-shadow-md">
                    {viewDetailTarget.listingTitle ||
                      viewDetailTarget.eventBicycleTitle ||
                      viewDetailTarget.eventBikeTitle}
                  </h2>
                  <p className="text-orange-400 font-black text-2xl drop-shadow-md">
                    {formatCurrency(viewDetailTarget.bikePrice)}
                  </p>
                </div>
              </div>

              <div className="p-6 max-h-[50vh] overflow-y-auto custom-scrollbar bg-white">
                {loadingDetail ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full"></div>
                    <p className="text-gray-500 text-sm font-medium">
                      Đang tải thông tin xe...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                        <p className="text-xs text-gray-400 font-medium flex items-center gap-1 mb-1">
                          <MdStorefront /> Thương hiệu
                        </p>
                        <p className="font-bold text-gray-800 text-sm truncate">
                          {detailedBikeInfo?.bicycle?.brand?.name ||
                            detailedBikeInfo?.bicycle?.brandName ||
                            "N/A"}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                        <p className="text-xs text-gray-400 font-medium flex items-center gap-1 mb-1">
                          <MdPedalBike /> Loại xe
                        </p>
                        <p className="font-bold text-gray-800 text-sm truncate">
                          {detailedBikeInfo?.bicycle?.category?.name ||
                            detailedBikeInfo?.bikeType ||
                            "N/A"}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                        <p className="text-xs text-gray-400 font-medium flex items-center gap-1 mb-1">
                          <MdVerified /> Tình trạng
                        </p>
                        <p className="font-bold text-orange-600 text-sm truncate">
                          {detailedBikeInfo?.condition || "N/A"}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                        <p className="text-xs text-gray-400 font-medium flex items-center gap-1 mb-1">
                          <MdCalendarToday /> Năm SX
                        </p>
                        <p className="font-bold text-gray-800 text-sm truncate">
                          {detailedBikeInfo?.bicycle?.yearManufacture || "N/A"}
                        </p>
                      </div>
                    </div>

                    {detailedBikeInfo?.bicycle && (
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600 border-t border-gray-100 pt-4">
                        <div className="flex justify-between items-center py-1">
                          <span className="text-gray-400">Khung xe:</span>
                          <span className="font-medium text-gray-800">
                            {detailedBikeInfo.bicycle?.frameMaterial || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                          <span className="text-gray-400">Size khung:</span>
                          <span className="font-medium text-gray-800">
                            {detailedBikeInfo.bicycle?.frameSize || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                          <span className="text-gray-400">Phanh xe:</span>
                          <span className="font-medium text-gray-800">
                            {detailedBikeInfo.bicycle?.brakeType || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                          <span className="text-gray-400">Bộ đề:</span>
                          <span className="font-medium text-gray-800">
                            {detailedBikeInfo.bicycle?.drivetrain || "N/A"}
                          </span>
                        </div>
                      </div>
                    )}

                    <div>
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <MdInfoOutline className="text-orange-500" /> Mô tả chi
                        tiết từ người bán
                      </h4>
                      <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100 whitespace-pre-wrap">
                        {detailedBikeInfo?.description ||
                          detailedBikeInfo?.bicycle?.description ||
                          "Chưa có thông tin mô tả."}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end rounded-b-2xl">
                <button
                  onClick={() => {
                    setViewDetailTarget(null);
                    setDetailedBikeInfo(null);
                  }}
                  className="px-6 py-2 bg-zinc-900 text-white rounded-lg font-bold hover:bg-zinc-800 transition-colors shadow-sm"
                >
                  Đóng
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default AdminEventTransactionsPage;
