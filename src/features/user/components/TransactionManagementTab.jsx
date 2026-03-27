import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { depositService } from "../../../services/depositService";
import { reservationService } from "../../../services/reservationService";
import { transactionService } from "../../../services/transactionService";
import { bikeService } from "../../../services/bikeService";
import { eventBicycleService } from "../../../services/eventBicycleService";
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
  MdEventAvailable,
  MdStorefront,
  MdInfoOutline,
  MdClose,
  MdPedalBike,
  MdVerified,
  MdCalendarToday,
  MdAssignmentInd,
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

  // State quản lý tab
  const [transactionType, setTransactionType] = useState("regular"); // "regular" | "event"

  // State quản lý Popup Xem chi tiết xe
  const [viewDetailTarget, setViewDetailTarget] = useState(null);
  const [detailedBikeInfo, setDetailedBikeInfo] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const userId = user?.userId || user?.id;

  const extractImageUrl = (item) => {
    if (item.listingImage) return item.listingImage;
    if (item.eventBicycleImage) return item.eventBicycleImage;

    const url =
      item.listing?.image_url || item.eventBicycle?.image_url || item.image_url;
    if (typeof url === "string" && url.includes(",")) {
      return url.split(",")[0].trim();
    }
    return url || null;
  };

  const mapTransactionToDisplay = (tx) => {
    const listing = tx.listing || {};
    const eventBike = tx.eventBicycle || {};
    const deposit = tx.deposit || {};
    const reservation = tx.reservation || {};
    const buyer = tx.buyer || {};
    const seller = tx.seller || listing.seller || eventBike.seller || {};
    const bicycle = listing.bicycle || eventBike.bicycle || {};

    const isEventBike = !!(eventBike.eventBikeId || tx.eventBicycleId);

    return {
      id: tx.transactionId,
      reservationId:
        reservation.reservationId ||
        tx.reservation?.reservationId ||
        tx.reservationId ||
        tx.transactionId,
      listingId: listing.listingId || tx.listingId,
      eventBikeId: eventBike.eventBikeId || tx.eventBicycleId,
      isEventBike: isEventBike,
      listingTitle:
        eventBike.title ||
        tx.eventBicycleTitle ||
        listing.title ||
        tx.listingTitle ||
        "Xe đạp VeloX",
      listingImage: extractImageUrl(tx),
      bikePrice:
        tx.actualPrice ||
        (tx.depositAmount || 0) + (tx.remainingAmount || 0) ||
        tx.amount ||
        listing.price ||
        eventBike.price ||
        0,
      brandName: bicycle.brand?.name || bicycle.brandName || "N/A",
      categoryName:
        bicycle.category?.name ||
        bicycle.categoryName ||
        eventBike.bikeType ||
        "N/A",
      condition: listing.condition || eventBike.condition || "N/A",
      yearManufacture: bicycle.yearManufacture || "N/A",
      description:
        listing.description ||
        eventBike.description ||
        bicycle.description ||
        "Người bán chưa cung cấp mô tả chi tiết.",
      depositAmount: tx.depositAmount || deposit.amount || tx.amount || 0,
      status: reservation.status || tx.status,
      reservedAt: tx.reservedAt || tx.createAt || tx.createdAt,
      meetingTime:
        reservation.meetingTime || tx.meetingTime || tx.meeting_location,
      meetingLocation:
        reservation.meetingLocation ||
        tx.meetingLocation ||
        tx.meeting_location,
      inspectorName:
        reservation.inspector?.fullName ||
        tx.inspectorName ||
        reservation.inspectorName ||
        "Đang cập nhật",
      inspectorPhone:
        reservation.inspector?.phone ||
        tx.inspectorPhone ||
        reservation.inspectorPhone,
      buyerName: buyer.fullName || tx.buyerName,
      sellerName: seller.fullName || tx.sellerName || eventBike.sellerName,
      buyerId: buyer.userId || tx.buyerId,
      sellerId: seller.userId || tx.sellerId,
      eventId: eventBike.event?.eventId || tx.eventId,
      cancelDescription:
        reservation.cancelDescription ||
        tx.cancelDescription ||
        reservation.cancelReason ||
        tx.cancelReason ||
        "",
      noShowType:
        tx.noShowType ||
        reservation.noShowType ||
        tx.inspectionResult ||
        reservation.inspectionResult ||
        "",
    };
  };

  const fetchAllTransactions = async () => {
    setLoading(true);
    try {
      const [regularRes, transactionsRes] = await Promise.allSettled([
        reservationService.getMyReservations(),
        transactionService.getMyTransactions(),
      ]);

      const buyerMap = new Map();
      const otherMap = new Map();
      if (regularRes.status === "fulfilled" && regularRes.value?.result) {
        regularRes.value.result
          .map(mapTransactionToDisplay)
          .forEach((item) => {
            const key = item.reservationId || item.id;
            if (key) {
              if (item.buyerId === userId) {
                buyerMap.set(key, item);
              } else {
                otherMap.set(key, item);
              }
            }
          });
      }

      if (
        transactionsRes.status === "fulfilled" &&
        transactionsRes.value?.result
      ) {
        transactionsRes.value.result
          .map(mapTransactionToDisplay)
          .filter(
            (t) =>
              (t.sellerId === userId || t.buyerId === userId) &&
              !buyerMap.has(t.reservationId || t.id),
          )
          .forEach((item) => {
            const key = item.reservationId || item.id;
            if (key) otherMap.set(key, item);
          });
      }

      const uniqueMap = new Map([...buyerMap, ...otherMap]);

      const statusPriority = {
        Waiting_Payment: 1,
        Scheduled: 2,
        Deposited: 3,
        Pending: 4,
        Paid: 5,
        Inspection_Failed: 6,
        Pending_Cancel: 7,
        Completed: 8,
        Cancelled: 9,
        Refunded: 10,
        Compensated: 11,
      };

      const merged = Array.from(uniqueMap.values())
        .map((item) => ({
          ...item,
          userRole: item.buyerId === userId ? "buyer" : "seller",
        }))
        .sort((a, b) => {
          const priorityA = statusPriority[a.status] || 99;
          const priorityB = statusPriority[b.status] || 99;

          if (priorityA !== priorityB) {
            return priorityA - priorityB;
          }
          return new Date(b.reservedAt) - new Date(a.reservedAt);
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

  const handleOpenDetailModal = async (t) => {
    setViewDetailTarget(t);
    setDetailedBikeInfo(null);
    setLoadingDetail(true);

    try {
      if (t.isEventBike && t.eventBikeId) {
        const res = await eventBicycleService.getEventBicycleById(
          t.eventBikeId,
        );
        if (res && res.result) setDetailedBikeInfo(res.result);
      } else if (t.listingId) {
        const res = await bikeService.getBikeListingById(t.listingId);
        if (res && res.result) setDetailedBikeInfo(res.result);
      }
    } catch (error) {
      console.error("Không thể lấy dữ liệu chi tiết xe:", error);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleFinalPayment = async (t) => {
    setIsProcessing(true);
    try {
      const res = t.isEventBike
        ? await reservationService.finalPaymentEventBicycle(t.reservationId)
        : await reservationService.finalPayment(t.reservationId);
      if (res.result?.paymentUrl) {
        window.location.href = res.result.paymentUrl;
      } else {
        toast.success(
          res.result?.message ||
          "Thanh toán thành công! Giao dịch đã hoàn tất.",
        );
        fetchAllTransactions();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi thanh toán.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmOfflinePayment = async (t) => {
    if (!window.confirm("Xác nhận bạn đã nhận đủ tiền mặt từ người mua tại sự kiện?")) return;
    setIsProcessing(true);
    try {
      await reservationService.confirmOfflinePayment(t.reservationId);
      toast.success("Xác nhận thanh toán thành công! Giao dịch đã hoàn tất.");
      fetchAllTransactions();
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi xác nhận thanh toán.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContinuePayment = async (item) => {
    setIsProcessing(true);
    try {
      let res;
      if (item.isEventBike && item.eventBikeId) {
        res = await depositService.createDepositViaVNPayForEvent(
          item.eventBikeId,
        );
      } else {
        res = await depositService.createDepositViaVNPay(item.listingId);
      }

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

  // CẬP NHẬT: GỌI API THEO ĐÚNG LOẠI XE (EVENT / THƯỜNG) KHI HOÀN TIỀN
  const confirmCancelReservation = async () => {
    if (!cancelTarget) return;
    setIsProcessing(true);
    try {
      if (cancelTarget.status === "Inspection_Failed") {
        if (cancelTarget.isEventBike) {
          await reservationService.refundDepositAfterInspectionFailEvent(
            cancelTarget.reservationId,
          );
        } else {
          await reservationService.refundDepositAfterInspectionFail(
            cancelTarget.reservationId,
          );
        }
        toast.success("Đã hoàn tiền và hủy giao dịch thành công!");
      } else {
        const desc = cancelTarget.userRole === "seller"
          ? "Người bán yêu cầu hủy giao dịch"
          : "Người mua yêu cầu hủy giao dịch";
        await reservationService.requestCancelReservation(
          cancelTarget.reservationId,
          { cancelDescription: desc },
        );
        toast.success("Đã hủy giao dịch và hoàn tiền cọc thành công!");
      }
      fetchAllTransactions();
    } catch (error) {
      toast.error(error.response?.data?.message || "Không thể hủy giao dịch.");
    } finally {
      setIsProcessing(false);
      setCancelTarget(null);
    }
  };

  const handleSellerCompensation = async (t) => {
    setIsProcessing(true);
    try {
      await reservationService.transferDepositToSellerAfterBuyerNoShow(
        t.reservationId,
      );
      toast.success(
        "Đã nhận tiền đền bù thành công! Vui lòng kiểm tra số dư ví.",
      );
      fetchAllTransactions();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Không thể nhận tiền đền bù.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmSellerCancelReservation = async () => {
    if (!sellerCancelTarget || !cancelReason.trim()) return;
    setIsProcessing(true);
    try {
      await reservationService.requestCancelReservation(
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
      Deposited: { label: "Đã đặt cọc", icon: MdCheckCircle, color: "blue" },
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
      Refunded: { label: "Đã hoàn tiền", icon: MdCheckCircle, color: "blue" },
      Compensated: { label: "Đã đền bù", icon: MdCheckCircle, color: "blue" },
      Pending_Cancel: {
        label: "Đang yêu cầu hủy",
        icon: MdWarning,
        color: "red",
      },
      Paid_Out: {
        label: "Đã thanh toán (Seller)",
        icon: MdCheckCircle,
        color: "blue",
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
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${config.color === "red"
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

  const getNoShowType = (t) => {
    const combined = [
      t.noShowType || "",
      t.cancelDescription || "",
      t.cancelReason || "",
    ]
      .join(" ")
      .toLowerCase();

    if (
      combined.includes("seller_no_show") ||
      combined.includes("người bán không đến") ||
      combined.includes("người bán không có mặt") ||
      combined.includes("nguoi ban khong den") ||
      combined.includes("nguoi ban khong co mat")
    )
      return "SELLER_NO_SHOW";

    if (
      combined.includes("buyer_no_show") ||
      combined.includes("người mua không đến") ||
      combined.includes("người mua không có mặt") ||
      combined.includes("nguoi mua khong den") ||
      combined.includes("nguoi mua khong co mat")
    )
      return "BUYER_NO_SHOW";

    return null;
  };

  const activeTransactions = mergedTransactions.filter((t) => {
    return [
      "Waiting_Payment",
      "Inspection_Failed",
      "Deposited",
      "Scheduled",
      "Pending",
      "Paid",
      "Pending_Cancel",
      "Paid_Out", // Xe sự kiện sau khi admin đã payout cho seller
    ].includes(t.status);
  });

  const displayedTransactions = activeTransactions.filter((t) =>
    transactionType === "event" ? t.isEventBike : !t.isEventBike,
  );

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-500 font-medium">
        Đang tải danh sách giao dịch...
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-6 pb-4">
        <h2 className="text-2xl font-semibold text-gray-900">
          Quản lý giao dịch
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Các giao dịch bạn đang tham gia với tư cách người mua hoặc người bán
        </p>
      </div>

      {/* TABS CHUYỂN ĐỔI */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-2">
        <button
          onClick={() => setTransactionType("regular")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-t-xl font-bold transition-all ${transactionType === "regular"
              ? "bg-zinc-900 text-white shadow-sm"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900"
            }`}
        >
          <MdStorefront size={18} /> Giao dịch xe thông thường
        </button>
        <button
          onClick={() => setTransactionType("event")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-t-xl font-bold transition-all ${transactionType === "event"
              ? "bg-orange-500 text-white shadow-sm"
              : "bg-orange-50 text-orange-400 hover:bg-orange-100 hover:text-orange-600"
            }`}
        >
          <MdEventAvailable size={18} /> Giao dịch xe sự kiện
        </button>
      </div>

      {displayedTransactions.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
          <MdReceiptLong className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500 font-medium">
            Hiện không có giao dịch{" "}
            {transactionType === "event" ? "sự kiện" : "xe thông thường"} nào
            đang xử lý.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedTransactions.map((t) => {
            return (
              <div
                key={t.reservationId || t.id}
                className="border border-gray-100 rounded-2xl bg-white shadow-sm overflow-hidden transition-all hover:shadow-md hover:border-gray-200 relative"
              >
                {t.isEventBike && (
                  <div className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-sm z-10 flex items-center gap-1">
                    <MdEventAvailable size={14} /> Giao dịch Sự kiện
                  </div>
                )}

                <div className="flex flex-col sm:flex-row">
                  <button
                    onClick={() => handleOpenDetailModal(t)}
                    className="sm:w-36 sm:h-36 h-48 w-full sm:shrink-0 bg-gray-50 flex items-center justify-center overflow-hidden relative group outline-none"
                  >
                    <BikeImage
                      src={t.listingImage}
                      alt={t.listingTitle}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white font-bold text-sm flex items-center gap-1">
                        <MdInfoOutline size={18} /> Xem chi tiết
                      </span>
                    </div>
                  </button>

                  <div className="flex-1 p-5 flex flex-col justify-between gap-4">
                    <div className="space-y-3 min-w-0 pr-8">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1 text-left">
                          <button
                            onClick={() => handleOpenDetailModal(t)}
                            className="font-semibold text-lg text-gray-900 hover:text-blue-600 transition-colors line-clamp-1 outline-none text-left"
                          >
                            {t.listingTitle}
                          </button>
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
                            <MdReceiptLong
                              size={16}
                              className="text-gray-400"
                            />
                            #{t.reservationId}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-50">
                      {renderStatusBadge(t.status)}

                      <div className="flex items-center gap-2">
                        {t.userRole === "buyer" &&
                          ["Deposited", "Pending", "Paid"].includes(
                            t.status,
                          ) && (
                            <button
                              disabled={isProcessing}
                              onClick={() => setCancelTarget(t)}
                              className="px-4 py-2 bg-transparent hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                            >
                              Hủy đặt cọc
                            </button>
                          )}

                        {t.userRole === "seller" &&
                          [
                            "Deposited",
                            "Pending",
                            "Paid",
                            "Scheduled",
                          ].includes(t.status) && (
                            <button
                              disabled={isProcessing}
                              onClick={() =>
                                setSellerCancelTarget(t.reservationId)
                              }
                              className="px-4 py-2 bg-transparent hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                            >
                              Yêu cầu hủy
                            </button>
                          )}

                        {/* NÚT THANH TOÁN CUỐI SAU KHI KIỂM ĐỊNH PASS */}
                        {t.status === "Waiting_Payment" && (
                          <>
                            {t.userRole === "buyer" && !t.isEventBike && (
                              <button
                                disabled={isProcessing}
                                onClick={() => handleFinalPayment(t)}
                                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold transition-colors flex items-center gap-2 disabled:opacity-50 shadow-sm shadow-emerald-200"
                              >
                                <MdPayment size={16} /> Thanh toán giao dịch
                              </button>
                            )}
                          </>
                        )}

                        {/* NÚT THANH TOÁN TIẾP/ XÁC NHẬN CHO XE SỰ KIỆN SAU KHI ADMIN CHUYỂN TIỀN CHO SELLER */}
                        {(t.status === "Paid_Out" || t.status === "Waiting_Payment") && t.isEventBike && (
                          <>
                            {t.userRole === "buyer" && (
                              <button
                                disabled={isProcessing}
                                onClick={() => handleFinalPayment(t)}
                                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold transition-colors flex items-center gap-2 disabled:opacity-50 shadow-sm shadow-emerald-200"
                              >
                                <MdPayment size={16} /> Thanh toán tiếp số tiền còn lại
                              </button>
                            )}
                            {t.userRole === "seller" && (
                              <button
                                disabled={isProcessing}
                                onClick={() => handleConfirmOfflinePayment(t)}
                                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold transition-colors flex items-center gap-2 disabled:opacity-50 shadow-sm shadow-emerald-200"
                              >
                                <MdCheckCircle size={16} /> Xác nhận đã nhận tiền mặt
                              </button>
                            )}
                          </>
                        )}

                        {/* NÚT THANH TOÁN LẠI CỌC NẾU CẦN */}
                        {t.status === "Pending" && t.userRole === "buyer" && (
                          <button
                            disabled={isProcessing}
                            onClick={() => handleContinuePayment(t)}
                            className="px-5 py-2 bg-zinc-900 hover:bg-orange-600 text-white rounded-lg text-sm font-bold transition-colors flex items-center gap-2 disabled:opacity-50 shadow-sm"
                          >
                            <MdPayment size={16} /> Thanh toán cọc
                          </button>
                        )}

                        {t.status === "Inspection_Failed" && (
                          <>
                            {t.userRole === "buyer" && getNoShowType(t) !== "BUYER_NO_SHOW" && (
                              <button
                                disabled={isProcessing}
                                onClick={() => setCancelTarget(t)}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-colors flex items-center gap-2 disabled:opacity-50 shadow-sm"
                              >
                                <MdCancel size={16} /> Hủy & Yêu cầu hoàn tiền cọc
                              </button>
                            )}
                            {t.userRole === "seller" && (
                              <>
                                {getNoShowType(t) === "BUYER_NO_SHOW" ? (
                                  <button
                                    disabled={isProcessing}
                                    onClick={() => handleSellerCompensation(t)}
                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold transition-colors flex items-center gap-2 disabled:opacity-50 shadow-sm"
                                  >
                                    <MdPayment size={16} /> Yêu cầu nhận tiền đền bù
                                  </button>
                                ) : (
                                  <button
                                    disabled={isProcessing}
                                    onClick={() => setCancelTarget(t)}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-colors flex items-center gap-2 disabled:opacity-50 shadow-sm"
                                  >
                                    <MdCancel size={16} /> Hủy & Hoàn cọc cho Buyer
                                  </button>
                                )}
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* --- PHẦN HIỂN THỊ THÔNG TIN CUỘC HẸN --- */}
                {t.isEventBike ? (
                  <div className="border-t border-orange-100 bg-orange-50/50 p-4 flex items-start gap-3 text-sm">
                    <MdLocationOn
                      size={20}
                      className="text-orange-500 shrink-0 mt-0.5"
                    />
                    <div className="flex-1">
                      <p className="text-orange-800 font-bold">
                        Giao dịch trực tiếp tại khu vực sự kiện
                      </p>
                      {t.status === "Scheduled" && t.inspectorName && (
                        <p className="text-orange-700 mt-1 flex items-center gap-1 font-medium">
                          <MdAssignmentInd size={16} /> Phụ trách:{" "}
                          {t.inspectorName}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  (t.meetingTime || t.meetingLocation) && (
                    <div className="border-t border-gray-100 bg-gray-50/50 p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2.5 text-sm">
                        <MdAccessTime
                          className="text-gray-400 shrink-0"
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
                      <div className="flex items-center gap-2.5 text-sm">
                        <MdLocationOn
                          className="text-gray-400 shrink-0"
                          size={18}
                        />
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
                          <span className="text-gray-700 truncate">
                            Chưa chốt địa điểm
                          </span>
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
                          >
                            <MdPhone size={16} />
                          </a>
                        )}
                      </div>
                    </div>
                  )
                )}

                {/* Panel báo cáo kiểm định */}
                {[
                  "Waiting_Payment",
                  "Inspection_Failed",
                  "Cancelled",
                  "Refunded",
                  "Compensated",
                  "Paid_Out",
                  "Completed",
                ].includes(t.status) && (
                    <InspectionReportPanel
                      reservationId={t.reservationId}
                      currentUserRole={t.userRole}
                    />
                  )}

                {/* --- BANNERS TRẠNG THÁI --- */}
                {t.status === "Waiting_Payment" && (
                  <div className="border-t border-emerald-100 bg-emerald-50/60 p-3 text-sm text-emerald-800 flex items-center gap-2.5">
                    <MdCheckCircle
                      size={18}
                      className="text-emerald-500 shrink-0"
                    />
                    {t.userRole === "buyer" ? (
                      <span>
                        Xe đã <strong>đạt kiểm định</strong>. Vui lòng thanh
                        toán phần tiền còn lại để hoàn tất giao dịch.
                      </span>
                    ) : (
                      <span>
                        Xe đã <strong>đạt kiểm định</strong>. Đang chờ người mua
                        thanh toán.
                      </span>
                    )}
                  </div>
                )}
                {t.status === "Inspection_Failed" && !getNoShowType(t) && (
                  <div className="border-t border-red-100 bg-red-50/60 p-3 text-sm text-red-800 flex items-center gap-2.5">
                    <MdWarning size={18} className="text-red-500 shrink-0" />
                    <span>
                      Xe <strong>không đạt kiểm định</strong>.{" "}
                      {t.userRole === "buyer"
                        ? "Hãy ấn nút Hủy & Yêu cầu hoàn tiền cọc bên dưới để nhận lại tiền."
                        : "Giao dịch sẽ bị hủy."}
                    </span>
                  </div>
                )}
                {t.status === "Refunded" && !getNoShowType(t) && (
                  <div className="border-t border-blue-100 bg-blue-50/60 p-3 text-sm text-blue-800 flex items-center gap-2.5">
                    <MdCheckCircle
                      size={18}
                      className="text-blue-500 shrink-0"
                    />
                    <span>
                      Xe <strong>không đạt kiểm định</strong>.{" "}
                      {t.userRole === "buyer"
                        ? "Tiền cọc đã được hoàn trả thành công vào ví của bạn."
                        : "Giao dịch đã bị hủy và hoàn tất xử lý."}
                    </span>
                  </div>
                )}

                {t.status === "Deposited" && !t.isEventBike && (
                  <div className="border-t border-gray-50 bg-blue-50/50 p-3 text-sm text-blue-700 flex items-center gap-2.5">
                    <MdAdminPanelSettings size={18} className="text-blue-500" />
                    <span>Đang chờ Admin xếp lịch hẹn kiểm tra xe...</span>
                  </div>
                )}

                {t.status === "Deposited" && t.isEventBike && (
                  <div className="border-t border-orange-100 bg-orange-50/50 p-3 text-sm text-orange-800 flex items-center gap-2.5">
                    <MdEventAvailable size={18} className="text-orange-500" />
                    <span>
                      Đã đặt cọc. Hệ thống đang phân công Kiểm định viên phụ
                      trách giao dịch của bạn tại sự kiện.
                    </span>
                  </div>
                )}

                {t.status === "Scheduled" && t.isEventBike && (
                  <div className="border-t border-blue-100 bg-blue-50/50 p-3 text-sm text-blue-800 flex items-center gap-2.5">
                    <MdAssignmentInd size={18} className="text-blue-500" />
                    <span>
                      Đã phân công Kiểm định viên. Vui lòng tiến hành giao dịch
                      trực tiếp tại sự kiện.
                    </span>
                  </div>
                )}

                {/* Banner vắng mặt - Người bán không đến */}
                {(t.status === "Cancelled" ||
                  t.status === "Inspection_Failed" ||
                  t.status === "Refunded") &&
                  getNoShowType(t) === "SELLER_NO_SHOW" && (
                    <div className="border-t p-4 text-sm flex items-start gap-3 bg-red-50/80 border-red-100 text-red-800">
                      {t.userRole === "buyer" ? (
                        <>
                          <MdWarning
                            size={20}
                            className="text-red-500 shrink-0 mt-0.5"
                          />
                          <div>
                            <p className="font-bold mb-1">
                              Giao dịch đã bị hủy — Người bán không đến
                            </p>
                            {t.status === "Refunded" ? (
                              <p>
                                <strong>Thành công!</strong> Tiền cọc đã được
                                hoàn trả 100% + thêm 200,000 VND tiền bồi thường
                                vào ví của bạn.
                              </p>
                            ) : (
                              <p>
                                Hãy ấn nút{" "}
                                <strong>Hủy & Yêu cầu hoàn tiền cọc</strong> bên
                                dưới để được hoàn 100% tiền cọc + thêm{" "}
                                <strong>200,000 VND</strong> tiền bồi thường vì
                                người bán đã không đến.
                              </p>
                            )}
                            {t.cancelDescription && (
                              <p className="mt-2 text-red-700 bg-red-100/50 p-2 rounded text-xs">
                                <span className="font-semibold">
                                  Lý do ghi nhận:
                                </span>{" "}
                                {t.cancelDescription}
                              </p>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          <MdWarning
                            size={20}
                            className="text-red-500 shrink-0 mt-0.5"
                          />
                          <div>
                            <p className="font-bold mb-1">
                              Giao dịch đã thất bại — Bạn đã không đến
                            </p>
                            <p>
                              Giao dịch bị hủy vì{" "}
                              <strong>bạn (người bán) không đến</strong> đúng
                              giờ. Tiền cọc sẽ được hoàn lại cho người mua kèm
                              200,000 VND bồi thường. Liên hệ hỗ trợ nếu có
                              khiếu nại.
                            </p>
                            {t.cancelDescription && (
                              <p className="mt-2 text-red-700 bg-red-100/50 p-2 rounded text-xs">
                                <span className="font-semibold">
                                  Lý do ghi nhận:
                                </span>{" "}
                                {t.cancelDescription}
                              </p>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                {/* Banner vắng mặt - Người mua không đến */}
                {(t.status === "Inspection_Failed" ||
                  t.status === "Compensated") &&
                  getNoShowType(t) === "BUYER_NO_SHOW" && (
                    <div className="border-t p-4 text-sm flex items-start gap-3 bg-red-50/80 border-red-100 text-red-800">
                      {t.userRole === "seller" ? (
                        <>
                          <MdWarning
                            size={20}
                            className="text-red-500 shrink-0 mt-0.5"
                          />
                          <div>
                            <p className="font-bold mb-1">
                              Giao dịch đã bị hủy — Người mua không đến
                            </p>
                            {t.status === "Compensated" ? (
                              <p>
                                <strong>Thành công!</strong> Bạn đã nhận được{" "}
                                <strong>50% tiền cọc</strong> từ người mua. Vui
                                lòng kiểm tra ví.
                              </p>
                            ) : (
                              <p>
                                Hãy ấn nút{" "}
                                <strong>Yêu cầu nhận tiền đền bù</strong> bên
                                dưới để nhận <strong>50% tiền cọc</strong> vì
                                người mua đã không đến. Hệ thống sẽ giữ lại 50%
                                còn lại.
                              </p>
                            )}
                            {t.cancelDescription && (
                              <p className="mt-2 text-red-700 bg-red-100/50 p-2 rounded text-xs">
                                <span className="font-semibold">
                                  Lý do ghi nhận:
                                </span>{" "}
                                {t.cancelDescription}
                              </p>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          <MdWarning
                            size={20}
                            className="text-red-500 shrink-0 mt-0.5"
                          />
                          <div>
                            <p className="font-bold mb-1">
                              Giao dịch đã thất bại — Bạn đã không đến
                            </p>
                            <p>
                              Giao dịch bị hủy vì{" "}
                              <strong>bạn (người mua) đã không đến</strong> đúng
                              giờ hẹn kiểm định.{" "}
                              <span className="font-bold underline">
                                50% tiền cọc đã chuyển cho người bán
                              </span>
                              , 50% còn lại hệ thống giữ lại theo quy định.
                            </p>
                            {t.cancelDescription && (
                              <p className="mt-2 text-red-700 bg-red-100/50 p-2 rounded text-xs">
                                <span className="font-semibold">
                                  Lý do ghi nhận:
                                </span>{" "}
                                {t.cancelDescription}
                              </p>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  )}
              </div>
            );
          })}
        </div>
      )}

      {/* --- MODAL XÁC NHẬN HỦY CỌC --- */}
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
              className={`flex-1 px-4 py-2.5 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 ${cancelTarget?.status === "Inspection_Failed"
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
                Vì xe <strong>không đạt kiểm định</strong>, giao dịch sẽ được
                đóng và hệ thống sẽ{" "}
                <span className="text-emerald-600 font-bold">
                  hoàn trả 100% tiền cọc
                </span>{" "}
                vào ví của bạn (đối với người mua).
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
                <span className="text-red-500 font-medium">
                  không được hoàn lại
                </span>{" "}
                nếu bạn tự ý hủy giao dịch ở giai đoạn này.
              </p>
            </>
          )}
        </div>
      </Modal>

      {/* --- MODAL YÊU CẦU HỦY GIAO DỊCH (SELLER) --- */}
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
            Vui lòng nhập lý do cụ thể.
          </p>
          <div className="mt-4 text-left">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lý do hủy giao dịch <span className="text-red-500">*</span>
            </label>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Nhập lý do chi tiết..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 min-h-[100px] resize-none"
            />
          </div>
        </div>
      </Modal>

      {/* --- MODAL XEM CHI TIẾT BÀI ĐĂNG (POPUP HIỆN ĐẠI) --- */}
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
                {viewDetailTarget.isEventBike && (
                  <span className="bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded mb-2 inline-flex items-center gap-1 shadow-sm">
                    <MdEventAvailable size={14} /> Xe Sự kiện
                  </span>
                )}
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
  );
};

export default TransactionManagementTab;
