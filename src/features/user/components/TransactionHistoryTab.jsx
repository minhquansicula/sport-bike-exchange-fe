import React, { useEffect } from "react";
import {
  MdCheckCircle,
  MdCancel,
  MdHistory,
  MdReceiptLong,
  MdReplay,
  MdAccessTime,
} from "react-icons/md";
import { Link } from "react-router-dom";

const TransactionHistoryTab = ({ transactions = [] }) => {
  // Bật F12 -> Tab Console lên để xem dữ liệu backend trả về có những gì nhé!
  useEffect(() => {
    console.log("Dữ liệu transactions truyền vào Tab Lịch Sử:", transactions);
  }, [transactions]);

  // NỚI LỎNG BỘ LỌC: Bổ sung thêm "paid", "deposited" để bạn có thể nhìn thấy giao dịch vừa cọc xong
  const pastTransactions = transactions.filter((t) => {
    const status = t.status?.toLowerCase() || "";
    // Bạn có thể xóa "paid", "deposited" ở dưới đi nếu CHỈ muốn hiện các giao dịch đã hoàn toàn đóng.
    return [
      "completed",
      "rejected",
      "cancelled",
      "refunded",
      "failed",
      "paid",
      "deposited",
    ].includes(status);
  });

  const renderStatusBadge = (status) => {
    const s = status?.toLowerCase();
    switch (s) {
      case "completed":
        return (
          <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <MdCheckCircle size={14} /> Hoàn tất
          </span>
        );
      case "paid":
      case "deposited":
        return (
          <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <MdAccessTime size={14} /> Đã thanh toán
          </span>
        );
      case "rejected":
      case "failed":
        return (
          <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <MdCancel size={14} /> Thất bại
          </span>
        );
      case "cancelled":
        return (
          <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <MdCancel size={14} /> Đã hủy
          </span>
        );
      case "refunded":
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

  // Trích xuất thông tin hiển thị (hỗ trợ cả mảng Reservation và Transaction)
  const getBikeInfo = (t) => {
    const title =
      t.listingTitle ||
      t.listing?.title ||
      t.eventBicycle?.title ||
      t.description ||
      "Giao dịch VeloX";
    const price =
      t.depositAmount ||
      t.actualPrice ||
      t.amount ||
      t.listing?.price ||
      t.eventBicycle?.price ||
      0;

    let image = "https://via.placeholder.com/150?text=No+Image";
    const rawImage =
      t.listing?.image_url ||
      t.eventBicycle?.image_url ||
      t.listing?.bicycle?.image_url;
    if (rawImage) {
      image = rawImage.split(",")[0];
    }

    return { title, price, image };
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-6 border-b border-gray-100 pb-4">
        <h2 className="text-2xl font-bold text-zinc-900">Lịch sử giao dịch</h2>
        <p className="text-gray-500 text-sm">
          Lưu trữ các giao dịch đã hoàn tất, được hoàn tiền hoặc bị hủy
        </p>
      </div>

      {pastTransactions.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100">
          <MdHistory className="mx-auto text-gray-300 mb-3" size={48} />
          <p className="text-gray-500">
            Chưa có lịch sử giao dịch nào ở trạng thái này.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pastTransactions.map((t) => {
            const { title, price, image } = getBikeInfo(t);
            // Lấy ID tùy thuộc vào bạn đang truyền Reservation hay Transaction vào
            const displayId = t.transactionId || t.reservationId || t.id;

            return (
              <div
                key={displayId}
                className="flex justify-between items-center p-4 border border-gray-200 rounded-xl bg-white opacity-80 hover:opacity-100 transition-opacity"
              >
                <div className="flex gap-4 items-center">
                  <img
                    src={image}
                    alt={title}
                    className="w-16 h-16 rounded-lg object-cover bg-gray-100 grayscale"
                  />
                  <div>
                    <h4 className="font-bold text-zinc-900 line-clamp-1">
                      {title}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {t.createdAt
                        ? new Date(t.createdAt).toLocaleDateString("vi-VN")
                        : "N/A"}{" "}
                      • {price.toLocaleString("vi-VN")} đ
                    </p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  {renderStatusBadge(t.status)}
                  <Link
                    to={`/transaction/${displayId}`}
                    className="text-xs text-blue-500 hover:underline mt-1 block"
                  >
                    Xem chi tiết
                  </Link>
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
