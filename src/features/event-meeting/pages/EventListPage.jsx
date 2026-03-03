import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MdLocationOn, MdCalendarToday, MdArrowForward } from "react-icons/md";
import { eventService } from "../../../services/eventService";
const EventListPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventService.getAllEvents();
        // Chỉ lấy các sự kiện public, lọc bỏ 'draft' và 'cancelled'
        const publicEvents = response.result.filter(
          (e) => e.status !== "draft" && e.status !== "cancelled",
        );
        setEvents(publicEvents);
      } catch (error) {
        console.error("Lỗi khi tải danh sách sự kiện:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const getStatusDisplay = (status) => {
    switch (status) {
      case "upcoming":
        return { text: "Sắp diễn ra", color: "text-orange-700 bg-orange-100" };
      case "ongoing":
        return {
          text: "Đang diễn ra",
          color: "text-green-700 bg-green-100 animate-pulse",
        };
      case "completed":
        return { text: "Đã kết thúc", color: "text-gray-700 bg-gray-200" };
      default:
        return { text: "Không rõ", color: "text-gray-700 bg-gray-100" };
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20 font-sans text-gray-800">
      {/* --- HERO BANNER GRADIENT --- */}
      <div className="relative bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white overflow-hidden pb-20 pt-12 md:pt-16 md:pb-24 shadow-inner">
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <span className="inline-block px-4 py-1.5 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-full text-sm font-bold tracking-widest mb-4 uppercase">
            Sự kiện & Hội chợ
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 tracking-tight leading-tight">
            Khám Phá Cộng Đồng <br /> Velo
            <span className="text-orange-500">X</span>
          </h1>
          <p className="text-base md:text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
            Nơi hội tụ đam mê. Giao lưu, trải nghiệm và rước ngay xế yêu tại các
            hội chợ xe đạp quy mô nhất toàn quốc.
          </p>
        </div>
      </div>

      {/* --- DANH SÁCH SỰ KIỆN --- */}
      <div className="container mx-auto px-4 max-w-5xl relative z-20 -mt-12 md:-mt-16">
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-10 bg-white rounded-[24px] shadow-lg">
              Đang tải dữ liệu...
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-[24px] shadow-lg text-gray-500">
              Hiện tại không có sự kiện nào đang diễn ra.
            </div>
          ) : (
            events.map((event) => {
              const statusUI = getStatusDisplay(event.status);
              // Tạm dùng ảnh mặc định do DB chưa có trường ảnh
              const fallbackImage =
                "https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&q=80&w=800";

              return (
                <Link
                  to={`/events/${event.eventId}`} // Trỏ tới eventId
                  key={event.eventId}
                  className="group block bg-white rounded-[24px] p-4 sm:p-5 shadow-lg hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] transition-all duration-300 border border-gray-100 hover:-translate-y-1"
                >
                  <div className="flex flex-col sm:flex-row gap-6 items-center">
                    {/* Image Container */}
                    <div className="w-full sm:w-[280px] h-[200px] shrink-0 rounded-[16px] overflow-hidden relative">
                      <img
                        src={fallbackImage}
                        alt={event.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div
                        className={`absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md shadow-sm ${statusUI.color}`}
                      >
                        {statusUI.text}
                      </div>
                    </div>

                    {/* Content Container */}
                    <div className="flex-1 w-full flex flex-col h-full py-2">
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-2.5 py-1 bg-gray-50 text-gray-500 border border-gray-200 rounded-lg text-xs font-bold uppercase tracking-wider">
                          {event.bikeType}
                        </span>
                      </div>

                      <h2 className="text-xl md:text-2xl font-bold text-zinc-900 mb-4 group-hover:text-orange-600 transition-colors line-clamp-2">
                        {event.name}
                      </h2>

                      <div className="space-y-2 mb-6 mt-auto">
                        <div className="flex items-center gap-2.5 text-gray-500 text-sm">
                          <MdCalendarToday className="text-gray-400 text-lg" />
                          <span className="font-medium">
                            {event.startDate} → {event.endDate}
                          </span>
                        </div>
                        <div className="flex items-center gap-2.5 text-gray-500 text-sm">
                          <MdLocationOn className="text-gray-400 text-lg" />
                          <span className="font-medium line-clamp-1">
                            {event.location} - {event.address}
                          </span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="mt-auto flex justify-end">
                        <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white rounded-xl text-sm font-bold group-hover:bg-orange-600 transition-colors">
                          Xem chi tiết{" "}
                          <MdArrowForward
                            size={18}
                            className="group-hover:translate-x-1 transition-transform"
                          />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default EventListPage;
