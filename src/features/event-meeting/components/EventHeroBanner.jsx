import React from "react";
import { Link } from "react-router-dom";
import {
  MdLocationOn,
  MdCalendarToday,
  MdLocalOffer,
  MdWarning,
  MdArrowBack,
  MdPedalBike,
  MdMap,
} from "react-icons/md";

const EventHeroBanner = ({
  eventDetail,
  handleOpenRegister,
  fallbackImage,
  mapUrl,
}) => {
  return (
    <>
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
                {eventDetail.bikeType === "ALL"
                  ? "Tất cả dòng xe"
                  : eventDetail.bikeType}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight drop-shadow-lg">
              {eventDetail.name}
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed drop-shadow-md">
              Cơ hội tuyệt vời để trải nghiệm thực tế, lái thử và mua bán hàng
              trăm mẫu xe đạp thể thao chất lượng cao. Mang xe của bạn đến để
              được kiểm định và bán ngay tại sự kiện!
            </p>

            {eventDetail.status === "upcoming" && (
              <button
                onClick={handleOpenRegister}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-orange-500/30 flex items-center gap-3 hover:-translate-y-1 active:scale-95"
              >
                <MdLocalOffer size={24} /> Đăng ký xe tham gia
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-6 md:p-8 rounded-[24px] shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-col gap-4">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
              <MdCalendarToday size={26} />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-lg mb-2">
                Thời gian tổ chức
              </h3>
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

          <div className="bg-white p-6 md:p-8 rounded-[24px] shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center shrink-0">
                <MdLocationOn size={28} />
              </div>
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
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

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 md:p-8 rounded-[24px] shadow-xl shadow-orange-200/20 border border-orange-200 flex flex-col gap-4">
            <div className="w-14 h-14 bg-white text-orange-500 shadow-sm rounded-2xl flex items-center justify-center shrink-0">
              <MdWarning size={28} />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-lg mb-2">
                Quy định sự kiện
              </h3>
              <p className="text-slate-700 leading-relaxed">
                Chỉ cho phép đăng ký kiểm định và giao dịch các dòng xe thuộc
                danh mục:
                <strong className="text-orange-600 bg-white px-2 py-1 rounded-md shadow-sm ml-1">
                  {eventDetail.bikeType === "ALL"
                    ? "Tất cả loại xe"
                    : eventDetail.bikeType}
                </strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventHeroBanner;
