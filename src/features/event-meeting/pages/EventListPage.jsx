import React from "react";
import { Link } from "react-router-dom";
import { MdLocationOn, MdCalendarToday, MdArrowForward } from "react-icons/md";

const MOCK_EVENTS = [
  {
    id: 1,
    title: "VeloX Fest 2026 - Lễ Hội Xe Đạp Thể Thao",
    date: "15/03/2026",
    time: "08:00 - 17:00",
    location: "Công viên Yên Sở, Hà Nội",
    image:
      "https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&q=80&w=800",
    categories: ["MTB", "Road"],
    status: "Đang mở đăng ký",
    statusColor: "text-green-700 bg-green-100",
  },
  {
    id: 2,
    title: "Touring Weekend Expo TP.HCM",
    date: "04/04/2026",
    time: "09:00 - 20:00",
    location: "Phố đi bộ Nguyễn Huệ, TP.HCM",
    image:
      "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&q=80&w=800",
    categories: ["Touring", "Đường phố"],
    status: "Sắp diễn ra",
    statusColor: "text-orange-700 bg-orange-100",
  },
];

const EventListPage = () => {
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

      {/* --- DANH SÁCH SỰ KIỆN (Hiệu ứng đè lên banner) --- */}
      <div className="container mx-auto px-4 max-w-5xl relative z-20 -mt-12 md:-mt-16">
        <div className="space-y-6">
          {MOCK_EVENTS.map((event) => (
            <Link
              to={`/events/${event.id}`}
              key={event.id}
              className="group block bg-white rounded-[24px] p-4 sm:p-5 shadow-lg hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] transition-all duration-300 border border-gray-100 hover:-translate-y-1"
            >
              <div className="flex flex-col sm:flex-row gap-6 items-center">
                {/* Image Container */}
                <div className="w-full sm:w-[280px] h-[200px] shrink-0 rounded-[16px] overflow-hidden relative">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div
                    className={`absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md shadow-sm ${event.statusColor}`}
                  >
                    {event.status}
                  </div>
                </div>

                {/* Content Container */}
                <div className="flex-1 w-full flex flex-col h-full py-2">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {event.categories.map((cat, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-gray-50 text-gray-500 border border-gray-200 rounded-lg text-xs font-bold uppercase tracking-wider"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-xl md:text-2xl font-bold text-zinc-900 mb-4 group-hover:text-orange-600 transition-colors line-clamp-2">
                    {event.title}
                  </h2>

                  <div className="space-y-2 mb-6 mt-auto">
                    <div className="flex items-center gap-2.5 text-gray-500 text-sm">
                      <MdCalendarToday className="text-gray-400 text-lg" />
                      <span className="font-medium">
                        {event.date} • {event.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 text-gray-500 text-sm">
                      <MdLocationOn className="text-gray-400 text-lg" />
                      <span className="font-medium line-clamp-1">
                        {event.location}
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventListPage;
