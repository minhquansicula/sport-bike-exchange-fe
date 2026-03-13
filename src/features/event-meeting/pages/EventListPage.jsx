import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MdLocationOn,
  MdCalendarToday,
  MdArrowForward,
  MdSearch,
  MdPedalBike,
  MdEventAvailable,
} from "react-icons/md";
import { eventService } from "../../../services/eventService";

const EventListPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await eventService.getAllEvents();
        if (response && response.result) {
          // Chỉ lọc bỏ sự kiện đã hủy (cancelled), giữ lại tất cả các status khác
          const publicEvents = response.result.filter(
            (e) => e.status !== "cancelled",
          );
          // Sắp xếp sự kiện mới nhất lên đầu
          publicEvents.sort(
            (a, b) => new Date(b.startDate) - new Date(a.startDate),
          );
          setEvents(publicEvents);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách sự kiện:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const getStatusDisplay = (status) => {
    // Log để debug
    // console.log("Event status:", status);

    switch (status) {
      case "upcoming":
        return {
          text: "Sắp diễn ra",
          color: "text-orange-700 bg-orange-100 border-orange-200",
        };
      case "ongoing":
        return {
          text: "Đang diễn ra",
          color: "text-green-700 bg-green-100 border-green-200 animate-pulse",
        };
      case "completed":
        return {
          text: "Đã kết thúc",
          color: "text-slate-600 bg-slate-100 border-slate-200",
        };
      case "cancelled":
        return {
          text: "Đã hủy",
          color: "text-red-700 bg-red-100 border-red-200",
        };
      default:
        return {
          text: status || "Không rõ",
          color: "text-slate-600 bg-slate-100 border-slate-200",
        };
    }
  };

  // Logic Lọc sự kiện
  const filteredEvents = events.filter((evt) => {
    const matchSearch =
      evt.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = activeTab === "all" ? true : evt.status === activeTab;
    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20 font-sans text-slate-800">
      {/* Hero Banner - giữ nguyên */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden pb-24 pt-16 md:pt-20 md:pb-32 shadow-inner">
        {/* ... giữ nguyên ... */}
      </div>

      {/* Search & Filters */}
      <div className="container mx-auto px-4 max-w-5xl relative z-20 -mt-12 md:-mt-16 mb-10">
        <div className="bg-white p-4 md:p-6 rounded-[24px] shadow-xl border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-1/2">
            <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-2xl" />
            <input
              type="text"
              placeholder="Tìm kiếm tên sự kiện, địa điểm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 outline-none transition-all font-medium text-slate-700"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            {[
              { id: "all", label: "Tất cả" },
              { id: "upcoming", label: "Sắp diễn ra" },
              { id: "ongoing", label: "Đang diễn ra" },
              { id: "completed", label: "Đã kết thúc" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap px-6 py-3.5 rounded-xl font-bold text-sm transition-all ${
                  activeTab === tab.id
                    ? "bg-slate-900 text-white shadow-md"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Event List */}
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[24px] border border-slate-100 shadow-sm">
              <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-4"></div>
              <p className="text-slate-500 font-medium">
                Đang tìm kiếm sự kiện...
              </p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[24px] border border-slate-100 shadow-sm flex flex-col items-center">
              <MdEventAvailable size={64} className="text-slate-300 mb-4" />
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                Không tìm thấy sự kiện nào
              </h3>
              <p className="text-slate-500">
                Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc.
              </p>
            </div>
          ) : (
            filteredEvents.map((event) => {
              const statusUI = getStatusDisplay(event.status);
              const fallbackImage =
                "https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&q=80&w=800";

              return (
                <Link
                  to={`/events/${event.eventId}`}
                  key={event.eventId}
                  className="group block bg-white rounded-[24px] p-4 sm:p-5 shadow-sm hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 border border-slate-100 hover:-translate-y-1"
                >
                  <div className="flex flex-col sm:flex-row gap-6 items-center">
                    {/* Image Container */}
                    <div className="w-full sm:w-[320px] h-[220px] shrink-0 rounded-[16px] overflow-hidden relative bg-slate-100">
                      <img
                        src={fallbackImage}
                        alt={event.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-60"></div>

                      {/* Badge Trạng thái - ĐẢM BẢO HIỂN THỊ */}
                      <div
                        className={`absolute top-4 left-4 px-3 py-1.5 rounded-lg text-xs font-black tracking-wide border backdrop-blur-md shadow-sm uppercase ${statusUI.color}`}
                      >
                        {statusUI.text}
                      </div>

                      {/* Loại xe */}
                      <div className="absolute bottom-4 left-4 flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-md text-slate-800 rounded-lg text-xs font-bold shadow-sm">
                        <MdPedalBike size={16} className="text-orange-500" />
                        {event.bikeType === "ALL" ? "Tất cả" : event.bikeType}
                      </div>
                    </div>

                    {/* Content Container */}
                    <div className="flex-1 w-full flex flex-col h-full py-2">
                      <h2 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-orange-600 transition-colors line-clamp-2 leading-tight">
                        {event.name}
                      </h2>

                      <div className="space-y-3 mb-6 mt-auto">
                        <div className="flex items-start gap-3 text-slate-600">
                          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                            <MdCalendarToday className="text-orange-500 text-lg" />
                          </div>
                          <div className="pt-1.5 font-medium text-sm">
                            {event.startDate}{" "}
                            <span className="text-slate-400 mx-1">đến</span>{" "}
                            {event.endDate}
                          </div>
                        </div>
                        <div className="flex items-start gap-3 text-slate-600">
                          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                            <MdLocationOn className="text-blue-500 text-xl" />
                          </div>
                          <div className="pt-1.5 font-medium text-sm line-clamp-2 leading-relaxed">
                            <strong className="text-slate-800">
                              {event.location}
                            </strong>
                            <span className="block text-slate-500 font-normal mt-0.5">
                              {event.address}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="mt-auto flex justify-end">
                        <span className="inline-flex items-center gap-2 px-6 py-3 bg-slate-50 text-slate-800 border border-slate-200 rounded-xl text-sm font-bold group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all">
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
