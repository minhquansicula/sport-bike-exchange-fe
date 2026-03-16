import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { eventService } from "../../../services/eventService";
import { eventBicycleService } from "../../../services/eventBicycleService";
import { depositService } from "../../../services/depositService";
import toast, { Toaster } from "react-hot-toast";
import { MdWarning } from "react-icons/md";

// Import 4 Component con vừa tạo
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
  const [isDepositing, setIsDepositing] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Lấy dữ liệu API
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        const [eventRes, bikesRes] = await Promise.all([
          eventService.getEventById(id),
          eventBicycleService
            .getAllEventBicycles()
            .catch(() => ({ result: [] })),
        ]);

        if (eventRes?.result) setEventDetail(eventRes.result);

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
    };
    fetchEventData();
  }, [id]);

  const handleOpenRegister = () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để đăng ký bán xe tại sự kiện này!");
      navigate("/login");
      return;
    }
    setShowRegisterModal(true);
  };

  const handleDeposit = async (eventBike) => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để đặt cọc xe!");
      navigate("/login");
      return;
    }

    const targetListingId = eventBike.listing?.listingId || eventBike.listingId;
    if (!targetListingId) {
      toast.error("Xe này hiện chưa sẵn sàng giao dịch đặt cọc!");
      return;
    }

    setIsDepositing(true);
    try {
      const res = await depositService.createDepositViaVNPay(targetListingId);
      if (res.result?.paymentUrl) {
        window.location.href = res.result.paymentUrl;
      } else if (res.result?.deposit) {
        toast.success("Trừ tiền ví thành công! Đã đặt cọc.");
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

  // Hàm chuyển đổi dữ liệu chung để Modal và Grid đều dùng được
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
        handleDeposit={handleDeposit}
        isDepositing={isDepositing}
        handleOpenRegister={handleOpenRegister}
        extractBikeDisplayData={extractBikeDisplayData}
      />

      <BikeDetailModal
        selectedViewBike={selectedViewBike}
        setSelectedViewBike={setSelectedViewBike}
        user={user}
        eventDetail={eventDetail}
        handleDeposit={handleDeposit}
        isDepositing={isDepositing}
        extractBikeDisplayData={extractBikeDisplayData}
      />

      <RegisterBikeModal
        showRegisterModal={showRegisterModal}
        setShowRegisterModal={setShowRegisterModal}
        eventDetail={eventDetail}
        user={user}
        eventId={id}
        eventBikes={eventBikes}
      />
    </div>
  );
};

export default EventDetailPage;
