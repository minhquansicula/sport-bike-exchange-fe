import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { eventService } from "../../../services/eventService";
import { eventBicycleService } from "../../../services/eventBicycleService";
import { depositService } from "../../../services/depositService";
import { systemConfigService } from "../../../services/systemConfigService";
import toast, { Toaster } from "react-hot-toast";
import { MdWarning, MdShoppingCartCheckout } from "react-icons/md";

import EventHeroBanner from "../components/EventHeroBanner";
import EventBikesGrid from "../components/EventBikesGrid";
import BikeDetailModal from "../components/BikeDetailModal";
import RegisterBikeModal from "../components/RegisterBikeModal";

const EventDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [eventDetail, setEventDetail] = useState(null);
  const [eventBikes, setEventBikes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedViewBike, setSelectedViewBike] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const [isDepositing, setIsDepositing] = useState(false);
  const [showDepositFeeModal, setShowDepositFeeModal] = useState(false);
  const [depositTarget, setDepositTarget] = useState(null);
  const [depositPercent, setDepositPercent] = useState(10); // Mặc định 10%

  const fetchEventData = useCallback(async () => {
    try {
      setLoading(true);
      const [eventRes, bikesRes, configRes] = await Promise.all([
        eventService.getEventById(id),
        eventBicycleService
          .getAllEventBicycles(true)
          .catch(() => ({ result: [] })),
        systemConfigService.getConfigValue("Phí_Cọc").catch(() => null),
      ]);

      if (eventRes?.result) setEventDetail(eventRes.result);

      // Cập nhật phần trăm cọc từ API
      if (configRes?.result?.value) {
        setDepositPercent(configRes.result.value);
      }
      const eventIdNum = parseInt(id);
      const approvedBikes = (bikesRes?.result || []).filter((b) => {
        const bikeEventId = b.eventId ?? b.event?.eventId;
        const bikeStatus = b.status?.toLowerCase();
        return bikeEventId === eventIdNum && bikeStatus === "available";
      });
      setEventBikes(approvedBikes);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu sự kiện:", error);
      toast.error("Không thể tải thông tin sự kiện");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEventData();
  }, [fetchEventData]);

  const handleOpenRegister = () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để đăng ký bán xe tại sự kiện này!");
      navigate("/login");
      return;
    }
    setShowRegisterModal(true);
  };

  const handlePreDeposit = (eventBike) => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để đặt cọc xe!");
      navigate("/login");
      return;
    }

    const eventBikeId = eventBike?.eventBikeId;
    if (!eventBikeId) {
      toast.error("Không tìm thấy thông tin xe trong sự kiện!");
      return;
    }

    setDepositTarget(eventBike);
    setShowDepositFeeModal(true);
  };

  const handleConfirmDeposit = async () => {
    if (!depositTarget?.eventBikeId) return;

    setIsDepositing(true);
    try {
      const res = await depositService.createDepositViaVNPayForEvent(
        depositTarget.eventBikeId,
      );

      if (res.result?.paymentUrl) {
        toast.loading("Đang chuyển hướng sang VNPay...");
        window.location.href = res.result.paymentUrl;
      } else if (res.result?.deposit) {
        toast.success("Trừ tiền ví thành công! Đã đặt cọc.");
        setShowDepositFeeModal(false);
        setDepositTarget(null);
        navigate("/profile?tab=transaction-manage");
      } else {
        toast.success(res.message || "Tạo yêu cầu thành công");
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

  const extractBikeDisplayData = (item) => {
    const eventBike = item;
    const listing = eventBike.listing || {};
    const bicycle = eventBike.bicycle || listing.bicycle || {};

    return {
      title:
        eventBike.title ||
        listing.title ||
        bicycle.model ||
        "Xe đạp tham gia sự kiện",
      price: eventBike.price || listing.price || bicycle.price || 0,
      description:
        listing.description ||
        bicycle.description ||
        "Xe đăng ký trực tiếp sự kiện chưa có mô tả.",
      images: eventBike.image_url
        ? eventBike.image_url.split(",")
        : listing.image_url
          ? listing.image_url.split(",")
          : bicycle.image_url
            ? bicycle.image_url.split(",")
            : [
                "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=800&q=80",
              ],
      condition:
        eventBike.condition ||
        listing.condition ||
        bicycle.condition ||
        "Không rõ",
      brand: bicycle.brand?.name || bicycle.brandName || "Không rõ",
      category: eventBike.bikeType || bicycle.category?.name || "Không rõ",
      year: bicycle.yearManufacture || "Chưa cập nhật",
      frameSize: bicycle.frameSize || "Chưa cập nhật",
      frameMaterial: bicycle.frameMaterial || "Chưa cập nhật",
      color: bicycle.color || "Chưa cập nhật",
      wheelSize: bicycle.wheelSize || "Chưa cập nhật",
      rim: bicycle.rim || "Chưa cập nhật",
      brakeType: bicycle.brakeType || "Chưa cập nhật",
      forkType: bicycle.forkType || "Chưa cập nhật",
      shockAbsorber: bicycle.shockAbsorber || "Chưa cập nhật",
      drivetrain: bicycle.drivetrain || "Chưa cập nhật",
      numberOfGears: bicycle.numberOfGears || "Chưa cập nhật",
      chainring: bicycle.chainring || "Chưa cập nhật",
      chain: bicycle.chain || "Chưa cập nhật",
      handlebar: bicycle.handlebar || "Chưa cập nhật",
      saddle: bicycle.saddle || "Chưa cập nhật",
      weight: bicycle.weight ? `${bicycle.weight} kg` : "Chưa cập nhật",
      sellerName:
        eventBike.sellerName || eventBike.seller?.fullName || "Ẩn danh",
      sellerId: eventBike.sellerId || eventBike.seller?.userId,
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-bold tracking-wide">
          Đang tải thông tin sự kiện...
        </p>
      </div>
    );
  }

  if (!eventDetail) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center px-4">
        <MdWarning size={64} className="text-slate-300 mb-4" />
        <h2 className="text-2xl font-black text-slate-800 mb-2">
          Sự kiện không tồn tại
        </h2>
        <button
          onClick={() => navigate("/events")}
          className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold mt-4"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  const fallbackImage =
    "https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&q=80&w=2000";
  const mapUrl = `http://googleusercontent.com/maps.google.com/maps?q=${eventDetail.latitude ? `${eventDetail.latitude},${eventDetail.longitude}` : encodeURIComponent(eventDetail.address || eventDetail.location)}`;

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans selection:bg-orange-500 selection:text-white">
      <Toaster position="top-center" reverseOrder={false} />
      <EventHeroBanner
        eventDetail={eventDetail}
        handleOpenRegister={handleOpenRegister}
        fallbackImage={fallbackImage}
        mapUrl={mapUrl}
      />

      <EventBikesGrid
        eventBikes={eventBikes}
        user={user}
        eventDetail={eventDetail}
        setSelectedViewBike={setSelectedViewBike}
        handleDeposit={handlePreDeposit}
        isDepositing={isDepositing}
        handleOpenRegister={handleOpenRegister}
        extractBikeDisplayData={extractBikeDisplayData}
      />

      <BikeDetailModal
        selectedViewBike={selectedViewBike}
        setSelectedViewBike={setSelectedViewBike}
        user={user}
        eventDetail={eventDetail}
        handleDeposit={handlePreDeposit}
        isDepositing={isDepositing}
        extractBikeDisplayData={extractBikeDisplayData}
        onRefresh={fetchEventData}
      />

      <RegisterBikeModal
        showRegisterModal={showRegisterModal}
        setShowRegisterModal={setShowRegisterModal}
        eventDetail={eventDetail}
        user={user}
        eventId={id}
        eventBikes={eventBikes}
      />

      {showDepositFeeModal &&
        depositTarget &&
        (() => {
          const bikeData = extractBikeDisplayData(depositTarget);
          const bikePrice = bikeData.price || 0;
          const depositAmount = (bikePrice * depositPercent) / 100;

          return (
            <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-all">
              <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 md:p-8 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mb-4">
                    <MdShoppingCartCheckout size={32} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">
                    Xác nhận đặt cọc
                  </h3>
                  <p className="text-gray-500 text-sm mb-6">
                    Hệ thống yêu cầu thanh toán cọc{" "}
                    <span className="font-bold text-orange-600">
                      {depositPercent}%
                    </span>{" "}
                    để giữ xe. Số tiền này sẽ được hoàn trừ vào tổng giá trị xe
                    lúc giao dịch.
                  </p>

                  <div className="bg-gray-50 border border-gray-200 rounded-xl w-full p-4 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600 font-medium">
                        Giá niêm yết:
                      </span>
                      <span className="font-bold text-gray-900">
                        {bikePrice.toLocaleString()} đ
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                      <span className="text-gray-800 font-bold">
                        Số tiền cọc ({depositPercent}%):
                      </span>
                      <span className="font-black text-xl text-orange-600">
                        {depositAmount.toLocaleString()} đ
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3 w-full">
                    <button
                      onClick={() => setShowDepositFeeModal(false)}
                      disabled={isDepositing}
                      className="flex-1 px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      onClick={handleConfirmDeposit}
                      disabled={isDepositing}
                      className="flex-1 px-4 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 shadow-lg shadow-orange-200 transition-all disabled:opacity-70 flex justify-center items-center gap-2"
                    >
                      {isDepositing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Đang xử lý
                        </>
                      ) : (
                        "Đồng ý thanh toán"
                      )}
                    </button>
                  </div>
                  {isDepositing && (
                    <p className="text-xs text-orange-500 font-medium mt-4 animate-pulse">
                      Vui lòng không đóng trình duyệt...
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
};

export default EventDetailPage;
