import React from "react";
import {
  MdAccessTime,
  MdAdminPanelSettings,
  MdCheckCircle,
  MdInfoOutline,
  MdReceiptLong,
  MdMap,
  MdCancel,
  MdPhone,
  MdLocationOn,
} from "react-icons/md";

const TransactionManagementTab = ({
  transactions,
  sellerAcceptTransaction,
  sellerRejectTransaction,
}) => {
  // 1. Lọc chỉ lấy các giao dịch ĐANG HOẠT ĐỘNG
  const activeTransactions = transactions.filter((t) =>
    ["pending_seller", "pending_admin", "scheduled"].includes(t.status),
  );

  // Helper render badge (giữ nguyên hoặc tùy chỉnh thêm)
  const renderStatusBadge = (status) => {
    switch (status) {
      case "pending_seller":
        return (
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-yellow-200">
            <MdAccessTime /> Chờ bạn xác nhận
          </span>
        );
      case "pending_admin":
        return (
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-blue-200">
            <MdAdminPanelSettings /> Đang chờ Admin
          </span>
        );
      case "scheduled":
        return (
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-green-200">
            <MdCheckCircle /> Đã lên lịch hẹn
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-6 border-b border-gray-100 pb-4">
        <h2 className="text-2xl font-bold text-zinc-900">Quản lý giao dịch</h2>
        <p className="text-gray-500 text-sm">
          Các yêu cầu mua bán đang cần bạn theo dõi
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
              key={t.id}
              className="border border-gray-200 rounded-2xl bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Header Card */}
              <div className="p-5 flex justify-between items-start gap-4">
                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 border border-gray-100 shrink-0">
                    <img
                      src={t.image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Mã đơn: #{t.id}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs text-gray-500">
                        {new Date(t.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-zinc-900 line-clamp-1">
                      {t.bikeName}
                    </h3>
                    <p className="text-orange-600 font-bold text-lg">
                      {t.price.toLocaleString("vi-VN")} đ
                    </p>
                  </div>
                </div>
                {renderStatusBadge(t.status)}
              </div>

              {/* Body Content - Xử lý từng trạng thái riêng biệt */}
              <div className="px-5 pb-5">
                {/* CASE 1: CHỜ NGƯỜI BÁN XÁC NHẬN */}
                {t.status === "pending_seller" && (
                  <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100 mt-2">
                    <div className="flex items-start gap-3">
                      <MdInfoOutline
                        className="text-yellow-600 mt-1 shrink-0"
                        size={20}
                      />
                      <div>
                        <p className="font-bold text-yellow-900 text-sm mb-1">
                          Yêu cầu mua xe mới!
                        </p>
                        <p className="text-sm text-yellow-800 mb-4 leading-relaxed">
                          Người mua đang chờ bạn xác nhận bán chiếc xe này. Nếu
                          đồng ý, Admin sẽ liên hệ để sắp xếp lịch kiểm tra xe.
                        </p>
                        <div className="flex gap-3">
                          <button
                            onClick={() => sellerAcceptTransaction(t.id)}
                            className="bg-zinc-900 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-green-600 transition-colors shadow-sm"
                          >
                            ✓ Đồng ý bán
                          </button>
                          <button
                            onClick={() => sellerRejectTransaction(t.id)}
                            className="bg-white border border-gray-300 text-gray-600 px-5 py-2 rounded-lg text-sm font-bold hover:bg-gray-50"
                          >
                            ✕ Từ chối
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* CASE 2: CHỜ ADMIN XẾP LỊCH */}
                {t.status === "pending_admin" && (
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 mt-2 flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                      <MdAdminPanelSettings size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-blue-900 text-sm">
                        Đang xử lý hồ sơ...
                      </p>
                      <p className="text-sm text-blue-800">
                        Admin đang tìm Inspector và địa điểm phù hợp. Vui lòng
                        chờ thông báo (tối đa 24h).
                      </p>
                    </div>
                  </div>
                )}

                {/* CASE 3: ĐÃ LÊN LỊCH (VÉ MỜI) */}
                {t.status === "scheduled" && (
                  <div className="mt-2 border border-green-200 rounded-xl overflow-hidden relative">
                    <div className="bg-green-50 p-3 border-b border-green-100 flex justify-between items-center">
                      <span className="font-bold text-green-800 text-sm flex items-center gap-2">
                        <MdReceiptLong /> VÉ MỜI GIAO DỊCH
                      </span>
                      <span className="text-xs font-bold text-green-600 bg-white px-2 py-1 rounded border border-green-200">
                        Đã xác nhận
                      </span>
                    </div>
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white">
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">
                          Thời gian gặp mặt
                        </p>
                        <p className="text-zinc-900 font-medium flex items-center gap-2">
                          <MdAccessTime className="text-orange-600" />
                          {new Date(t.meetingTime).toLocaleString("vi-VN", {
                            weekday: "long",
                            day: "numeric",
                            month: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">
                          Địa điểm giao dịch
                        </p>
                        <p className="text-zinc-900 font-medium flex items-center gap-2">
                          <MdLocationOn className="text-orange-600" />{" "}
                          {t.meetingLocation}
                        </p>
                      </div>
                      <div className="md:col-span-2 bg-gray-50 p-3 rounded-lg flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                          IN
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-bold">
                            Inspector phụ trách
                          </p>
                          <p className="text-sm font-bold text-zinc-900">
                            {t.inspectorName}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 border-t border-gray-100 flex justify-end gap-3">
                      <button className="text-red-500 text-xs font-bold hover:underline flex items-center gap-1">
                        <MdCancel /> Hủy hẹn
                      </button>
                      <button className="text-zinc-700 text-xs font-bold hover:text-orange-600 flex items-center gap-1">
                        <MdPhone /> Liên hệ hỗ trợ
                      </button>
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
