import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import formatCurrency from "../../../utils/formatCurrency";
import { useWishlist } from "../../../context/WishlistContext";
import { useAuth } from "../../../hooks/useAuth";
import { depositService } from "../../../services/depositService";
import toast from "react-hot-toast";
import {
  MdLocationOn,
  MdHandshake,
  MdFavoriteBorder,
  MdFavorite,
  MdAccessTime,
} from "react-icons/md";

const BikeCard = ({ bike, showDepositButton = true }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isDepositing, setIsDepositing] = useState(false);

  // Chống lỗi nếu bike là undefined
  if (!bike) return null;

  const liked = isInWishlist(bike.listingId);
  const userRole = String(user?.role || "").toUpperCase();
  const isStaff =
    userRole.includes("ADMIN") || userRole.includes("INSPECTOR");
  const canShowDepositButton = showDepositButton && !isStaff;

  // Xử lý ảnh
  const displayImage =
    bike.image_url && bike.image_url.trim() !== ""
      ? bike.image_url
      : bike.imageUrl && bike.imageUrl.trim() !== ""
        ? bike.imageUrl
        : "https://placehold.co/400x300/eeeeee/999999?text=Chua+co+anh";

  // Xử lý bấm nút Giao Dịch
  const handleDeposit = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Chặn sự kiện click thẻ Link bọc bên ngoài

    if (!user) {
      toast.error("Vui lòng đăng nhập để đặt cọc xe!");
      navigate("/login");
      return;
    }

    const isOwner =
      user.username === bike.sellerName || user.userId === bike.sellerId;

    if (isStaff) {
      toast.error("Tài khoản quản trị/nội bộ không thể đặt mua xe.");
      return;
    }

    if (isOwner) {
      toast.error("Bạn không thể tự đặt cọc xe của chính mình.");
      return;
    }

    setIsDepositing(true);
    try {
      const res = await depositService.createDepositViaVNPay(bike.listingId);
      if (res.result?.paymentUrl) {
        // Chuyển sang VNPay nếu ví không đủ tiền
        window.location.href = res.result.paymentUrl;
      } else if (res.result?.deposit) {
        // Trừ tiền ví nội bộ thành công
        toast.success("Trừ tiền ví thành công! Đã đặt cọc.");
        navigate("/profile?tab=transaction-manage");
      } else {
        toast.success(res.message || "Tạo yêu cầu thành công");
      }
    } catch (error) {
      console.error("Lỗi đặt cọc:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Lỗi khi tạo giao dịch đặt cọc",
      );
    } finally {
      setIsDepositing(false);
    }
  };

  return (
    <Link
      to={`/bikes/${bike.listingId}`}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-orange-200 transition-all duration-300 flex flex-col h-full relative"
    >
      {/* --- 1. PHẦN ẢNH (Image Section) --- */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 shrink-0">
        <img
          src={displayImage}
          alt={bike.title || "Bike"}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />

        {/* Nút Tim */}
        <button
          className={`absolute bottom-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-md ${
            liked
              ? "bg-red-500 text-white scale-110"
              : "bg-white text-gray-400 hover:text-red-500 hover:scale-110 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
          } duration-300 z-10`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(bike.listingId);
          }}
          title={liked ? "Bỏ yêu thích" : "Thêm yêu thích"}
        >
          {liked ? <MdFavorite size={18} /> : <MdFavoriteBorder size={18} />}
        </button>
      </div>

      {/* --- 2. PHẦN THÔNG TIN (Info Section) --- */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        {/* Dòng 1: Hãng & Loại xe */}
        <div className="flex justify-between items-start mb-2.5 gap-2">
          <span className="text-[10px] font-bold tracking-wider uppercase text-zinc-500 bg-zinc-100 px-2 py-1 rounded-md line-clamp-1">
            {bike.brandName || bike.brand || "Khác"} •{" "}
            {bike.categoryName || bike.category || "Xe đạp"}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-zinc-400 font-medium whitespace-nowrap shrink-0 mt-0.5">
            <MdLocationOn size={14} />{" "}
            {bike.location ? bike.location.split(",")[0] : "Tp.HCM"}
          </span>
        </div>

        {/* Tên xe */}
        <h3 className="font-bold text-base text-zinc-900 line-clamp-2 mb-1 leading-snug group-hover:text-orange-600 transition-colors h-[2.75rem]">
          {bike.title || "Đang cập nhật tên xe..."}
        </h3>

        {/* Giá & Nút Yêu cầu Giao dịch */}
        <div className="mt-auto pt-3 flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-black text-orange-600 tracking-tight">
              {formatCurrency(bike.price || 0)}
            </span>
          </div>

          {/* {canShowDepositButton && (
            <button
              disabled={isDepositing}
              className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 text-blue-500 hover:bg-blue-600 hover:text-white hover:border-blue-600 flex items-center justify-center transition-all duration-300 shadow-sm group/btn relative z-10 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Gửi yêu cầu giao dịch"
              onClick={handleDeposit}
            >
              {isDepositing ? (
                <div className="w-4 h-4 border-2 border-blue-500 group-hover/btn:border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <MdHandshake size={18} />
              )}

              {!isDepositing && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
                  Yêu cầu đặt cọc
                </span>
              )}
            </button>
          )} */}
        </div>

        {/* Footer Card */}
        <div className="mt-4 pt-3 border-t border-dashed border-gray-100 flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-500 truncate max-w-[120px]">
            Bởi:{" "}
            <span className="font-bold text-zinc-700">
              {bike.sellerName || "Người dùng"}
            </span>
          </span>
          <span className="flex items-center gap-1 text-[10px] font-medium text-zinc-400 ml-auto">
            <MdAccessTime size={12} />{" "}
            {bike.createdAt
              ? new Date(bike.createdAt).toLocaleDateString("vi-VN")
              : "Mới đăng"}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default BikeCard;
