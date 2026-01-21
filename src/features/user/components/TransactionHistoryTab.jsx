import React from "react";
import {
  MdCheckCircle,
  MdCancel,
  MdHistory,
  MdReceiptLong,
} from "react-icons/md";
import { Link } from "react-router-dom";

const TransactionHistoryTab = ({ transactions }) => {
  // 2. Lọc chỉ lấy các giao dịch ĐÃ KẾT THÚC
  const pastTransactions = transactions.filter((t) =>
    ["completed", "rejected", "cancelled"].includes(t.status),
  );

  const renderStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <MdCheckCircle /> Hoàn tất
          </span>
        );
      case "rejected":
        return (
          <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <MdCancel /> Đã từ chối
          </span>
        );
      case "cancelled":
        return (
          <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <MdCancel /> Đã hủy
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-6 border-b border-gray-100 pb-4">
        <h2 className="text-2xl font-bold text-zinc-900">Lịch sử giao dịch</h2>
        <p className="text-gray-500 text-sm">
          Lưu trữ các giao dịch đã hoàn tất hoặc bị hủy
        </p>
      </div>

      {pastTransactions.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100">
          <MdHistory className="mx-auto text-gray-300 mb-3" size={48} />
          <p className="text-gray-500">Chưa có lịch sử giao dịch nào.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pastTransactions.map((t) => (
            <div
              key={t.id}
              className="flex justify-between items-center p-4 border border-gray-200 rounded-xl bg-white opacity-80 hover:opacity-100 transition-opacity"
            >
              <div className="flex gap-4 items-center">
                <img
                  src={t.image}
                  alt=""
                  className="w-16 h-16 rounded-lg object-cover bg-gray-100 grayscale"
                />
                <div>
                  <h4 className="font-bold text-zinc-900">{t.bikeName}</h4>
                  <p className="text-sm text-gray-500">
                    {new Date(t.createdAt).toLocaleDateString("vi-VN")} •{" "}
                    {t.price.toLocaleString("vi-VN")} đ
                  </p>
                </div>
              </div>
              <div className="text-right">
                {renderStatusBadge(t.status)}
                <Link
                  to={`/transaction/${t.id}`}
                  className="text-xs text-blue-500 hover:underline mt-1 block"
                >
                  Xem chi tiết
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionHistoryTab;
