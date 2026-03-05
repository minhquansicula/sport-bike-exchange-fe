// File: src/features/event-meeting/pages/EventDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { eventService } from "../../../services/eventService";
import {
  MdLocationOn,
  MdCalendarToday,
  MdStorefront,
  MdCheckCircle,
  MdLocalOffer,
  MdWarning,
  MdArrowBack,
  MdPedalBike,
  MdMap,
} from "react-icons/md";

const MOCK_EVENT_BIKES = [
  {
    id: 1,
    title: "Trek Marlin 7 Gen 2",
    price: 12500000,
    image:
      "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&q=80&w=800",
    sellerName: "Tuấn Anh",
    condition: "95%",
  },
  {
    id: 2,
    title: "Giant XTC 800 (2022)",
    price: 9800000,
    image:
      "https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=600&q=80",
    sellerName: "Hải Đăng",
    condition: "90%",
  },
  {
    id: 3,
    title: "TrinX TX200",
    price: 3500000,
    image:
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80",
    sellerName: "Minh Quân",
    condition: "Like New",
  },
];

const EventDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [eventDetail, setEventDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventDetail = async () => {
      try {
        const response = await eventService.getEventById(id);
        setEventDetail(response.result);
      } catch (error) {
        console.error("Lỗi khi tải chi tiết sự kiện:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEventDetail();
  }, [id]);

  const handleRegisterSell = () => {
    if (!user) {
      alert("Vui lòng đăng nhập để đăng ký bán xe tại sự kiện này!");
      navigate("/login");
      return;
    }
    navigate(`/post-bike?eventId=${id}`);
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
        <p className="text-slate-500 mb-6">
          Sự kiện này có thể đã bị xóa hoặc URL không chính xác.
        </p>
        <button
          onClick={() => navigate("/events")}
          className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  const fallbackImage =
    "https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&q=80&w=2000";
  const defaultDescription =
    "Cơ hội tuyệt vời để trải nghiệm thực tế, lái thử và mua bán hàng trăm mẫu xe đạp thể thao chất lượng cao. Mang xe của bạn đến để được kiểm định và bán ngay tại sự kiện!";

  // Tạo URL Google Maps dựa trên địa chỉ hoặc tọa độ
  const mapUrl =
    eventDetail.latitude && eventDetail.longitude
      ? `https://www.google.com/maps/search/?api=1&query=${eventDetail.latitude},${eventDetail.longitude}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(eventDetail.address || eventDetail.location)}`;

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans selection:bg-orange-500 selection:text-white">
      {/* HERO BANNER */}
      <div className="bg-slate-900 text-white relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 scale-105 animate-kenburns"
          style={{ backgroundImage: `url(${fallbackImage})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>

        <div className="container mx-auto px-4 py-12 md:py-24 relative z-10">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white font-medium mb-8 transition-colors bg-white/10 px-4 py-2 rounded-full backdrop-blur-md w-fit"
          >
            <MdArrowBack size={20} /> Quay lại danh sách
          </Link>

          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span
                className={`px-4 py-1.5 rounded-lg text-sm font-black tracking-wider uppercase shadow-lg ${
                  eventDetail.status === "ongoing"
                    ? "bg-green-500 text-white animate-pulse"
                    : eventDetail.status === "upcoming"
                      ? "bg-orange-500 text-white"
                      : "bg-slate-600 text-white"
                }`}
              >
                {eventDetail.status === "ongoing"
                  ? "Đang diễn ra"
                  : eventDetail.status === "upcoming"
                    ? "Sắp diễn ra"
                    : "Đã kết thúc"}
              </span>
              <span className="flex items-center gap-1.5 px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-lg text-sm font-bold shadow-lg">
                <MdPedalBike className="text-orange-400" />{" "}
                {eventDetail.bikeType}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight drop-shadow-lg">
              {eventDetail.name}
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed drop-shadow-md">
              {defaultDescription}
            </p>

            {eventDetail.status !== "completed" &&
              eventDetail.status !== "cancelled" && (
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={handleRegisterSell}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-orange-500/30 flex items-center gap-3 hover:-translate-y-1 active:scale-95"
                  >
                    <MdLocalOffer size={24} />
                    Đăng ký bán xe tại đây
                  </button>
                </div>
              )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 relative z-20">
        {/* INFO CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-6 md:p-8 rounded-[24px] shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-col gap-4 group hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <MdCalendarToday size={26} />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-lg mb-2">
                Thời gian tổ chức
              </h3>
              <div className="space-y-1">
                <p className="text-slate-600 font-medium flex items-center gap-2">
                  <span className="w-12 text-slate-400 text-sm">Bắt đầu:</span>{" "}
                  {eventDetail.startDate}
                </p>
                <p className="text-slate-600 font-medium flex items-center gap-2">
                  <span className="w-12 text-slate-400 text-sm">Kết thúc:</span>{" "}
                  {eventDetail.endDate}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-[24px] shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-col gap-4 group hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-start">
              <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <MdLocationOn size={28} />
              </div>
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors tooltip"
                title="Mở Google Maps"
              >
                <MdMap size={24} />
              </a>
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-lg mb-2">
                Địa điểm
              </h3>
              <p className="text-slate-800 font-bold text-lg leading-tight">
                {eventDetail.location}
              </p>
              <p className="text-slate-500 mt-2 line-clamp-2">
                {eventDetail.address}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 md:p-8 rounded-[24px] shadow-xl shadow-orange-200/20 border border-orange-200 flex flex-col gap-4 group hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 bg-white text-orange-500 shadow-sm rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <MdWarning size={28} />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-lg mb-2">
                Quy định sự kiện
              </h3>
              <p className="text-slate-700 leading-relaxed">
                Chỉ cho phép đăng ký kiểm định và giao dịch các dòng xe thuộc
                danh mục:{" "}
                <strong className="text-orange-600 bg-white px-2 py-1 rounded-md shadow-sm ml-1">
                  {eventDetail.bikeType}
                </strong>
              </p>
            </div>
          </div>
        </div>

        {/* DANH SÁCH XE THAM GIA (Mock) */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
              <MdStorefront className="text-orange-500" />
              Sẽ Có Mặt Tại Sự Kiện
            </h2>
            <p className="text-slate-500 mt-2 font-medium">
              Khám phá trước các mẫu xe nổi bật đã đăng ký tham gia giao dịch.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_EVENT_BIKES.map((bike) => (
            <div
              key={bike.id}
              className="bg-white rounded-[20px] overflow-hidden shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 group cursor-pointer flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                <img
                  src={bike.image}
                  alt={bike.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur px-3 py-1.5 rounded-xl text-xs font-bold text-green-600 flex items-center gap-1.5 shadow-sm">
                  <MdCheckCircle size={16} /> Đã duyệt
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-black text-slate-900 text-lg mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors leading-snug">
                  {bike.title}
                </h3>

                <div className="flex flex-col gap-2 text-sm text-slate-500 mb-5 font-medium">
                  <div className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-lg">
                    <span>Người bán</span>
                    <span className="text-slate-900 font-bold">
                      {bike.sellerName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-lg">
                    <span>Độ mới</span>
                    <span className="text-slate-900 font-bold">
                      {bike.condition}
                    </span>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Giá dự kiến
                  </p>
                  <p className="text-xl font-black text-orange-600">
                    {bike.price.toLocaleString("vi-VN")}đ
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Nút Call to Action cuối trang */}
        {eventDetail.status !== "completed" &&
          eventDetail.status !== "cancelled" && (
            <div className="mt-16 text-center bg-slate-900 rounded-[32px] p-10 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2"></div>
              <div className="relative z-10">
                <h3 className="text-3xl font-black text-white mb-4">
                  Bạn có xe muốn bán?
                </h3>
                <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
                  Đăng ký kiểm định trước để quá trình giao dịch tại sự kiện
                  diễn ra nhanh chóng và uy tín hơn.
                </p>
                <button
                  onClick={handleRegisterSell}
                  className="bg-orange-500 hover:bg-orange-400 text-white px-10 py-4 rounded-2xl font-black text-lg transition-all shadow-lg hover:shadow-orange-500/50 hover:-translate-y-1"
                >
                  Đăng Ký Ngay
                </button>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default EventDetailPage;
