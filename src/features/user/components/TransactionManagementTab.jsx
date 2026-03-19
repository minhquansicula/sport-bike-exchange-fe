import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
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
import InspectionReportPanel from "./InspectionReportPanel";

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
        className={`${className} bg-gray-50 flex items-center justify-center text-gray-300`}
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
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [mergedTransactions, setMergedTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [sellerCancelTarget, setSellerCancelTarget] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

  const userId = user?.userId || user?.id;

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

  const determineUserRole = (transaction) => {
    const buyerId = transaction.buyerId || transaction.buyer?.userId;
    const sellerId = transaction.sellerId || transaction.seller?.userId;

    if (buyerId === userId) return "buyer";
    if (sellerId === userId) return "seller";
    return null;
  };

  const mapTransactionToDisplay = (tx) => {
    const listing = tx.listing || {};
    const deposit = tx.deposit || {};
    const reservation = tx.reservation || {};
    const buyer = tx.buyer || {};
    const seller = tx.seller || {};

    return {
      id: tx.transactionId,
      reservationId:
        reservation.reservationId ||
        tx.reservation?.reservationId ||
        tx.reservationId ||
        tx.transactionId,
      listingId: listing.listingId || tx.listingId,
      listingTitle: listing.title || tx.listingTitle || "Xe đạp VeloX",
      listingImage: extractImageUrl(tx),
      depositAmount: deposit.amount || tx.amount || 0,
      status: reservation.status || tx.status,
      reservedAt: tx.createAt || tx.createdAt,
      meetingTime: reservation.meetingTime,
      meetingLocation: reservation.meetingLocation,
      inspectorName:
        reservation.inspector?.fullName || tx.inspectorName || "Đang cập nhật",
      inspectorPhone: reservation.inspector?.phone || tx.inspectorPhone,
      buyerName: buyer.fullName || tx.buyerName,
      sellerName: seller.fullName || tx.sellerName,
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

      let allItems = [];

      if (
        reservationsRes.status === "fulfilled" &&
        reservationsRes.value?.result
      ) {
        const buyerItems = reservationsRes.value.result
          .map((r) => ({
            ...r,
            listingImage: extractImageUrl(r),
          }))
          .filter((r) => determineUserRole(r) === "buyer");
        allItems.push(...buyerItems);
      }

      if (
        transactionsRes.status === "fulfilled" &&
        transactionsRes.value?.result
      ) {
        const sellerItems = transactionsRes.value.result
          .map(mapTransactionToDisplay)
          .filter((t) => determineUserRole(t) === "seller");
        allItems.push(...sellerItems);
      }

      const uniqueMap = new Map();
      allItems.forEach((item) => {
        const key = item.reservationId || item.id;
        if (key) uniqueMap.set(key, item);
      });

      const merged = Array.from(uniqueMap.values())
        .map((item) => ({
          ...item,
          userRole: determineUserRole(item),
        }))
        .sort((a, b) => {
          const dateA = a.reservedAt || a.createAt || a.createdAt;
          const dateB = b.reservedAt || b.createAt || b.createdAt;
          return new Date(dateB) - new Date(dateA);
        });

      console.log("[DEBUG] All merged transactions:", merged.map(t => ({ id: t.reservationId, status: t.status, role: determineUserRole(t) })));
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
        label: "Kiểm định PASSED — Chờ thanh toán",
        icon: MdCheckCircle,
        color: "emerald",
      },
      Inspection_Failed: {
        label: "Kiểm định thất bại",
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
      Pending_Cancel: {
        label: "Đang yêu cầu hủy",
        icon: MdWarning,
        color: "red",
      },
    };
    const config = statusMap[status] || {
      label: status,
      icon: MdWarning,
      color: "gray",
    };
    const Icon = config.icon;
    return (
      <span
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
          config.color === "red"
            ? "bg-red-50 text-red-600"
            : config.color === "blue"
              ? "bg-blue-50 text-blue-600"
              : config.color === "emerald"
                ? "bg-emerald-50 text-emerald-700"
                : config.color === "green"
                  ? "bg-green-50 text-green-600"
                  : "bg-gray-50 text-gray-600"
        }`}
      >
        <Icon size={14} />
        {config.label}
      </span>
    );
  };

  const activeTransactions = mergedTransactions.filter((t) =>
    ["Waiting_Payment", "Inspection_Failed", "Deposited", "Scheduled", "Pending", "Paid", "Pending_Cancel"].includes(
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

  const handleCancelReservation = async (transaction) => {
    setCancelTarget(transaction);
  };

  const confirmCancelReservation = async () => {
    if (!cancelTarget) return;
    setIsProcessing(true);
    try {
      await reservationService.cancelReservation(cancelTarget.reservationId);
      toast.success("Đã hủy giao dịch thành công!");
      fetchAllTransactions();
    } catch (error) {
      toast.error(error.response?.data?.message || "Không thể hủy giao dịch.");
    } finally {
      setIsProcessing(false);
      setCancelTarget(null);
    }
  };

  const confirmSellerCancelReservation = async () => {
    if (!sellerCancelTarget || !cancelReason.trim()) return;
    setIsProcessing(true);
    try {
      await reservationService.requestCancelReservationBySeller(
        sellerCancelTarget,
        { cancelDescription: cancelReason },
      );
      toast.success("Đã gửi yêu cầu hủy giao dịch thành công!");
      fetchAllTransactions();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Không thể gửi yêu cầu hủy giao dịch.",
      );
    } finally {
      setIsProcessing(false);
      setSellerCancelTarget(null);
      setCancelReason("");
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
        <h2 className="text-2xl font-semibold text-gray-900">
          Quản lý giao dịch
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Các giao dịch bạn đang tham gia với tư cách người mua hoặc người bán
        </p>
      </div>

      {activeTransactions.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
          <MdReceiptLong className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500 font-medium">
            Hiện không có giao dịch nào đang xử lý.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeTransactions.map((t) => (
            <div
              key={t.reservationId || t.id}
              className="border border-gray-100 rounded-2xl bg-white shadow-sm overflow-hidden transition-all hover:shadow-md hover:border-gray-200"
            >
              <div className="flex flex-col sm:flex-row">
                <Link
                  to={`/bikes/${t.listingId}`}
                  className="sm:w-36 sm:h-36 h-48 w-full sm:shrink-0 bg-gray-50 flex items-center justify-center overflow-hidden"
                >
                  <BikeImage
                    src={t.listingImage}
                    alt={t.listingTitle}
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                  />
                </Link>

                <div className="flex-1 p-5 flex flex-col justify-between gap-4">
                  <div className="space-y-3 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <Link
                          to={`/bikes/${t.listingId}`}
                          className="font-semibold text-lg text-gray-900 hover:text-blue-600 transition-colors line-clamp-1"
                        >
                          {t.listingTitle}
                        </Link>
                        <div className="text-xs text-gray-400">
                          {new Date(
                            t.reservedAt || t.createAt || t.createdAt,
                          ).toLocaleString("vi-VN")}
                        </div>
                      </div>
                      <span className="text-xs bg-gray-50 border border-gray-100 text-gray-600 px-2.5 py-1 rounded-md font-medium shrink-0">
                        {t.userRole === "seller" ? "Người bán" : "Người mua"}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                      <span className="text-gray-900 font-medium">
                        Cọc: {formatCurrency(t.depositAmount || 0)}
                      </span>
                      {t.userRole === "seller" && t.buyerName && (
                        <span className="text-gray-500 flex items-center gap-1.5">
                          <MdPerson size={16} className="text-gray-400" />
                          {t.buyerName}
                        </span>
                      )}
                      {t.userRole === "buyer" && t.sellerName && (
                        <span className="text-gray-500 flex items-center gap-1.5">
                          <MdPerson size={16} className="text-gray-400" />
                          {t.sellerName}
                        </span>
                      )}
                      {t.userRole === "buyer" && (
                        <span className="text-gray-500 flex items-center gap-1.5">
                          <MdReceiptLong size={16} className="text-gray-400" />#
                          {t.reservationId}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-50">
                    {renderStatusBadge(t.status)}

                    <div className="flex items-center gap-2">
                      {/* Nút hủy cho buyer (chỉ hiện ở trạng thái chưa inspection) */}
                      {t.userRole === "buyer" &&
                        ["Deposited", "Pending", "Paid"].includes(t.status) && (
                          <button
                            disabled={isProcessing}
                            onClick={() => handleCancelReservation(t)}
                            className="px-4 py-2 bg-transparent hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                          >
                            Hủy đặt cọc
                          </button>
                        )}

                      {/* Nút yêu cầu hủy cho seller (chỉ hiện ở trạng thái chưa inspection) */}
                      {t.userRole === "seller" &&
                        ["Deposited", "Pending", "Paid", "Scheduled"].includes(t.status) && (
                          <button
                            disabled={isProcessing}
                            onClick={() => setSellerCancelTarget(t.reservationId)}
                            className="px-4 py-2 bg-transparent hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                          >
                            Yêu cầu hủy
                          </button>
                        )}

                      {/* PASSED: Buyer thanh toán full */}
                      {t.status === "Waiting_Payment" && t.userRole === "buyer" && (
                        <button
                          disabled={isProcessing}
                          onClick={() => handleContinuePayment(t.listingId)}
                          className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold transition-colors flex items-center gap-2 disabled:opacity-50 shadow-sm shadow-emerald-200"
                        >
                          <MdPayment size={16} /> Thanh toán ngay
                        </button>
                      )}

                      {/* FAILED: Buyer hoặc Seller hủy + hoàn tiền */}
                      {t.status === "Inspection_Failed" && (
                        <button
                          disabled={isProcessing}
                          onClick={() => handleCancelReservation(t)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-colors flex items-center gap-2 disabled:opacity-50 shadow-sm"
                        >
                          <MdCancel size={16} /> Hủy & Hoàn tiền
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {(t.status === "Scheduled" || t.meetingTime) && (
                <div className="border-t border-gray-100 bg-gray-50/50 p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2.5 text-sm">
                    <MdAccessTime className="text-gray-400 shrink-0" size={18} />
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
                  <div className="flex items-center gap-2.5 text-sm">
                    <MdLocationOn className="text-gray-400 shrink-0" size={18} />
                    {t.meetingLocation ? (
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(t.meetingLocation)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline truncate"
                        title="Xem trên Google Maps"
                      >
                        {t.meetingLocation}
                      </a>
                    ) : (
                      <span className="text-gray-700 truncate">Chưa chốt địa điểm</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2.5 text-sm">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-xs shrink-0">
                      IN
                    </div>
                    <span className="text-gray-700 truncate">
                      {t.inspectorName || "Chưa phân công"}
                    </span>
                    {t.inspectorPhone && (
                      <a
                        href={`tel:${t.inspectorPhone}`}
                        className="text-blue-600 hover:text-blue-800 ml-auto"
                        title="Gọi Inspector"
                      >
                        <MdPhone size={16} />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Panel báo cáo kiểm định — hiện cho Waiting_Payment và Inspection_Failed */}
              {["Waiting_Payment", "Inspection_Failed"].includes(t.status) && (
                <InspectionReportPanel reservationId={t.reservationId} />
              )}

              {/* Banners trạng thái */}
              {t.status === "Waiting_Payment" && (
                <div className="border-t border-emerald-100 bg-emerald-50/60 p-3 text-sm text-emerald-800 flex items-center gap-2.5">
                  <MdCheckCircle size={18} className="text-emerald-500 shrink-0" />
                  {t.userRole === "buyer" ? (
                    <span>Xe đã <strong>đạt kiểm định</strong>. Vui lòng thanh toán để hoàn tất giao dịch.</span>
                  ) : (
                    <span>Xe đã <strong>đạt kiểm định</strong>. Đang chờ người mua thanh toán.</span>
                  )}
                </div>
              )}
              {t.status === "Inspection_Failed" && (
                <div className="border-t border-red-100 bg-red-50/60 p-3 text-sm text-red-800 flex items-center gap-2.5">
                  <MdWarning size={18} className="text-red-500 shrink-0" />
                  <span>Xe <strong>không đạt kiểm định</strong>. Giao dịch sẽ được hủy và tiền cọc được hoàn trả.</span>
                </div>
              )}
              {t.status === "Deposited" && (
                <div className="border-t border-gray-50 bg-blue-50/50 p-3 text-sm text-blue-700 flex items-center gap-2.5">
                  <MdAdminPanelSettings size={18} className="text-blue-500" />
                  <span>Đang chờ Admin xếp lịch hẹn...</span>
                </div>
              )}
              {t.status === "Paid" && t.userRole === "seller" && (
                <div className="border-t border-gray-50 bg-green-50/50 p-3 text-sm text-green-700 flex items-center gap-2.5">
                  <MdCheckCircle size={18} className="text-green-500" />
                  <span>Người mua đã đặt cọc thành công. Admin sẽ sớm liên hệ.</span>
                </div>
              )}
              {t.status === "Pending" && t.userRole === "seller" && (
                <div className="border-t border-gray-50 bg-blue-50/50 p-3 text-sm text-blue-700 flex items-center gap-2.5">
                  <MdAdminPanelSettings size={18} className="text-blue-500" />
                  <span>Người mua đã tạo yêu cầu đặt cọc. Chờ Admin xử lý.</span>
                </div>
              )}
              {t.status === "Pending_Cancel" && (
                <div className="border-t border-red-50 bg-red-50/50 p-3 text-sm text-red-700 flex items-center gap-2.5">
                  <MdWarning size={18} className="text-red-500" />
                  <span>Giao dịch đang chờ Admin duyệt yêu cầu hủy.</span>
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
        title=""
        footer={
          <div className="flex w-full gap-3 mt-2">
            <button
              onClick={() => setCancelTarget(null)}
              className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
            >
              Quay lại
            </button>
            <button
              onClick={confirmCancelReservation}
              disabled={isProcessing}
              className={`flex-1 px-4 py-2.5 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 ${
                cancelTarget?.status === "Inspection_Failed"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {isProcessing ? "Đang xử lý..." : "Xác nhận hủy"}
            </button>
          </div>
        }
      >
        <div className="flex flex-col items-center text-center pb-4 pt-2">
          {cancelTarget?.status === "Inspection_Failed" ? (
            <>
              <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mb-5">
                <MdCheckCircle className="text-emerald-500" size={28} />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Hủy & Hoàn tiền cọc
              </h4>
              <p className="text-gray-500 text-sm leading-relaxed px-4">
                Vì xe <strong>không đạt kiểm định</strong>, giao dịch sẽ được đóng và hệ thống sẽ{" "}
                <span className="text-emerald-600 font-bold">hoàn trả 100% tiền cọc</span> vào ví của bạn (đối với người mua).
              </p>
            </>
          ) : (
            <>
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mb-5">
                <MdWarning className="text-red-500" size={28} />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Bạn chắc chắn muốn hủy?
              </h4>
              <p className="text-gray-500 text-sm leading-relaxed px-4">
                Tiền cọc của bạn sẽ{" "}
                <span className="text-red-500 font-medium">không được hoàn lại</span> nếu bạn tự ý hủy giao dịch ở giai đoạn này.
              </p>
            </>
          )}
        </div>
      </Modal>

      {/* Modal yêu cầu hủy giao dịch (Seller) */}
      <Modal
        isOpen={!!sellerCancelTarget}
        onClose={() => {
          setSellerCancelTarget(null);
          setCancelReason("");
        }}
        title="Yêu cầu hủy giao dịch"
        footer={
          <>
            <button
              onClick={() => {
                setSellerCancelTarget(null);
                setCancelReason("");
              }}
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-colors"
            >
              Đóng
            </button>
            <button
              onClick={confirmSellerCancelReservation}
              disabled={isProcessing || !cancelReason.trim()}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MdCancel size={18} />
              {isProcessing ? "Đang gửi..." : "Gửi yêu cầu hủy"}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <MdWarning className="text-red-600" size={36} />
          </div>
          <h4 className="text-lg font-bold text-center text-zinc-900">
            Bạn muốn yêu cầu hủy giao dịch này?
          </h4>
          <p className="text-gray-600 text-sm text-center">
            Yêu cầu hủy sẽ được gửi đến quản trị viên để xem xét và phê duyệt.
            Vui lòng nhập lý do cụ thể để quản trị viên xử lý.
          </p>
          <div className="mt-4 text-left">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lý do hủy giao dịch <span className="text-red-500">*</span>
            </label>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Nhập lý do chi tiết (ví dụ: Xe bị hỏng, thay đổi ý định...)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 min-h-[100px] resize-none"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TransactionManagementTab;
