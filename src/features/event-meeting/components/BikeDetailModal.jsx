// File: src/features/event-meeting/components/BikeDetailModal.jsx
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { reservationService } from "../../../services/reservationService";
import { depositService } from "../../../services/depositService";
import Modal from "../../../components/common/Modal";
import {
  MdInfoOutline,
  MdClose,
  MdPerson,
  MdSettingsSuggest,
  MdShoppingCartCheckout,
  MdImage,
  MdBlock,
  MdCheckCircle,
  MdWarning,
} from "react-icons/md";

const BikeImage = ({ src, alt, className }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [error, setError] = useState(false);
  useEffect(() => {
    setImgSrc(src);
    setError(false);
  }, [src]);
  const handleError = () => setError(true);
  if (error || !imgSrc)
    return (
      <div
        className={`${className} bg-gray-100 flex items-center justify-center text-gray-400`}
      >
        <MdImage size={24} />
      </div>
    );
  return (
    <img src={imgSrc} alt={alt} className={className} onError={handleError} />
  );
};

const BikeDetailModal = ({
  selectedViewBike,
  setSelectedViewBike,
  user,
  eventDetail,
  extractBikeDisplayData,
}) => {
  const navigate = useNavigate();

  const [hasDeposited, setHasDeposited] = useState(false);
  const [depositReservationId, setDepositReservationId] = useState(null);
  const [depositStatus, setDepositStatus] = useState(null);
  const [isDepositing, setIsDepositing] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Lấy ID xe hiện tại trên sàn (nếu có) để check trạng thái
  const targetListingId =
    selectedViewBike?.listing?.listingId || selectedViewBike?.listingId;

  // Kiểm tra trạng thái cọc khi mở Modal
  useEffect(() => {
    const checkExistingDeposit = async () => {
      if (!user || !selectedViewBike) return;

      // SỬA ĐỔI: So sánh qua eventBikeId trong trường hợp xe chưa có listing trên sàn
      const currentEventBikeId = selectedViewBike.eventBikeId;

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

          // Tìm theo EventBikeId trước, nếu không có thì tìm theo ListingId
          const matchedReservation = res.result.find((r) => {
            const isMatchEventBike =
              r.eventBicycle?.eventBikeId === currentEventBikeId;
            const isMatchListing =
              targetListingId &&
              (r.listingId || r.listing?.listingId) === targetListingId;

            return (
              (isMatchEventBike || isMatchListing) &&
              activeStatuses.includes(r.status)
            );
          });

          setHasDeposited(!!matchedReservation);
          if (matchedReservation) {
            setDepositReservationId(matchedReservation.reservationId);
            setDepositStatus(matchedReservation.status);
          } else {
            setDepositReservationId(null);
            setDepositStatus(null);
          }
        }
      } catch (error) {
        console.error("Lỗi kiểm tra đặt cọc:", error);
      }
    };
    if (selectedViewBike) {
      checkExistingDeposit();
    }
  }, [user, selectedViewBike, targetListingId]);

  // --- SỬA LẠI: HÀM XỬ LÝ ĐẶT CỌC DÀNH CHO SỰ KIỆN ---
  const handleDeposit = async () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để đặt cọc xe!");
      navigate("/login");
      return;
    }

    // Lấy EventBikeId thay vì ListingId
    const eventBikeId = selectedViewBike?.eventBikeId;

    if (!eventBikeId) {
      toast.error("Không tìm thấy thông tin xe trong sự kiện!");
      return;
    }

    setIsDepositing(true);
    try {
      // GỌI API ĐẶT CỌC SỰ KIỆN MÀ CHÚNG TA VỪA TẠO
      const res =
        await depositService.createDepositViaVNPayForEvent(eventBikeId);

      if (res.result?.paymentUrl) {
        window.location.href = res.result.paymentUrl;
      } else if (res.result?.deposit) {
        toast.success("Trừ tiền ví thành công! Đã đặt cọc.");
        setHasDeposited(true);
        setDepositStatus("Deposited");
        navigate("/profile?tab=transaction-manage"); // Điều hướng đến trang quản lý giao dịch
      } else {
        toast.success(res.message || "Tạo yêu cầu đặt cọc thành công");
      }
    } catch (error) {
      console.error("Lỗi đặt cọc xe sự kiện:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Lỗi khi tạo giao dịch đặt cọc",
      );
    } finally {
      setIsDepositing(false);
    }
  };

  // --- HÀM HỦY CỌC ---
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
      // F5 Lại trang hoặc đóng modal để update danh sách xe
      setSelectedViewBike(null);
    } catch (error) {
      console.error("Lỗi hủy đặt cọc:", error);
      toast.error(
        error.response?.data?.message || error.message || "Lỗi khi hủy đặt cọc",
      );
    } finally {
      setIsCancelling(false);
    }
  };

  if (!selectedViewBike) return null;

  const bikeInfo = extractBikeDisplayData(selectedViewBike);
  const isMyBike = user && bikeInfo.sellerId === user.userId;
  const userRole = String(user?.role || "").toUpperCase();
  const isStaff = userRole.includes("ADMIN") || userRole.includes("INSPECTOR");

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto py-10">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl flex flex-col relative my-auto animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white rounded-t-3xl z-10">
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <MdInfoOutline className="text-orange-500" /> Chi tiết xe tham gia
          </h3>
          <button
            onClick={() => setSelectedViewBike(null)}
            className="p-2 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
          >
            <MdClose size={24} />
          </button>
        </div>

        <div className="p-6 md:p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <BikeImage
                  src={bikeInfo.images[0]}
                  alt={bikeInfo.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {bikeInfo.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                  {bikeInfo.images.map((img, idx) => (
                    <BikeImage
                      key={idx}
                      src={img}
                      alt=""
                      className="w-20 h-20 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900 leading-tight mb-2">
                  {bikeInfo.title}
                </h2>
                <p className="text-3xl font-black text-orange-600">
                  {bikeInfo.price.toLocaleString()} đ
                </p>
              </div>

              <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-orange-500 shadow-sm shrink-0">
                  <MdPerson size={24} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">
                    Người đăng bán
                  </p>
                  <p className="font-bold text-slate-900">
                    {bikeInfo.sellerName}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <MdSettingsSuggest className="text-slate-400" /> Thông số kỹ
                  thuật
                </h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  {[
                    { label: "Thương hiệu", value: bikeInfo.brand },
                    { label: "Danh mục", value: bikeInfo.category },
                    { label: "Tình trạng", value: bikeInfo.condition },
                    { label: "Năm sản xuất", value: bikeInfo.year },
                    { label: "Chất liệu khung", value: bikeInfo.frameMaterial },
                    { label: "Size khung", value: bikeInfo.frameSize },
                    { label: "Màu sắc", value: bikeInfo.color },
                    { label: "Bánh xe", value: bikeInfo.wheelSize },
                    { label: "Vành xe", value: bikeInfo.rim },
                    { label: "Loại phanh", value: bikeInfo.brakeType },
                    { label: "Loại phuộc", value: bikeInfo.forkType },
                    { label: "Giảm xóc", value: bikeInfo.shockAbsorber },
                    { label: "Bộ truyền động", value: bikeInfo.drivetrain },
                    { label: "Số líp/tốc độ", value: bikeInfo.numberOfGears },
                    { label: "Đĩa", value: bikeInfo.chainring },
                    { label: "Xích", value: bikeInfo.chain },
                    { label: "Ghi đông", value: bikeInfo.handlebar },
                    { label: "Yên xe", value: bikeInfo.saddle },
                    { label: "Trọng lượng", value: bikeInfo.weight },
                  ].map((spec, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50 p-3 rounded-lg border border-slate-100"
                    >
                      <span className="block text-slate-400 text-xs mb-1">
                        {spec.label}
                      </span>
                      <span
                        className="font-bold text-slate-800 line-clamp-1"
                        title={spec.value}
                      >
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2">Mô tả thêm</h4>
                <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed whitespace-pre-wrap">
                  {bikeInfo.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex flex-wrap justify-end gap-3 rounded-b-3xl">
          <button
            onClick={() => setSelectedViewBike(null)}
            className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-100 transition-colors"
          >
            Đóng
          </button>

          {eventDetail.status !== "completed" && (
            <>
              {isStaff ? (
                <button
                  disabled
                  className="px-6 py-2.5 bg-slate-200 text-slate-500 rounded-xl font-bold cursor-not-allowed flex items-center gap-2"
                >
                  <MdBlock size={20} /> Tài khoản nội bộ
                </button>
              ) : isMyBike ? (
                <span className="px-6 py-2.5 bg-slate-200 text-slate-500 rounded-xl font-bold cursor-not-allowed">
                  Đây là xe của bạn
                </span>
              ) : hasDeposited ? (
                <>
                  {depositStatus !== "Scheduled" && (
                    <button
                      onClick={handleCancelDeposit}
                      disabled={isCancelling}
                      className="px-6 py-2.5 bg-white hover:bg-red-50 text-gray-600 hover:text-red-600 border border-slate-200 hover:border-red-200 font-bold rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      {isCancelling ? "Đang hủy..." : "Hủy đặt cọc"}
                    </button>
                  )}
                  <button
                    disabled
                    className="flex items-center gap-2 px-8 py-2.5 bg-gray-200 text-gray-500 rounded-xl font-bold cursor-not-allowed"
                  >
                    <MdCheckCircle size={20} /> Đã đặt cọc
                  </button>
                </>
              ) : (
                <button
                  onClick={handleDeposit}
                  disabled={isDepositing}
                  className="flex items-center gap-2 px-8 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold shadow-lg disabled:opacity-50 disabled:cursor-wait transition-all"
                >
                  <MdShoppingCartCheckout size={20} />{" "}
                  {isDepositing ? "Đang xử lý..." : "Đặt cọc ngay"}
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* --- MODAL XÁC NHẬN HỦY CỌC --- */}
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
        <div className="flex flex-col items-center text-center pb-4 pt-2 relative z-[70]">
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

export default BikeDetailModal;
