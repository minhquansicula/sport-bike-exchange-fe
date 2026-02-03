import React, { useState } from "react";
import {
  MdSave,
  MdAttachMoney,
  MdSecurity,
  MdEdit,
  MdCheck,
  MdClose,
  MdTrendingUp,
} from "react-icons/md";
import formatCurrency from "../../../utils/formatCurrency";

const AdminPricingPage = () => {
  // --- STATE ---
  const [commissionRate, setCommissionRate] = useState(5);
  const [tempCommission, setTempCommission] = useState(5); // Biến tạm khi đang sửa
  const [isEditingCommission, setIsEditingCommission] = useState(false);

  const [depositRules, setDepositRules] = useState([
    {
      id: 1,
      minPrice: 0,
      maxPrice: 5000000,
      depositAmount: 200000,
      note: "Xe phổ thông",
    },
    {
      id: 2,
      minPrice: 5000000,
      maxPrice: 20000000,
      depositAmount: 500000,
      note: "Xe tầm trung",
    },
    {
      id: 3,
      minPrice: 20000000,
      maxPrice: 50000000,
      depositAmount: 1000000,
      note: "Xe cao cấp",
    },
    {
      id: 4,
      minPrice: 50000000,
      maxPrice: 999999999,
      depositAmount: 2000000,
      note: "Xe hạng sang",
    },
  ]);

  // --- HANDLERS ---
  const handleUpdateDeposit = (id, field, value) => {
    setDepositRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: Number(value) } : r)),
    );
  };

  // Xử lý lưu phí sàn
  const handleSaveCommission = () => {
    setCommissionRate(tempCommission);
    setIsEditingCommission(false);
    // TODO: Call API here
    alert(`Đã cập nhật phí sàn thành ${tempCommission}%`);
  };

  // Xử lý hủy sửa phí sàn
  const handleCancelCommission = () => {
    setTempCommission(commissionRate);
    setIsEditingCommission(false);
  };

  return (
    <div className="max-w-7xl mx-auto pb-20 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Cấu hình Tài chính
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Quản lý doanh thu phí sàn và quy định tiền cọc
          </p>
        </div>
        <button
          onClick={() => alert("Đã lưu toàn bộ cấu hình!")}
          className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl font-bold transition-all shadow-lg shadow-gray-200"
        >
          <MdSave size={20} /> Lưu thay đổi
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- CỘT 1 (1/3): PHÍ SÀN (COMMISSION) --- */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-full flex flex-col relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
                <MdAttachMoney size={26} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">
                  Phí Hoa Hồng
                </h3>
                <p className="text-xs text-gray-500">
                  Trên mỗi giao dịch thành công
                </p>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center py-6 relative z-10">
              {isEditingCommission ? (
                <div className="flex flex-col items-center gap-4 w-full animate-in fade-in zoom-in duration-200">
                  <div className="flex items-baseline gap-1 border-b-2 border-blue-500 pb-1">
                    <input
                      type="number"
                      value={tempCommission}
                      onChange={(e) => setTempCommission(e.target.value)}
                      className="text-6xl font-black text-blue-600 w-32 text-center bg-transparent focus:outline-none"
                      autoFocus
                    />
                    <span className="text-3xl font-bold text-blue-300">%</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Nhập số % bạn muốn thu
                  </p>
                </div>
              ) : (
                <div className="flex items-baseline gap-1 animate-in fade-in zoom-in duration-200">
                  <span className="text-7xl font-black text-gray-900 tracking-tighter">
                    {commissionRate}
                  </span>
                  <span className="text-3xl font-bold text-gray-300">%</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 relative z-10">
              {isEditingCommission ? (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleCancelCommission}
                    className="flex items-center justify-center gap-2 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl font-bold transition-all"
                  >
                    <MdClose size={20} /> Hủy
                  </button>
                  <button
                    onClick={handleSaveCommission}
                    className="flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-200 transition-all"
                  >
                    <MdCheck size={20} /> Lưu
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setTempCommission(commissionRate);
                    setIsEditingCommission(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 border-2 border-gray-100 hover:border-blue-100 hover:bg-blue-50 text-gray-600 hover:text-blue-600 rounded-xl font-bold transition-all group"
                >
                  <MdEdit
                    size={20}
                    className="group-hover:scale-110 transition-transform"
                  />{" "}
                  Chỉnh sửa mức phí
                </button>
              )}
            </div>

            {/* Info Box */}
            {!isEditingCommission && (
              <div className="mt-6 bg-gray-50 p-4 rounded-xl flex gap-3 items-start border border-gray-100">
                <MdTrendingUp
                  className="text-green-500 mt-1 shrink-0"
                  size={18}
                />
                <p className="text-xs text-gray-500 leading-relaxed">
                  Với mức phí{" "}
                  <span className="font-bold text-gray-900">
                    {commissionRate}%
                  </span>
                  , doanh thu dự kiến tháng này tăng trưởng ổn định.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* --- CỘT 2 (2/3): BẢNG CẤU HÌNH CỌC --- */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-full flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center shadow-sm">
                <MdSecurity size={26} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">
                  Cấu hình Tiền Cọc
                </h3>
                <p className="text-xs text-gray-500">
                  Tự động tính cọc dựa trên giá trị xe
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-100 flex-1">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50/80">
                  <tr>
                    <th className="px-6 py-4 font-bold">Phân loại xe</th>
                    <th className="px-6 py-4 font-bold">Khoảng giá trị</th>
                    <th className="px-6 py-4 font-bold text-right">
                      Mức cọc yêu cầu
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {depositRules.map((rule) => (
                    <tr
                      key={rule.id}
                      className="hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900 align-middle">
                        {rule.note}
                      </td>
                      <td className="px-6 py-4 align-middle">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded text-xs">
                            {formatCurrency(rule.minPrice)}
                          </span>
                          <span className="text-gray-300">➜</span>
                          <div className="relative group-hover:shadow-sm transition-shadow rounded-lg">
                            <input
                              type="number"
                              value={rule.maxPrice}
                              onChange={(e) =>
                                handleUpdateDeposit(
                                  rule.id,
                                  "maxPrice",
                                  e.target.value,
                                )
                              }
                              className="w-28 pl-3 pr-8 py-1.5 border border-gray-200 rounded-lg focus:border-green-500 focus:outline-none font-medium text-gray-700 bg-white"
                            />
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-[10px]">
                              đ
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right align-middle">
                        <div className="inline-flex items-center border border-green-200 bg-green-50 rounded-lg px-1 py-1 focus-within:ring-2 focus-within:ring-green-200 transition-all">
                          <input
                            type="number"
                            value={rule.depositAmount}
                            onChange={(e) =>
                              handleUpdateDeposit(
                                rule.id,
                                "depositAmount",
                                e.target.value,
                              )
                            }
                            className="w-32 text-right font-bold text-green-700 bg-transparent focus:outline-none pr-1"
                          />
                          <span className="text-xs text-green-600 font-medium pr-3 border-l border-green-200 pl-2">
                            VNĐ
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Example Preview */}
            <div className="mt-6 p-5 rounded-2xl bg-gray-900 text-white flex items-center justify-between shadow-lg shadow-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl">
                  💡
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                    Ví dụ minh họa
                  </p>
                  <p className="text-sm mt-0.5 text-gray-200">
                    Khách mua xe giá{" "}
                    <strong className="text-white">15.000.000 ₫</strong>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Hệ thống yêu cầu cọc:</p>
                <p className="text-2xl font-bold text-green-400">
                  {formatCurrency(
                    depositRules.find(
                      (r) => 15000000 >= r.minPrice && 15000000 < r.maxPrice,
                    )?.depositAmount || 0,
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPricingPage;
