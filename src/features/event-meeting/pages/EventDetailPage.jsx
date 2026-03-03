import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { eventService } from "../../../services/eventService";
import {
  MdLocationOn,
  MdCalendarToday,
  MdStorefront,
  MdCheckCircle,
  MdLocalOffer,
  MdWarning,
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
      alert("Vui lòng đăng nhập để đăng ký bán xe!");
      navigate("/login");
      return;
    }
    navigate(`/post-bike?eventId=${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Đang tải...
      </div>
    );
  }

  if (!eventDetail) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Sự kiện không tồn tại.
      </div>
    );
  }

  // Tạm dùng ảnh và mô tả mặc định
  const fallbackImage =
    "https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&q=80&w=2000";
  const defaultDescription =
    "Cơ hội tuyệt vời để trải nghiệm thực tế, lái thử và mua bán hàng trăm mẫu xe đạp thể thao chất lượng cao. Mang xe của bạn đến để được kiểm định và bán ngay tại sự kiện!";

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      {/* HERO BANNER */}
      <div className="bg-zinc-900 text-white relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${fallbackImage})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-transparent"></div>

        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1.5 bg-purple-600 text-white rounded-full text-sm font-bold tracking-wide mb-6 uppercase shadow-lg">
              {eventDetail.status === "ongoing"
                ? "Đang diễn ra"
                : "Sắp diễn ra"}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
              {eventDetail.name}
            </h1>
            <p className="text-lg text-gray-300 mb-10 leading-relaxed">
              {defaultDescription}
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleRegisterSell}
                className="bg-orange-600 hover:bg-orange-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-[0_0_20px_rgba(234,88,12,0.4)] flex items-center gap-2 hover:-translate-y-1"
              >
                <MdLocalOffer size={24} />
                Đăng ký bán xe
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8 relative z-20">
        {/* INFO CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
              <MdCalendarToday size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Thời gian</h3>
              <p className="text-gray-500 mt-1">Từ: {eventDetail.startDate}</p>
              <p className="text-gray-500">Đến: {eventDetail.endDate}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-start gap-4">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center shrink-0">
              <MdLocationOn size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Địa điểm</h3>
              <p className="text-gray-500 mt-1">{eventDetail.location}</p>
              <p className="text-gray-500 text-sm">{eventDetail.address}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-orange-200 flex items-start gap-4 bg-orange-50/50">
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center shrink-0">
              <MdWarning size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">
                Quy định sự kiện
              </h3>
              <p className="text-gray-600 mt-1 text-sm">
                <strong>Loại xe ưu tiên:</strong> {eventDetail.bikeType}
              </p>
            </div>
          </div>
        </div>

        {/* DANH SÁCH XE THAM GIA (Mock) */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
              <MdStorefront className="text-purple-600" />
              Xe Sẽ Có Mặt Tại Sự Kiện
            </h2>
            <p className="text-gray-500 mt-2">
              Hãy đến xem trực tiếp và rước xế yêu về nhà.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_EVENT_BIKES.map((bike) => (
            <div
              key={bike.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all group cursor-pointer flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                <img
                  src={bike.image}
                  alt={bike.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg text-xs font-bold text-purple-700 flex items-center gap-1 shadow-sm">
                  <MdCheckCircle /> Đã duyệt
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1 group-hover:text-orange-600 transition-colors">
                  {bike.title}
                </h3>
                <div className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                  <span>
                    Người bán:{" "}
                    <span className="font-medium text-gray-700">
                      {bike.sellerName}
                    </span>
                  </span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span>Độ mới: {bike.condition}</span>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <p className="text-xl font-black text-orange-600">
                    {bike.price.toLocaleString("vi-VN")}đ
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
