import React, { useState, useEffect } from "react";
import { depositService } from "../../../services/depositService";
import { reservationService } from "../../../services/reservationService"; // Import service
import { toast } from "react-hot-toast";
import {
  MdAccessTime,
  MdAdminPanelSettings,
  MdCheckCircle,
  MdReceiptLong,
  MdLocationOn,
  MdPhone,
  MdWarning,
  MdPayment,
} from "react-icons/md";
import formatCurrency from "../../../utils/formatCurrency";

const TransactionManagementTab = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  // GỌI API LẤY DANH SÁCH ĐẶT CHỖ (RESERVATION) CỦA USER NÀY
  const fetchMyReservations = async () => {
    try {
      setLoading(true);
      const res = await reservationService.getMyReservations();
      if (res && res.result) {
        setReservations(res.result);
      }
    } catch (error) {
      console.error("Lỗi tải danh sách giao dịch:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyReservations();
  }, []);

  const activeTransactions = reservations.filter((t) =>
    ["Waiting_Payment", "Deposited", "Scheduled"].includes(t.status),
  );

  const renderStatusBadge = (status) => {
    switch (status) {
      case "Waiting_Payment":
        return (
          <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-red-200 animate-pulse">
            <MdWarning /> Chờ thanh toán
          </span>
        );
      case "Deposited":
        return (
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-blue-200">
            <MdAdminPanelSettings /> Đang chờ Admin xếp lịch
          </span>
        );
      case "Scheduled":
        return (
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-green-200">
            <MdCheckCircle /> Đã lên lịch hẹn
          </span>
        );
      default:
        return null;
    }
  };

  const handleContinuePayment = async (listingId) => {
    setIsProcessing(true);
    try {
      const res = await depositService.createDepositViaVNPay(listingId);
      if (res.result?.paymentUrl) {
        window.location.href = res.result.paymentUrl;
      } else if (res.result?.deposit) {
        toast.success("Trừ tiền ví thành công! Đã đặt cọc.");
        fetchMyReservations(); // Load lại data nếu trừ ví thành công
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Không thể khởi tạo thanh toán.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-500 font-medium">
        Đang tải danh sách giao dịch...
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-6 border-b border-gray-100 pb-4">
        <h2 className="text-2xl font-bold text-zinc-900">
          Quản lý giao dịch (Dành cho Người mua)
        </h2>
        <p className="text-gray-500 text-sm">
          Các giao dịch đặt cọc mua xe đang chờ thực hiện
        </p>
      </div>

      {activeTransactions.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
          <MdReceiptLong className="mx-auto text-gray-300 mb-3" size={48} />
          <p className="text-gray-500 font-medium">
            Hiện không có giao dịch nào đang xử lý.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {activeTransactions.map((t) => (
            <div
              key={t.reservationId}
              className={`border rounded-2xl bg-white shadow-sm overflow-hidden transition-shadow ${
                t.status === "Waiting_Payment"
                  ? "border-red-200"
                  : "border-gray-200 hover:shadow-md"
              }`}
            >
              {/* Header Card */}
              <div className="p-5 flex justify-between items-start gap-4 bg-slate-50/50">
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-gray-200 flex items-center justify-center shrink-0">
                    <MdReceiptLong
                      size={32}
                      className={
                        t.status === "Waiting_Payment"
                          ? "text-red-400"
                          : "text-orange-400"
                      }
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Mã Đặt chỗ: #{t.reservationId}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs text-gray-500">
                        {new Date(t.reservedAt).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-zinc-900 line-clamp-1">
                      {t.listingTitle || "Xe đạp VeloX"}
                    </h3>
                    <p className="text-orange-600 font-bold text-sm mt-1">
                      Tiền cọc: {formatCurrency(t.depositAmount || 0)}
                    </p>
                  </div>
                </div>
                {renderStatusBadge(t.status)}
              </div>

              {/* Body Content */}
              <div className="px-5 pb-5 pt-3">
                {t.status === "Waiting_Payment" && (
                  <div className="bg-red-50 rounded-xl p-4 border border-red-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <p className="font-bold text-red-900 text-sm mb-1">
                        Chưa hoàn tất thanh toán cọc!
                      </p>
                      <p className="text-sm text-red-800">
                        Bạn đã tạo yêu cầu đặt cọc nhưng giao dịch thanh toán
                        chưa thành công. Vui lòng thanh toán phần còn thiếu để
                        Admin xếp lịch.
                      </p>
                    </div>
                    <button
                      disabled={isProcessing}
                      onClick={() => handleContinuePayment(t.listingId)}
                      className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold shadow-md transition-colors whitespace-nowrap flex items-center gap-2 disabled:opacity-50"
                    >
                      <MdPayment size={18} /> Thanh toán ngay
                    </button>
                  </div>
                )}

                {t.status === "Deposited" && (
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                      <MdAdminPanelSettings size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-blue-900 text-sm mb-1">
                        Đang xử lý hồ sơ...
                      </p>
                      <p className="text-sm text-blue-800">
                        Admin đang liên hệ với người bán để tìm Inspector và địa
                        điểm phù hợp. Vui lòng chờ thông báo.
                      </p>
                    </div>
                  </div>
                )}

                {t.status === "Scheduled" && (
                  <div className="border border-green-200 rounded-xl overflow-hidden relative">
                    <div className="bg-green-50 p-3 border-b border-green-100 flex justify-between items-center">
                      <span className="font-bold text-green-800 text-sm flex items-center gap-2">
                        <MdReceiptLong /> VÉ MỜI GIAO DỊCH
                      </span>
                    </div>
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white">
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">
                          Thời gian gặp mặt
                        </p>
                        <p className="text-zinc-900 font-medium flex items-center gap-2">
                          <MdAccessTime className="text-orange-600" />
                          {t.meetingTime
                            ? new Date(t.meetingTime).toLocaleString("vi-VN", {
                                weekday: "long",
                                day: "numeric",
                                month: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "Chưa chốt"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">
                          Địa điểm giao dịch
                        </p>
                        <p className="text-zinc-900 font-medium flex items-center gap-2">
                          <MdLocationOn className="text-orange-600 shrink-0" />{" "}
                          <span className="truncate">
                            {t.meetingLocation || "Chưa chốt"}
                          </span>
                        </p>
                      </div>
                      <div className="md:col-span-2 bg-gray-50 p-3 rounded-lg flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                          IN
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-bold">
                            Inspector phụ trách
                          </p>
                          <p className="text-sm font-bold text-zinc-900">
                            {t.inspectorName || "Đang cập nhật"}
                          </p>
                        </div>
                        {t.inspectorPhone && (
                          <a
                            href={`tel:${t.inspectorPhone}`}
                            className="text-blue-600 hover:text-blue-800 p-2 bg-blue-50 rounded-full border border-blue-100 shadow-sm"
                            title="Gọi Inspector"
                          >
                            <MdPhone size={18} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionManagementTab;
