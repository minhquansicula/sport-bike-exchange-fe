import React, { useState, useEffect } from "react";
import {
  MdAttachMoney,
  MdSecurity,
  MdEdit,
  MdCheck,
  MdClose,
  MdTrendingUp,
} from "react-icons/md";
import { toast, Toaster } from "react-hot-toast";
import { systemConfigService } from "../../../services/systemConfigService";
import formatCurrency from "../../../utils/formatCurrency";

const AdminPricingPage = () => {
  // --- STATE: PHÍ SÀN (Phí Đăng Bài) ---
  const [listingFee, setListingFee] = useState(5);
  const [tempListingFee, setTempListingFee] = useState(5);
  const [isEditingListing, setIsEditingListing] = useState(false);

  // --- STATE: PHÍ CỌC (Tiền Cọc) ---
  const [depositFee, setDepositFee] = useState(10);
  const [tempDepositFee, setTempDepositFee] = useState(10);
  const [isEditingDeposit, setIsEditingDeposit] = useState(false);

  const [loading, setLoading] = useState(true);
  const examplePrice = 15000000; // Giá ví dụ minh họa: 15 củ

  // Load cấu hình từ Backend khi mở trang
  useEffect(() => {
    const fetchConfigs = async () => {
      setLoading(true);
      try {
        const [feeRes, depositRes] = await Promise.all([
          systemConfigService.getConfigValue("Phí_Sàn").catch(() => null),
          systemConfigService.getConfigValue("Phí_Cọc").catch(() => null),
        ]);

        if (feeRes?.result?.value !== undefined) {
          setListingFee(feeRes.result.value);
          setTempListingFee(feeRes.result.value);
        }
        if (depositRes?.result?.value !== undefined) {
          setDepositFee(depositRes.result.value);
          setTempDepositFee(depositRes.result.value);
        }
      } catch (error) {
        console.error("Lỗi tải cấu hình:", error);
        toast.error("Không thể tải cấu hình từ máy chủ.");
      } finally {
        setLoading(false);
      }
    };
    fetchConfigs();
  }, []);

  // --- HANDLERS: LƯU PHÍ SÀN ---
  const handleSaveListingFee = async () => {
    const loadingToast = toast.loading("Đang lưu phí sàn...");
    try {
      await systemConfigService.updateConfigValue("Phí_Sàn", tempListingFee);
      setListingFee(tempListingFee);
      setIsEditingListing(false);
      toast.success(`Đã cập nhật phí đăng bài thành ${tempListingFee}%`, {
        id: loadingToast,
      });
    } catch (error) {
      toast.error("Lỗi khi lưu phí sàn!", { id: loadingToast });
    }
  };

  // --- HANDLERS: LƯU PHÍ CỌC ---
  const handleSaveDepositFee = async () => {
    const loadingToast = toast.loading("Đang lưu phần trăm cọc...");
    try {
      await systemConfigService.updateConfigValue("Phí_Cọc", tempDepositFee);
      setDepositFee(tempDepositFee);
      setIsEditingDeposit(false);
      toast.success(`Đã cập nhật phí cọc thành ${tempDepositFee}%`, {
        id: loadingToast,
      });
    } catch (error) {
      toast.error("Lỗi khi lưu phí cọc!", { id: loadingToast });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-20 space-y-8 animate-in fade-in">
      <Toaster />
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Cấu hình Tài chính
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Quản lý tỷ lệ thu phí sàn và quy định phần trăm tiền cọc
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* --- CARD 1: PHÍ ĐĂNG BÀI (PHÍ SÀN) --- */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
              <MdAttachMoney size={26} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Phí Đăng Bài</h3>
              <p className="text-xs text-gray-500">
                Trừ phí khi xe được duyệt lên sàn
              </p>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center py-6 relative z-10">
            {isEditingListing ? (
              <div className="flex flex-col items-center gap-4 w-full animate-in fade-in zoom-in duration-200">
                <div className="flex items-baseline gap-1 border-b-2 border-blue-500 pb-1">
                  <input
                    type="number"
                    value={tempListingFee}
                    onChange={(e) => setTempListingFee(e.target.value)}
                    className="text-6xl font-black text-blue-600 w-32 text-center bg-transparent focus:outline-none"
                    autoFocus
                  />
                  <span className="text-3xl font-bold text-blue-300">%</span>
                </div>
              </div>
            ) : (
              <div className="flex items-baseline gap-1 animate-in fade-in zoom-in duration-200">
                <span className="text-7xl font-black text-gray-900 tracking-tighter">
                  {listingFee}
                </span>
                <span className="text-3xl font-bold text-gray-300">%</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 relative z-10">
            {isEditingListing ? (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setTempListingFee(listingFee);
                    setIsEditingListing(false);
                  }}
                  className="flex items-center justify-center gap-2 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl font-bold transition-all"
                >
                  <MdClose size={20} /> Hủy
                </button>
                <button
                  onClick={handleSaveListingFee}
                  className="flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-200 transition-all"
                >
                  <MdCheck size={20} /> Lưu
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditingListing(true)}
                className="w-full flex items-center justify-center gap-2 py-3 border-2 border-gray-100 hover:border-blue-100 hover:bg-blue-50 text-gray-600 hover:text-blue-600 rounded-xl font-bold transition-all group"
              >
                <MdEdit
                  size={20}
                  className="group-hover:scale-110 transition-transform"
                />
                Chỉnh sửa phần trăm
              </button>
            )}
          </div>
        </div>

        {/* --- CARD 2: PHÍ ĐẶT CỌC --- */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-green-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center shadow-sm">
              <MdSecurity size={26} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Tiền Đặt Cọc</h3>
              <p className="text-xs text-gray-500">
                Khách phải cọc để giữ xe giao dịch
              </p>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center py-6 relative z-10">
            {isEditingDeposit ? (
              <div className="flex flex-col items-center gap-4 w-full animate-in fade-in zoom-in duration-200">
                <div className="flex items-baseline gap-1 border-b-2 border-green-500 pb-1">
                  <input
                    type="number"
                    value={tempDepositFee}
                    onChange={(e) => setTempDepositFee(e.target.value)}
                    className="text-6xl font-black text-green-600 w-32 text-center bg-transparent focus:outline-none"
                    autoFocus
                  />
                  <span className="text-3xl font-bold text-green-300">%</span>
                </div>
              </div>
            ) : (
              <div className="flex items-baseline gap-1 animate-in fade-in zoom-in duration-200">
                <span className="text-7xl font-black text-gray-900 tracking-tighter">
                  {depositFee}
                </span>
                <span className="text-3xl font-bold text-gray-300">%</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 relative z-10">
            {isEditingDeposit ? (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setTempDepositFee(depositFee);
                    setIsEditingDeposit(false);
                  }}
                  className="flex items-center justify-center gap-2 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl font-bold transition-all"
                >
                  <MdClose size={20} /> Hủy
                </button>
                <button
                  onClick={handleSaveDepositFee}
                  className="flex items-center justify-center gap-2 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg shadow-green-200 transition-all"
                >
                  <MdCheck size={20} /> Lưu
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditingDeposit(true)}
                className="w-full flex items-center justify-center gap-2 py-3 border-2 border-gray-100 hover:border-green-100 hover:bg-green-50 text-gray-600 hover:text-green-600 rounded-xl font-bold transition-all group"
              >
                <MdEdit
                  size={20}
                  className="group-hover:scale-110 transition-transform"
                />
                Chỉnh sửa phần trăm
              </button>
            )}
          </div>
        </div>
      </div>

      {/* --- VÍ DỤ MINH HỌA --- */}
      <div className="mt-8 p-6 rounded-2xl bg-zinc-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between shadow-xl gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl">
            💡
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">
              Ví dụ minh họa hệ thống
            </p>
            <p className="text-base mt-1 text-gray-200">
              Giả sử người bán đăng xe giá:{" "}
              <strong className="text-white text-xl ml-1">
                {formatCurrency(examplePrice)}
              </strong>
            </p>
          </div>
        </div>

        <div className="flex gap-6 text-right">
          <div>
            <p className="text-xs text-gray-400 mb-1">
              Người bán phải nộp phí:
            </p>
            <p className="text-2xl font-bold text-blue-400">
              {formatCurrency((examplePrice * listingFee) / 100)}
            </p>
          </div>
          <div className="w-px bg-gray-700"></div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Người mua phải cọc:</p>
            <p className="text-2xl font-bold text-green-400">
              {formatCurrency((examplePrice * depositFee) / 100)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPricingPage;
