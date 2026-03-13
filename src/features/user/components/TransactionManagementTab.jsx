import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth"; // Import useAuth
import { depositService } from "../../../services/depositService";
import { reservationService } from "../../../services/reservationService";
import { transactionService } from "../../../services/transactionService";
import Modal from "../../../components/common/Modal";
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
  MdPerson,
  MdImage,
  MdCancel,
} from "react-icons/md";
import formatCurrency from "../../../utils/formatCurrency";

// Component ảnh với fallback khi lỗi
const BikeImage = ({ src, alt, className }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [error, setError] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setError(false);
  }, [src]);

  const handleError = () => {
    setError(true);
  };

  if (error || !imgSrc) {
    return (
      <div
        className={`${className} bg-gray-100 flex items-center justify-center text-gray-400`}
      >
        <MdImage size={24} />
      </div>
    );
  }

  return (
    <img src={imgSrc} alt={alt} className={className} onError={handleError} />
  );
};

const TransactionManagementTab = () => {
  const { user } = useAuth(); // Lấy user hiện tại
  const [isProcessing, setIsProcessing] = useState(false);
  const [mergedTransactions, setMergedTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelTarget, setCancelTarget] = useState(null); // reservationId đang muốn hủy

  const userId = user?.userId || user?.id; // Lấy userId từ user object

  // Helper lấy ảnh từ nhiều nguồn
  const extractImageUrl = (item) => {
    if (item.listingImage) return item.listingImage;
    if (item.listing?.image_url) {
      const url = item.listing.image_url;
      if (typeof url === "string" && url.includes(",")) {
        return url.split(",")[0].trim();
      }
      return url;
    }
    if (item.image_url) {
      if (typeof item.image_url === "string" && item.image_url.includes(",")) {
        return item.image_url.split(",")[0].trim();
      }
      return item.image_url;
    }
    return null;
  };

  // Xác định vai trò của user hiện tại trong transaction
  const determineUserRole = (transaction) => {
    const buyerId = transaction.buyerId || transaction.buyer?.userId;
    const sellerId = transaction.sellerId || transaction.seller?.userId;

    if (buyerId === userId) return "buyer";
    if (sellerId === userId) return "seller";
    return null; // Không liên quan
  };

  // Hàm chuyển đổi transaction (bên bán) sang format hiển thị
  const mapTransactionToDisplay = (tx) => {
    const listing = tx.listing || {};
    const deposit = tx.deposit || {};
    const reservation = tx.reservation || {};
    const buyer = tx.buyer || {};
    const seller = tx.seller || {};

    return {
      id: tx.transactionId,
      reservationId: tx.transactionId,
      listingId: listing.listingId || tx.listingId,
      listingTitle: listing.title || tx.listingTitle || "Xe đạp VeloX",
      listingImage: extractImageUrl(tx),
      depositAmount: deposit.amount || tx.amount || 0,
      status: tx.status,
      reservedAt: tx.createAt || tx.createdAt,
      meetingTime: reservation.meetingTime,
      meetingLocation: reservation.meetingLocation,
      inspectorName:
        reservation.inspector?.fullName || tx.inspectorName || "Đang cập nhật",
      inspectorPhone: reservation.inspector?.phone || tx.inspectorPhone,
      buyerName: buyer.fullName || tx.buyerName,
      sellerName: seller.fullName || tx.sellerName,
      // Các ID để xác định vai trò
      buyerId: buyer.userId || tx.buyerId,
      sellerId: seller.userId || tx.sellerId,
    };
  };

  const fetchAllTransactions = async () => {
    setLoading(true);
    try {
      const [reservationsRes, transactionsRes] = await Promise.allSettled([
        reservationService.getMyReservations(),
        transactionService.getMyTransactions(),
      ]);

      console.log("Reservations response:", reservationsRes);
      console.log("Transactions response:", transactionsRes);

      let allItems = [];

      // Xử lý reservations (bên mua) - chỉ lấy các reservation mà user là buyer
      if (
        reservationsRes.status === "fulfilled" &&
        reservationsRes.value?.result
      ) {
        const buyerItems = reservationsRes.value.result
          .map((r) => ({
            ...r,
            listingImage: extractImageUrl(r),
            // Không gán userRole ở đây, sẽ xác định sau
          }))
          .filter((r) => determineUserRole(r) === "buyer"); // Chỉ giữ reservation mà user là buyer
        allItems.push(...buyerItems);
      } else {
        console.warn("Không thể tải reservations:", reservationsRes.reason);
      }

      // Xử lý transactions (bên bán) - chỉ lấy các transaction mà user là seller
      if (
        transactionsRes.status === "fulfilled" &&
        transactionsRes.value?.result
      ) {
        const sellerItems = transactionsRes.value.result
          .map(mapTransactionToDisplay)
          .filter((t) => determineUserRole(t) === "seller"); // Chỉ giữ transaction mà user là seller
        allItems.push(...sellerItems);
      } else {
        console.warn("Không thể tải transactions:", transactionsRes.reason);
      }

      // Loại bỏ trùng lặp dựa trên ID
      const uniqueMap = new Map();
      allItems.forEach((item) => {
        const key = item.reservationId || item.id;
        if (key) uniqueMap.set(key, item);
      });

      // Xác định lại userRole cho từng item (đề phòng)
      const merged = Array.from(uniqueMap.values())
        .map((item) => ({
          ...item,
          userRole: determineUserRole(item), // Gán lại role
        }))
        .sort((a, b) => {
          const dateA = a.reservedAt || a.createAt || a.createdAt;
          const dateB = b.reservedAt || b.createAt || b.createdAt;
          return new Date(dateB) - new Date(dateA);
        });

      setMergedTransactions(merged);
    } catch (error) {
      console.error("Lỗi tải danh sách giao dịch:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchAllTransactions();
  }, [userId]);

  const renderStatusBadge = (status) => {
    const statusMap = {
      Waiting_Payment: {
        label: "Chờ thanh toán",
        icon: MdWarning,
        color: "red",
      },
      Deposited: {
        label: "Đang chờ Admin xếp lịch",
        icon: MdAdminPanelSettings,
        color: "blue",
      },
      Scheduled: {
        label: "Đã lên lịch hẹn",
        icon: MdCheckCircle,
        color: "green",
      },
      Pending: {
        label: "Chờ xử lý",
        icon: MdAdminPanelSettings,
        color: "blue",
      },
      Paid: { label: "Đã thanh toán cọc", icon: MdCheckCircle, color: "green" },
      Completed: { label: "Hoàn tất", icon: MdCheckCircle, color: "green" },
      Cancelled: { label: "Đã hủy", icon: MdWarning, color: "gray" },
    };
    const config = statusMap[status] || {
      label: status,
      icon: MdWarning,
      color: "gray",
    };
    const Icon = config.icon;
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border ${
          config.color === "red"
            ? "bg-red-100 text-red-800 border-red-200"
            : config.color === "blue"
              ? "bg-blue-100 text-blue-800 border-blue-200"
              : config.color === "green"
                ? "bg-green-100 text-green-800 border-green-200"
                : "bg-gray-100 text-gray-800 border-gray-200"
        }`}
      >
        <Icon size={14} />
        {config.label}
      </span>
    );
  };

  const activeTransactions = mergedTransactions.filter((t) =>
    ["Waiting_Payment", "Deposited", "Scheduled", "Pending", "Paid"].includes(
      t.status,
    ),
  );

  const handleContinuePayment = async (listingId) => {
    setIsProcessing(true);
    try {
      const res = await depositService.createDepositViaVNPay(listingId);
      if (res.result?.paymentUrl) {
        window.location.href = res.result.paymentUrl;
      } else if (res.result?.deposit) {
        toast.success("Trừ tiền ví thành công! Đã đặt cọc.");
        fetchAllTransactions();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Không thể khởi tạo thanh toán.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelReservation = async (reservationId) => {
    setCancelTarget(reservationId);
  };

  const confirmCancelReservation = async () => {
    if (!cancelTarget) return;
    setIsProcessing(true);
    try {
      await reservationService.cancelReservation(cancelTarget);
      toast.success("Đã hủy đặt cọc thành công!");
      fetchAllTransactions();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Không thể hủy đặt cọc.",
      );
    } finally {
      setIsProcessing(false);
      setCancelTarget(null);
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
        <h2 className="text-2xl font-bold text-zinc-900">Quản lý giao dịch</h2>
        <p className="text-gray-500 text-sm">
          Các giao dịch bạn đang tham gia với tư cách người mua hoặc người bán
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
        <div className="space-y-4">
          {activeTransactions.map((t) => (
            <div
              key={t.reservationId || t.id}
              className={`border rounded-2xl bg-white shadow-sm overflow-hidden transition-all hover:shadow-md ${
                t.status === "Waiting_Payment"
                  ? "border-red-200"
                  : "border-gray-200"
              }`}
            >
              {/* Layout ngang: Ảnh + Thông tin chính + Badge + Hành động */}
              <div className="flex flex-col sm:flex-row">
                <Link
                  to={`/bikes/${t.listingId}`}
                  className="sm:w-32 sm:h-32 h-40 w-full sm:shrink-0 bg-gray-100 flex items-center justify-center overflow-hidden"
                >
                  <BikeImage
                    src={t.listingImage}
                    alt={t.listingTitle}
                    className="w-full h-full object-cover"
                  />
                </Link>

                <div className="flex-1 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-2 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link
                        to={`/bikes/${t.listingId}`}
                        className="font-bold text-lg text-zinc-900 hover:text-orange-600 transition-colors line-clamp-1"
                      >
                        {t.listingTitle}
                      </Link>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                        {t.userRole === "seller" ? "Người bán" : "Người mua"}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                      <span className="text-orange-600 font-bold">
                        Cọc: {formatCurrency(t.depositAmount || 0)}
                      </span>
                      {/* Chỉ hiển thị thông tin người mua nếu user là seller */}
                      {t.userRole === "seller" && t.buyerName && (
                        <span className="text-gray-600 flex items-center gap-1">
                          <MdPerson size={16} className="text-gray-400" />
                          Người mua: {t.buyerName}
                        </span>
                      )}
                      {/* Chỉ hiển thị thông tin người bán nếu user là buyer */}
                      {t.userRole === "buyer" && t.sellerName && (
                        <span className="text-gray-600 flex items-center gap-1">
                          <MdPerson size={16} className="text-gray-400" />
                          Người bán: {t.sellerName}
                        </span>
                      )}
                      {/* Mã đặt chỗ cho buyer */}
                      {t.userRole === "buyer" && (
                        <span className="text-gray-600 flex items-center gap-1">
                          <MdReceiptLong size={16} className="text-gray-400" />
                          Mã đặt chỗ: #{t.reservationId}
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-gray-400">
                      {new Date(
                        t.reservedAt || t.createAt || t.createdAt,
                      ).toLocaleString("vi-VN")}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {renderStatusBadge(t.status)}

                    {t.status === "Waiting_Payment" &&
                      t.userRole === "buyer" && (
                        <button
                          disabled={isProcessing}
                          onClick={() => handleContinuePayment(t.listingId)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                          <MdPayment size={16} /> Thanh toán
                        </button>
                      )}

                    {t.userRole === "buyer" &&
                      ["Waiting_Payment", "Deposited", "Pending", "Paid"].includes(t.status) && (
                        <button
                          disabled={isProcessing}
                          onClick={() => handleCancelReservation(t.reservationId)}
                          className="px-4 py-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 hover:border-red-400 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                          <MdCancel size={16} /> Hủy đặt cọc
                        </button>
                      )}
                  </div>
                </div>
              </div>

              {/* Phần mở rộng khi có lịch hẹn */}
              {(t.status === "Scheduled" || t.meetingTime) && (
                <div className="border-t border-gray-100 bg-gray-50 p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <MdAccessTime
                      className="text-orange-600 shrink-0"
                      size={18}
                    />
                    <span className="text-gray-700">
                      {t.meetingTime
                        ? new Date(t.meetingTime).toLocaleString("vi-VN", {
                            weekday: "long",
                            day: "numeric",
                            month: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Chưa chốt thời gian"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MdLocationOn
                      className="text-orange-600 shrink-0"
                      size={18}
                    />
                    <span className="text-gray-700 truncate">
                      {t.meetingLocation || "Chưa chốt địa điểm"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0">
                      IN
                    </div>
                    <span className="text-gray-700 truncate">
                      {t.inspectorName || "Chưa phân công Inspector"}
                    </span>
                    {t.inspectorPhone && (
                      <a
                        href={`tel:${t.inspectorPhone}`}
                        className="text-blue-600 hover:text-blue-800 ml-1"
                        title="Gọi Inspector"
                      >
                        <MdPhone size={16} />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Thông báo phụ cho các trạng thái khác */}
              {t.status === "Deposited" && (
                <div className="border-t border-gray-100 bg-blue-50 p-3 text-sm text-blue-800 flex items-center gap-2">
                  <MdAdminPanelSettings size={18} />
                  <span>Đang chờ Admin xếp lịch hẹn...</span>
                </div>
              )}
              {t.status === "Paid" && t.userRole === "seller" && (
                <div className="border-t border-gray-100 bg-green-50 p-3 text-sm text-green-800 flex items-center gap-2">
                  <MdCheckCircle size={18} />
                  <span>
                    Người mua đã đặt cọc thành công. Admin sẽ sớm liên hệ.
                  </span>
                </div>
              )}
              {t.status === "Pending" && t.userRole === "seller" && (
                <div className="border-t border-gray-100 bg-blue-50 p-3 text-sm text-blue-800 flex items-center gap-2">
                  <MdAdminPanelSettings size={18} />
                  <span>
                    Người mua đã tạo yêu cầu đặt cọc. Chờ Admin xử lý.
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal xác nhận hủy đặt cọc */}
      <Modal
        isOpen={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        title="Xác nhận hủy đặt cọc"
        footer={
          <>
            <button
              onClick={() => setCancelTarget(null)}
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-colors"
            >
              Quay lại
            </button>
            <button
              onClick={confirmCancelReservation}
              disabled={isProcessing}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <MdCancel size={18} />
              {isProcessing ? "Đang hủy..." : "Xác nhận hủy"}
            </button>
          </>
        }
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <MdWarning className="text-red-600" size={36} />
          </div>
          <h4 className="text-lg font-bold text-zinc-900">
            Bạn sẽ mất toàn bộ tiền cọc!
          </h4>
          <p className="text-gray-600 text-sm leading-relaxed">
            Khi hủy đặt cọc, số tiền cọc bạn đã thanh toán sẽ{" "}
            <strong className="text-red-600">không được hoàn lại</strong>.
            Hành động này không thể hoàn tác.
          </p>
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
            ⚠️ Vui lòng cân nhắc kỹ trước khi xác nhận hủy.
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TransactionManagementTab;
