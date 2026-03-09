// File: src/pages/user/components/WalletTab.jsx
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { walletService } from "../../../services/walletService";
import formatCurrency from "../../../utils/formatCurrency";
import { toast } from "react-hot-toast";
import { useAuth } from "../../../hooks/useAuth"; // Lấy useAuth để hiển thị tên
import {
  MdAccountBalanceWallet,
  MdAddCircleOutline,
  MdCheckCircle,
  MdAutorenew,
} from "react-icons/md";

const WalletTab = () => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState({});
  const [loading, setLoading] = useState(true);
  const [amountToAdd, setAmountToAdd] = useState(""); // Lưu giá trị gốc dạng chuỗi số: "100000"
  const [isAdding, setIsAdding] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    fetchWallet();
    handleVNPayReturn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchWallet = async () => {
    try {
      setLoading(true);
      const response = await walletService.getWallet();
      if (response && response.result) {
        setWallet(response.result);
      }
    } catch (error) {
      console.error("Lỗi tải ví:", error);
      toast.error("Không thể tải thông tin ví.");
    } finally {
      setLoading(false);
    }
  };

  const handleVNPayReturn = async () => {
    const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");

    if (vnp_ResponseCode) {
      if (vnp_ResponseCode === "00") {
        try {
          const queryString = window.location.search;
          await walletService.verifyVNPayReturn(queryString);

          toast.success("Giao dịch VNPay thành công! Đã nạp tiền vào ví.");
          fetchWallet();
        } catch (error) {
          toast.error("Xác thực giao dịch thất bại.");
        }
      } else {
        toast.error("Bạn đã hủy giao dịch hoặc giao dịch thất bại.");
      }
      setSearchParams({});
    }
  };

  const handleAddFunds = async (e) => {
    e.preventDefault();
    const amount = parseFloat(amountToAdd);

    if (!amount || amount <= 0) {
      toast.error("Vui lòng nhập số tiền hợp lệ!");
      return;
    }

    try {
      setIsAdding(true);
      const response = await walletService.createVNPayUrl(amount);

      if (response && response.result) {
        window.location.href = response.result;
      } else {
        toast.error("Lỗi lấy thông tin thanh toán từ hệ thống.");
      }
    } catch (error) {
      console.error("Lỗi tạo giao dịch:", error);
      toast.error("Hệ thống đang bận, vui lòng thử lại sau.");
    } finally {
      setIsAdding(false);
    }
  };

  // Hàm xử lý khi người dùng nhập tiền (chỉ cho phép số và xóa số 0 ở đầu)
  const handleAmountChange = (e) => {
    // Xóa tất cả các ký tự không phải là số
    let rawValue = e.target.value.replace(/\D/g, "");
    // Loại bỏ số 0 ở đầu nếu có (VD: 0123 -> 123)
    if (rawValue.startsWith("0")) {
      rawValue = rawValue.replace(/^0+/, "");
    }
    setAmountToAdd(rawValue);
  };

  // Hàm format số để hiển thị ra ô input (VD: 100000 -> 100.000)
  const formatDisplayAmount = (val) => {
    if (!val) return "";
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-zinc-900"></div>
          <p className="text-sm font-medium text-zinc-500">
            Đang tải thông tin ví...
          </p>
        </div>
      </div>
    );
  }

  const predefinedAmounts = [
    { label: "100K", value: 100000 },
    { label: "200K", value: 200000 },
    { label: "500K", value: 500000 },
    { label: "1 Triệu", value: 1000000 },
    { label: "2 Triệu", value: 2000000 },
    { label: "5 Triệu", value: 5000000 },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-100">
        <div>
          <h2 className="text-2xl font-black text-zinc-900 flex items-center gap-2">
            <MdAccountBalanceWallet className="text-zinc-900" />
            Ví VeloX của bạn
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            Quản lý số dư và nạp tiền để thực hiện giao dịch an toàn.
          </p>
        </div>
        <button
          onClick={fetchWallet}
          className="p-2 rounded-full hover:bg-zinc-100 text-zinc-500 transition-colors"
          title="Làm mới"
        >
          <MdAutorenew size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-white/10 transition-all duration-700"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-orange-500/20 rounded-full blur-2xl -ml-10 -mb-10"></div>

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-zinc-400 font-medium text-sm tracking-wide uppercase mb-1">
                    Số dư khả dụng
                  </p>
                  <h3 className="text-4xl font-black tracking-tight drop-shadow-sm">
                    {formatCurrency(wallet?.balance || 0)}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10">
                  <MdAccountBalanceWallet size={20} className="text-zinc-100" />
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-end">
                <div>
                  <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-1">
                    Chủ tài khoản
                  </p>
                  <p className="font-bold text-lg tracking-wide">
                    {user?.fullName ||
                      user?.name ||
                      wallet?.username ||
                      "Thành viên VeloX"}
                  </p>
                </div>
                <div className="w-12 h-8 rounded bg-gradient-to-r from-zinc-300 to-zinc-400 opacity-80 rounded-md"></div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <MdCheckCircle size={18} />
              </div>
              <div>
                <h4 className="font-bold text-blue-900 text-sm mb-1">
                  Thanh toán qua VNPay Sandbox
                </h4>
                <p className="text-xs text-blue-800/80 leading-relaxed">
                  Tất cả giao dịch nạp tiền sẽ được chuyển hướng an toàn tới
                  cổng thanh toán VNPay.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-zinc-100 shadow-sm h-full">
            <h3 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center">
                <MdAddCircleOutline className="text-zinc-700" size={20} />
              </div>
              Nạp tiền vào ví
            </h3>

            <form onSubmit={handleAddFunds} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2">
                  Số tiền cần nạp (VNĐ)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-zinc-400">
                    đ
                  </span>
                  <input
                    type="text"
                    value={formatDisplayAmount(amountToAdd)}
                    onChange={handleAmountChange}
                    placeholder="Nhập số tiền..."
                    className="w-full pl-10 pr-4 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all font-bold text-xl text-zinc-900"
                  />
                </div>
                {amountToAdd && (
                  <p className="text-xs font-medium text-orange-600 mt-2 ml-1">
                    Thực nhận: {formatCurrency(parseFloat(amountToAdd))}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-500 mb-3">
                  Hoặc chọn nhanh:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {predefinedAmounts.map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => setAmountToAdd(preset.value.toString())}
                      className={`py-3 px-2 rounded-xl text-sm font-bold transition-all border-2 ${
                        amountToAdd === preset.value.toString()
                          ? "border-zinc-900 bg-zinc-900 text-white shadow-md"
                          : "border-zinc-100 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-auto">
                <button
                  type="submit"
                  disabled={
                    isAdding || !amountToAdd || parseFloat(amountToAdd) <= 0
                  }
                  className="w-full bg-blue-600 text-white px-6 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 group shadow-lg shadow-blue-600/30"
                >
                  {isAdding ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Đang kết nối VNPay...</span>
                    </>
                  ) : (
                    <>
                      Thanh toán qua VNPay
                      <MdAddCircleOutline
                        className="group-hover:scale-110 transition-transform"
                        size={20}
                      />
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-zinc-400 mt-4">
                  Bằng việc xác nhận, bạn đồng ý với Điều khoản nạp tiền của
                  VeloX
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletTab;
