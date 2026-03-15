import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { bikeService } from "../../../services/bikeService";
import { depositService } from "../../../services/depositService";
import { reservationService } from "../../../services/reservationService";
import formatCurrency from "../../../utils/formatCurrency";
import { useAuth } from "../../../hooks/useAuth";
import { useWishlist } from "../../../context/WishlistContext";
import toast, { Toaster } from "react-hot-toast";
import Modal from "../../../components/common/Modal";

import {
  MdLocationOn,
  MdVerified,
  MdSecurity,
  MdInfoOutline,
  MdCheckCircle,
  MdArrowForward,
  MdStraighten,
  MdDonutLarge,
  MdSpeed,
  MdFitnessCenter,
  MdCalendarToday,
  MdErrorOutline,
  MdBlock,
  MdCancel,
  MdColorLens,
  MdPrecisionManufacturing,
  MdHardware,
  MdEdit,
  MdEventSeat,
  MdSettings,
  MdLink,
  MdLinearScale,
  MdRadioButtonUnchecked,
  MdCompress,
  MdFavoriteBorder,
  MdFavorite,
  MdWarning,
} from "react-icons/md";

const BikeDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDepositing, setIsDepositing] = useState(false);
  const [hasDeposited, setHasDeposited] = useState(false);
  const [depositReservationId, setDepositReservationId] = useState(null);
  const [depositStatus, setDepositStatus] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const [timestamp] = useState(new Date().getTime());

  useEffect(() => {
    const fetchBikeDetail = async () => {
      try {
        const response = await bikeService.getBikeListingById(id);
        if (response && response.result) {
          setBike(response.result);
        }
      } catch (error) {
        console.error("Lỗi tải chi tiết xe:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchBikeDetail();
  }, [id]);

  useEffect(() => {
    const checkExistingDeposit = async () => {
      if (!user || !id) return;
      try {
        const res = await reservationService.getMyReservations();
        if (res?.result) {
          const activeStatuses = [
            "Waiting_Payment",
            "Deposited",
            "Scheduled",
            "Pending",
            "Paid",
          ];
          const matchedReservation = res.result.find((r) => {
            const listingId = r.listingId || r.listing?.listingId;
            return (
              String(listingId) === String(id) &&
              activeStatuses.includes(r.status)
            );
          });
          setHasDeposited(!!matchedReservation);
          if (matchedReservation) {
            setDepositReservationId(matchedReservation.reservationId);
            setDepositStatus(matchedReservation.status);
          }
        }
      } catch (error) {
        console.error("Lỗi kiểm tra đặt cọc:", error);
      }
    };
    checkExistingDeposit();
  }, [user, id]);

  const userRole = String(user?.role || "").toUpperCase();
  const isStaff = userRole.includes("ADMIN") || userRole.includes("INSPECTOR");

  const isOwner =
    user &&
    bike &&
    (user.username === bike.sellerName || user.userId === bike.sellerId);

  const handleDeposit = async () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để đặt cọc xe!");
      navigate("/login");
      return;
    }

    setIsDepositing(true);
    try {
      const res = await depositService.createDepositViaVNPay(bike.listingId);
      if (res.result?.paymentUrl) {
        window.location.href = res.result.paymentUrl;
      } else if (res.result?.deposit) {
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

  const handleCancelDeposit = () => {
    if (!depositReservationId) return;
    setShowCancelModal(true);
  };

  const confirmCancelDeposit = async () => {
    if (!depositReservationId) return;
    setIsCancelling(true);
    try {
      await reservationService.cancelReservation(depositReservationId);
      toast.success("Đã hủy đặt cọc thành công!");
      setHasDeposited(false);
      setDepositReservationId(null);
      setShowCancelModal(false);
    } catch (error) {
      console.error("Lỗi hủy đặt cọc:", error);
      toast.error(
        error.response?.data?.message || error.message || "Lỗi khi hủy đặt cọc",
      );
    } finally {
      setIsCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!bike) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-500">
        Không tìm thấy xe
      </div>
    );
  }

  const displayImageUrl = bike.image_url
    ? `${bike.image_url}${bike.image_url.includes("?") ? "&" : "?"}t=${timestamp}`
    : "https://placehold.co/800x600/f4f4f5/a1a1aa?text=No+Image";

  return (
    <div className="min-h-screen bg-gray-50 py-8 font-sans">
      <Toaster />
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-orange-600 transition-colors">
            Trang chủ
          </Link>
          <span>/</span>
          <Link to="/bikes" className="hover:text-orange-600 transition-colors">
            Mua xe
          </Link>
          <span>/</span>
          <span className="text-zinc-900 font-medium truncate max-w-[200px]">
            {bike.title}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm relative group">
              <div className="aspect-[16/10] overflow-hidden bg-gray-100">
                <img
                  src={displayImageUrl}
                  alt={bike.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-zinc-900 text-sm font-bold px-3 py-1.5 rounded-lg shadow-sm border border-gray-100">
                Độ mới:{" "}
                <span className="text-orange-600">{bike.condition}</span>
              </div>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
              <h1 className="text-2xl md:text-3xl font-black text-zinc-900 mb-4 leading-tight">
                {bike.title}
              </h1>

              <div className="flex flex-wrap gap-3 mb-8">
                <span className="px-3 py-1 bg-gray-100 text-zinc-600 rounded-md text-sm font-medium">
                  Thương hiệu:{" "}
                  <strong>{bike.brandName || "Đang cập nhật"}</strong>
                </span>
                <span className="px-3 py-1 bg-gray-100 text-zinc-600 rounded-md text-sm font-medium">
                  Loại xe:{" "}
                  <strong>{bike.categoryName || "Đang cập nhật"}</strong>
                </span>
                <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded-md text-sm font-medium flex items-center gap-1">
                  <MdLocationOn /> VeloX Hub (Kiểm tra xe trực tiếp)
                </span>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
                  <MdInfoOutline className="text-orange-600" /> Thông số kỹ
                  thuật
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-500 text-xs mb-1 flex items-center gap-1">
                      <MdStraighten /> Size Khung
                    </span>
                    <span className="font-semibold text-zinc-800 block truncate">
                      {bike.frameSize || "N/A"}
                    </span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-500 text-xs mb-1 flex items-center gap-1">
                      <MdDonutLarge /> Size Bánh
                    </span>
                    <span className="font-semibold text-zinc-800 block truncate">
                      {bike.wheelSize || "N/A"}
                    </span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-500 text-xs mb-1 flex items-center gap-1">
                      <MdCalendarToday /> Năm SX
                    </span>
                    <span className="font-semibold text-zinc-800 block truncate">
                      {bike.yearManufacture
                        ? new Date(bike.yearManufacture).getFullYear()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-500 text-xs mb-1 flex items-center gap-1">
                      <MdErrorOutline /> Phanh
                    </span>
                    <span className="font-semibold text-zinc-800 block truncate">
                      {bike.brakeType || "N/A"}
                    </span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-500 text-xs mb-1 flex items-center gap-1">
                      <MdSpeed /> Bộ đề
                    </span>
                    <span className="font-semibold text-zinc-800 block truncate">
                      {bike.drivetrain || bike.numberOfGears || "N/A"}
                    </span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-500 text-xs mb-1 flex items-center gap-1">
                      <MdColorLens /> Màu sắc
                    </span>
                    <span className="font-semibold text-zinc-800 block truncate">
                      {bike.color || "N/A"}
                    </span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-500 text-xs mb-1 flex items-center gap-1">
                      <MdPrecisionManufacturing /> Chất liệu khung
                    </span>
                    <span className="font-semibold text-zinc-800 block truncate">
                      {bike.frameMaterial || "N/A"}
                    </span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-500 text-xs mb-1 flex items-center gap-1">
                      <MdHardware /> Loại Phuộc
                    </span>
                    <span className="font-semibold text-zinc-800 block truncate">
                      {bike.forkType || "N/A"}
                    </span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-500 text-xs mb-1 flex items-center gap-1">
                      <MdFitnessCenter /> Trọng lượng
                    </span>
                    <span className="font-semibold text-zinc-800 block truncate">
                      {bike.weight ? `${bike.weight} kg` : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-zinc-900 mb-2">
                  Mô tả từ người bán
                </h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {bike.description ||
                    "Người bán chưa cung cấp mô tả chi tiết."}
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={`https://ui-avatars.com/api/?name=${bike.sellerName || "Seller"}&background=ea580c&color=fff`}
                  alt="Seller Avatar"
                  className="w-14 h-14 rounded-full border-2 border-orange-100"
                />
                <div>
                  <h4 className="font-bold text-zinc-900 text-lg">
                    {bike.sellerName || "Người dùng Ẩn danh"}
                  </h4>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <MdVerified className="text-blue-500" /> Thành viên hệ thống
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-400 block">Đăng ngày</span>
                <span className="text-sm font-medium text-zinc-700">
                  {bike.createdAt
                    ? new Date(bike.createdAt).toLocaleDateString("vi-VN")
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/50">
                <div className="mb-6 border-b border-gray-100 pb-4">
                  <p className="text-sm text-gray-500 mb-1">Giá niêm yết</p>
                  <div className="flex items-end gap-3">
                    <span className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">
                      {formatCurrency(bike.price || 0)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {isStaff ? (
                    <button
                      disabled
                      className="w-full bg-gray-100 text-gray-400 font-bold py-4 rounded-xl cursor-not-allowed flex items-center justify-center gap-2 border border-gray-200"
                    >
                      <MdBlock size={20} />
                      Tài khoản nội bộ không thể mua xe
                    </button>
                  ) : isOwner ? (
                    <Link
                      to={`/edit-bike/${bike.listingId || id}`}
                      className="w-full bg-orange-100 hover:bg-orange-200 text-orange-700 font-bold py-4 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 group"
                    >
                      <MdEdit size={20} />
                      Chỉnh sửa tin của bạn
                    </Link>
                  ) : hasDeposited ? (
                    <>
                      <button
                        disabled
                        className="w-full bg-gray-100 text-gray-400 font-bold py-4 rounded-xl cursor-not-allowed flex items-center justify-center gap-2 border border-gray-200"
                      >
                        <MdCheckCircle size={20} />
                        Bạn đã đặt cọc xe này rồi
                      </button>

                      {depositStatus !== "Scheduled" && (
                        <button
                          onClick={handleCancelDeposit}
                          disabled={isCancelling}
                          className="w-full bg-white hover:bg-red-50 text-gray-600 hover:text-red-600 border border-gray-200 hover:border-red-200 font-medium py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-wait"
                        >
                          {isCancelling ? "Đang hủy..." : "Hủy đặt cọc"}
                        </button>
                      )}

                      <button
                        onClick={() => bike && toggleWishlist(bike.listingId)}
                        className={`w-full font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 border ${
                          bike && isInWishlist(bike.listingId)
                            ? "bg-red-50 text-red-500 border-red-200 hover:bg-red-100"
                            : "bg-white text-zinc-600 border-gray-200 hover:border-red-300 hover:text-red-500"
                        }`}
                      >
                        {bike && isInWishlist(bike.listingId) ? (
                          <>
                            <MdFavorite size={20} /> Đã yêu thích
                          </>
                        ) : (
                          <>
                            <MdFavoriteBorder size={20} /> Thêm vào yêu thích
                          </>
                        )}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleDeposit}
                        disabled={isDepositing}
                        className="w-full bg-zinc-900 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-gray-200 hover:shadow-orange-200 flex items-center justify-center gap-2 group animate-in fade-in disabled:opacity-70 disabled:cursor-wait"
                      >
                        {isDepositing
                          ? "Đang xử lý..."
                          : "Đặt Cọc Giao Dịch Ngay"}
                        {!isDepositing && (
                          <MdArrowForward className="group-hover:translate-x-1 transition-transform" />
                        )}
                      </button>

                      <button
                        onClick={() => bike && toggleWishlist(bike.listingId)}
                        className={`w-full font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 border ${
                          bike && isInWishlist(bike.listingId)
                            ? "bg-red-50 text-red-500 border-red-200 hover:bg-red-100"
                            : "bg-white text-zinc-600 border-gray-200 hover:border-red-300 hover:text-red-500"
                        }`}
                      >
                        {bike && isInWishlist(bike.listingId) ? (
                          <>
                            <MdFavorite size={20} /> Đã yêu thích
                          </>
                        ) : (
                          <>
                            <MdFavoriteBorder size={20} /> Thêm vào yêu thích
                          </>
                        )}
                      </button>

                      <p className="text-xs text-gray-500 text-center px-2 leading-relaxed mt-2">
                        *Hệ thống sẽ yêu cầu thanh toán cọc (10%). Sau đó Admin
                        sẽ xếp lịch hẹn kiểm định xe với người bán.
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
                <h4 className="font-bold text-blue-800 flex items-center gap-2 mb-3">
                  <MdSecurity /> An toàn tuyệt đối
                </h4>
                <ul className="space-y-2 text-sm text-blue-700/80">
                  <li className="flex gap-2 items-start">
                    <MdCheckCircle className="mt-0.5 shrink-0" />
                    <span>Tiền cọc được giữ an toàn tại hệ thống VeloX.</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <MdCheckCircle className="mt-0.5 shrink-0" />
                    <span>
                      Giao dịch trực tiếp với sự kiểm chứng của chuyên gia.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title=""
        footer={
          <div className="flex w-full gap-3 mt-2">
            <button
              onClick={() => setShowCancelModal(false)}
              className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
            >
              Hủy qua
            </button>
            <button
              onClick={confirmCancelDeposit}
              disabled={isCancelling}
              className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isCancelling ? "Đang xử lý..." : "Xác nhận hủy"}
            </button>
          </div>
        }
      >
        <div className="flex flex-col items-center text-center pb-4 pt-2">
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
            </span>
            . Hành động này không thể thay đổi sau khi xác nhận.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default BikeDetailPage;
