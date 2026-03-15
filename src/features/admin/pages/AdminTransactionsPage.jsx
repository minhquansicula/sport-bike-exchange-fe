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
  MdStorefront,
  MdLocationOn,
  MdPhone,
  MdInfoOutline,
} from "react-icons/md";
import formatCurrency from "../../../utils/formatCurrency";
import { reservationService } from "../../../services/reservationService";
import { userService } from "../../../services/userService";
import { bikeService } from "../../../services/bikeService"; // Thêm service
import { toast } from "react-hot-toast";
import LocationPicker from "../../../components/common/LocationPicker";

const AdminTransactionsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedRes, setSelectedRes] = useState(null);
  const [inspectors, setInspectors] = useState([]);
  const [scheduleData, setScheduleData] = useState({
    inspectorId: "",
    meetingLocation: "",
    meetingTime: "",
    latitude: null,
    longitude: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingCancel, setIsProcessingCancel] = useState(false);

  // State cho modal xem bài đăng
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loadingPost, setLoadingPost] = useState(false);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const res = await reservationService.getAllReservations();
      if (res && res.result) {
        setReservations(res.result.reverse());
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách reservation:", error);
      toast.error("Không thể tải danh sách đặt chỗ");
    } finally {
      setLoading(false);
    }
  };

  const fetchInspectors = async () => {
    try {
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
      toast.error("Không thể tải danh sách kiểm định viên");
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
      latitude: res.latitude || null,
      longitude: res.longitude || null,
    });
    setShowScheduleModal(true);
  };

  const handleLocationSelect = (locationData) => {
    setScheduleData({
      ...scheduleData,
      meetingLocation: locationData.address,
      latitude: locationData.lat,
      longitude: locationData.lng,
    });
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (
      !scheduleData.inspectorId ||
      !scheduleData.meetingLocation ||
      !scheduleData.meetingTime ||
      !scheduleData.latitude || // <-- kiểm tra thêm
      !scheduleData.longitude
    ) {
      toast.error(
        "Vui lòng chọn địa điểm trên bản đồ và điền đầy đủ thông tin",
      );
      return;
    }
    setIsSubmitting(true);
    try {
      await reservationService.scheduleReservation(selectedRes.reservationId, {
        inspectorId: parseInt(scheduleData.inspectorId),
        meetingLocation: scheduleData.meetingLocation,
        meetingTime: new Date(scheduleData.meetingTime).toISOString(),
        latitude: scheduleData.latitude, // <-- gửi lên
        longitude: scheduleData.longitude, // <-- gửi lên
      });
      toast.success("Lên lịch thành công!");
      setShowScheduleModal(false);
      fetchReservations();
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi lên lịch hẹn!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApproveCancel = async (reservationId) => {
    if (!window.confirm("Bạn có chắc chắn muốn CHẤP NHẬN yêu cầu hủy giao dịch này?")) return;
    setIsProcessingCancel(true);
    try {
      await reservationService.approveCancelReservationByAdmin(reservationId);
      toast.success("Đã chấp nhận yêu cầu hủy giao dịch!");
      fetchReservations();
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi duyệt hủy giao dịch!");
    } finally {
      setIsProcessingCancel(false);
    }
  };

  const handleRejectCancel = async (reservationId) => {
    if (!window.confirm("Bạn có chắc chắn muốn TỪ CHỐI yêu cầu hủy giao dịch này?")) return;
    setIsProcessingCancel(true);
    try {
      await reservationService.rejectCancelReservationByAdmin(reservationId);
      toast.success("Đã từ chối yêu cầu hủy giao dịch!");
      fetchReservations();
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi từ chối hủy giao dịch!");
    } finally {
      setIsProcessingCancel(false);
    }
  };

  // Hàm xem chi tiết bài đăng
  const handleViewPost = async (listingId) => {
    setLoadingPost(true);
    try {
      const res = await bikeService.getBikeListingById(listingId);
      if (res && res.result) {
        setSelectedPost(res.result);
        setShowPostModal(true);
      }
    } catch (error) {
      toast.error("Không thể tải thông tin bài đăng");
    } finally {
      setLoadingPost(false);
    }
  };

  // Lọc reservations
  const filteredReservations = reservations.filter((r) => {
    const matchSearch =
      r.reservationId.toString().includes(searchTerm) ||
      (r.buyerName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.sellerName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.listingTitle || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "all" || r.status === filterStatus;
    return matchSearch && matchStatus;
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
          label: "Đã cọc",
          icon: MdAccessTime,
          bg: "bg-yellow-100",
          text: "text-yellow-800",
          border: "border-yellow-200",
        };
      case "Scheduled":
        return {
          label: "Đã xếp lịch",
          icon: MdEventAvailable,
          bg: "bg-blue-100",
          text: "text-blue-800",
          border: "border-blue-200",
        };
      case "Completed":
        return {
          label: "Hoàn thành",
          icon: MdCheckCircle,
          bg: "bg-green-100",
          text: "text-green-800",
          border: "border-green-200",
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

  // Thống kê nhanh
  const stats = {
    total: reservations.length,
    deposited: reservations.filter((t) => t.status === "Deposited").length,
    scheduled: reservations.filter((t) => t.status === "Scheduled").length,
    completed: reservations.filter((t) => t.status === "Completed").length,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">
              Quản lý Đặt chỗ
            </h1>
            <p className="text-gray-500 text-base mt-2 flex items-center gap-2">
              <MdEventAvailable className="text-orange-500" size={20} />
              Xếp lịch hẹn kiểm tra xe cho các giao dịch đã cọc
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {/* ... giữ nguyên stats ... */}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          {/* ... giữ nguyên filter ... */}
        </div>

        {/* Cards Grid */}
        {loading ? (
          <div className="text-center py-12 text-gray-500 font-medium">
            Đang tải dữ liệu...
          </div>
        ) : filteredReservations.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <MdEventAvailable
              className="mx-auto text-gray-300 mb-3"
              size={48}
            />
            <p className="text-gray-500 font-medium">
              Không tìm thấy đặt chỗ nào.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredReservations.map((r) => {
              const badge = getStatusBadge(r.status);
              const BadgeIcon = badge.icon;
              return (
                <div
                  key={r.reservationId}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden group"
                >
                  <div className="p-5">
                    {/* Header với mã và badge */}
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

                    {/* Thông tin sản phẩm - có nút xem chi tiết */}
                    <div className="flex gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
                        <MdPedalBike size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3
                            className="font-bold text-gray-900 text-base line-clamp-1"
                            title={r.listingTitle}
                          >
                            {r.listingTitle}
                          </h3>
                          <button
                            onClick={() => handleViewPost(r.listingId)}
                            className="text-gray-400 hover:text-orange-500 transition-colors"
                            title="Xem chi tiết bài đăng"
                          >
                            <MdInfoOutline size={18} />
                          </button>
                        </div>
                        <p className="text-orange-600 font-bold text-sm mt-1">
                          Cọc: {formatCurrency(r.depositAmount || 0)}
                        </p>
                      </div>
                    </div>

                    {/* Buyer & Seller */}
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
                          {r.sellerName || "Đang cập nhật"}
                        </p>
                      </div>
                    </div>

                    {/* Inspector & Location (nếu có) */}
                    {r.status === "Scheduled" && (
                      <div className="bg-blue-50 p-3 rounded-xl mb-4 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                          <MdPerson size={16} />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-blue-700 font-bold">
                            Inspector
                          </p>
                          <p className="font-bold text-gray-900">
                            {r.inspectorName || "Đang cập nhật"}
                          </p>
                          {r.inspectorPhone && (
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                              <MdPhone size={12} /> {r.inspectorPhone}
                            </p>
                          )}
                          {r.meetingLocation && (
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                              <MdLocationOn size={12} /> {r.meetingLocation}
                            </p>
                          )}
                          {r.meetingTime && (
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(r.meetingTime).toLocaleString("vi-VN")}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Hiển thị lý do hủy nếu có (nếu Pending_Cancel hoặc trường hợp hủy khác) */}
                    {(r.cancelDescription || r.status === "Pending_Cancel") && r.status !== "Cancelled" && (
                      <div className="bg-red-50 p-3 rounded-xl mb-4 text-sm border border-red-100">
                        <p className="font-bold text-red-700 mb-1 flex items-center gap-1">
                          <MdCancel size={16} /> Lý do yêu cầu hủy:
                        </p>
                        <p className="text-red-600">
                          {r.cancelDescription || "Người bán yêu cầu hủy giao dịch (không kèm lý do)"}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-2 mt-2">
                      {(r.status === "Pending_Cancel" || (r.cancelDescription && r.status !== "Cancelled")) && (
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
                      {r.status === "Deposited" && (
                        <button
                          onClick={() => handleOpenScheduleModal(r)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-orange-600 text-white rounded-xl text-sm font-bold hover:bg-orange-700 transition-colors shadow-sm"
                        >
                          <MdEventAvailable size={16} /> Lên lịch hẹn
                        </button>
                      )}
                      {r.status === "Scheduled" && (
                        <button
                          onClick={() => handleOpenScheduleModal(r)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors"
                        >
                          <MdEdit size={16} /> Đổi lịch
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* MODAL XEM CHI TIẾT BÀI ĐĂNG */}
        {showPostModal && selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="font-black text-lg text-gray-900 flex items-center gap-2">
                  <MdPedalBike className="text-orange-500" size={24} />
                  Chi tiết bài đăng
                </h3>
                <button
                  onClick={() => setShowPostModal(false)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <MdClose size={24} />
                </button>
              </div>

              <div className="p-6 max-h-[70vh] overflow-y-auto">
                {loadingPost ? (
                  <div className="text-center py-8">Đang tải...</div>
                ) : (
                  <div className="space-y-4">
                    <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
                      <img
                        src={
                          selectedPost.image_url?.split(",")[0] ||
                          "https://via.placeholder.com/800x400?text=No+Image"
                        }
                        alt={selectedPost.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h2 className="text-xl font-black text-gray-900">
                      {selectedPost.title}
                    </h2>
                    <p className="text-orange-600 font-bold text-2xl">
                      {formatCurrency(selectedPost.price)}
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-500">Thương hiệu</p>
                        <p className="font-bold">
                          {selectedPost.brandName || "N/A"}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-500">Loại xe</p>
                        <p className="font-bold">
                          {selectedPost.categoryName || "N/A"}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-500">Tình trạng</p>
                        <p className="font-bold">
                          {selectedPost.condition || "N/A"}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-500">Năm sản xuất</p>
                        <p className="font-bold">
                          {selectedPost.yearManufacture || "N/A"}
                        </p>
                      </div>
                    </div>

                    {selectedPost.description && (
                      <div>
                        <p className="text-gray-700 text-sm whitespace-pre-wrap">
                          {selectedPost.description}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                <button
                  onClick={() => setShowPostModal(false)}
                  className="px-6 py-2 bg-gray-900 text-white rounded-xl font-bold hover:bg-orange-500 transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SCHEDULE MODAL */}
        {showScheduleModal && selectedRes && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
            {showScheduleModal && selectedRes && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
                <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95">
                  <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-black text-lg text-gray-900 flex items-center gap-2">
                      <MdEventAvailable className="text-orange-500" size={24} />
                      Xếp lịch cho mã #{selectedRes.reservationId}
                    </h3>
                    <button
                      onClick={() => setShowScheduleModal(false)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <MdClose size={24} />
                    </button>
                  </div>

                  <form
                    onSubmit={handleScheduleSubmit}
                    className="p-6 space-y-5"
                  >
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Inspector <span className="text-red-500">*</span>
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
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none cursor-pointer"
                      >
                        <option value="">-- Chọn kiểm định viên --</option>
                        {inspectors.map((ins) => (
                          <option key={ins.userId} value={ins.userId}>
                            {ins.fullName || ins.username}{" "}
                            {ins.phone ? `- ${ins.phone}` : ""}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Thời gian hẹn <span className="text-red-500">*</span>
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
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Địa điểm <span className="text-red-500">*</span>
                      </label>
                      <LocationPicker
                        onLocationSelect={handleLocationSelect}
                        initialAddress={scheduleData.meetingLocation}
                      />
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setShowScheduleModal(false)}
                        className="px-6 py-2.5 rounded-xl font-bold bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2.5 rounded-xl font-bold bg-gray-900 text-white hover:bg-orange-500 shadow-md disabled:opacity-70 flex items-center gap-2 transition-colors"
                      >
                        {isSubmitting ? (
                          "Đang lưu..."
                        ) : (
                          <>
                            <MdCheckCircle size={18} /> Lưu lịch hẹn
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTransactionsPage;
