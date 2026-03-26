import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { reservationService } from "../../../services/reservationService";
import { transactionService } from "../../../services/transactionService";
import {
  MdCheckCircle,
  MdCancel,
  MdHistory,
  MdReceiptLong,
  MdReplay,
  MdAccessTime,
  MdImage,
} from "react-icons/md";
import formatCurrency from "../../../utils/formatCurrency";

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

  return <img src={imgSrc} alt={alt} className={className} onError={handleError} />;
};

const TransactionHistoryTab = () => {
  const { user } = useAuth();
  const [mergedTransactions, setMergedTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = user?.userId || user?.id;

  const extractImageUrl = (item) => {
    if (item.listingImage) return item.listingImage;
    if (item.eventBicycleImage) return item.eventBicycleImage;

    const url = item.listing?.image_url || item.eventBicycle?.image_url || item.image_url;
    if (typeof url === "string" && url.includes(",")) {
      return url.split(",")[0].trim();
    }
    return url || null;
  };

  const mapTransactionToDisplay = (tx) => {
    const listing = tx.listing || {};
    const eventBike = tx.eventBicycle || {};
    const reservation = tx.reservation || {};
    const buyer = tx.buyer || {};
    const seller = tx.seller || listing.seller || eventBike.seller || {};

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
        ((tx.depositAmount || 0) + (tx.remainingAmount || 0)) ||
        tx.amount ||
        listing.price ||
        eventBike.price ||
        0,
      status: reservation.status || tx.status,
      reservedAt: tx.reservedAt || tx.createAt || tx.createdAt,
      cancelDescription:
        reservation.cancelDescription ||
        tx.cancelDescription ||
        reservation.cancelReason ||
        tx.cancelReason ||
        "",
      buyerId: buyer.userId || tx.buyerId,
      sellerId: seller.userId || tx.sellerId,
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
      if (regularRes.status === "fulfilled" && regularRes.value?.result) {
        regularRes.value.result.map(mapTransactionToDisplay)
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

      const otherMap = new Map();
      if (transactionsRes.status === "fulfilled" && transactionsRes.value?.result) {
        transactionsRes.value.result.map(mapTransactionToDisplay)
          .filter((t) => (t.sellerId === userId || t.buyerId === userId) && !buyerMap.has(t.reservationId || t.id))
          .forEach((item) => {
            const key = item.reservationId || item.id;
            if (key) otherMap.set(key, item);
          });
      }

      const uniqueMap = new Map([...buyerMap, ...otherMap]);

      const merged = Array.from(uniqueMap.values())
        .map((item) => ({
          ...item,
          userRole: item.buyerId === userId ? "buyer" : "seller",
        }))
        .sort((a, b) => new Date(b.reservedAt) - new Date(a.reservedAt));

      setMergedTransactions(merged);
    } catch (error) {
      console.error("Lỗi tải danh sách lịch sử:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchAllTransactions();
  }, [userId]);

  const pastTransactions = mergedTransactions.filter((t) => {
    const status = t.status || "";
    return [
      "Completed",
      "Cancelled",
      "Refunded",
      "Compensated",
      "Paid_Out"
    ].includes(status);
  });

  const renderStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return (
          <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <MdCheckCircle size={14} /> Hoàn tất
          </span>
        );
      case "Paid_Out":
        return (
          <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <MdCheckCircle size={14} /> Đã thanh toán
          </span>
        );
      case "Cancelled":
        return (
          <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <MdCancel size={14} /> Đã hủy
          </span>
        );
      case "Compensated":
        return (
          <span className="bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <MdCheckCircle size={14} /> Đã đền bù
          </span>
        );
      case "Refunded":
        return (
          <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <MdReplay size={14} /> Đã hoàn tiền
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <MdReceiptLong size={14} /> {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-500 font-medium">
        Đang tải lịch sử giao dịch...
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-6 border-b border-gray-100 pb-4">
        <h2 className="text-2xl font-bold text-zinc-900">Lịch sử giao dịch</h2>
        <p className="text-gray-500 text-sm mt-1">
          Lưu trữ các giao dịch đã đóng, hoàn tiền hoặc đền bù
        </p>
      </div>

      {pastTransactions.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
          <MdHistory className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500 font-medium">
            Chưa có lịch sử giao dịch nào ở trong trạng thái này.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pastTransactions.map((t) => {
            const displayId = t.reservationId || t.id;

            return (
              <div
                key={displayId}
                className="flex flex-col p-4 gap-4 border border-gray-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div className="flex gap-4 items-center min-w-0 flex-1">
                    <div className="w-20 h-20 shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 relative">
                      <BikeImage
                        src={t.listingImage}
                        alt={t.listingTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 pr-4">
                      <h4 className="font-bold text-zinc-900 truncate mb-1" title={t.listingTitle}>
                        {t.listingTitle}
                      </h4>
                      <p className="text-sm text-gray-500 mb-1.5 flex items-center gap-2">
                         {t.reservedAt
                          ? new Date(t.reservedAt).toLocaleDateString("vi-VN")
                          : "N/A"}{" "}
                        <span className="text-gray-300">•</span> 
                        <strong className="text-gray-900">{formatCurrency(t.bikePrice || 0)}</strong>
                      </p>
                      <span className="text-[10px] bg-gray-100 border border-gray-200 text-gray-600 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                        {t.userRole === "seller" ? "Người bán" : "Người mua"}
                      </span>
                    </div>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 border-t border-gray-50 pt-3 sm:border-0 sm:pt-0 shrink-0">
                    {renderStatusBadge(t.status)}
                    <Link
                      to={`/manage/transactions`} 
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-wider"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </div>

                {/* Additional Info Block */}
                <div className="bg-gray-50 p-3 rounded-xl text-sm border border-gray-100 text-gray-600 mt-2">
                  {t.status === "Cancelled" && (
                    <><strong className="text-gray-800">Lý do hủy / trạng thái:</strong> {t.cancelDescription || "Đã yêu cầu hủy giao dịch."}</>
                  )}
                  {t.status === "Completed" && (
                    <><strong className="text-green-700">Thông báo:</strong> Giao dịch thành công, đang chờ Admin chuyển khoản cho người bán.</>
                  )}
                  {t.status === "Paid_Out" && (
                    <><strong className="text-indigo-700">Thông báo:</strong> Đã chuyển khoản tiền giao dịch thành công cho người bán.</>
                  )}
                  {t.status === "Refunded" && (
                    <><strong className="text-blue-700">Thông báo:</strong> Giao dịch thất bại hoặc hủy. Người mua được hoàn trả 100% tiền cọc và nhận thêm 200k bồi thường.</>
                  )}
                  {t.status === "Compensated" && (
                    <><strong className="text-purple-700">Thông báo:</strong> Người mua không đến kiểm định. Đã chuyển khoản tiền đền bù đặt cọc cho người bán.</>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TransactionHistoryTab;
