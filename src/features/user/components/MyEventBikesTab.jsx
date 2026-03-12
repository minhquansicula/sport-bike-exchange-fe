// File: src/pages/user/components/MyEventBikesTab.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MdEvent,
  MdOutlinePendingActions,
  MdCheckCircle,
  MdPedalBike,
} from "react-icons/md";
import { eventBicycleService } from "../../../services/eventBicycleService";

const MyEventBikesTab = ({ user }) => {
  const [eventBikes, setEventBikes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyEventBikes = async () => {
      try {
        setLoading(true);
        const response = await eventBicycleService.getAllEventBicycles();

        const allBikes = Array.isArray(response?.result)
          ? response.result
          : Array.isArray(response)
            ? response
            : [];

        // Lọc ra các xe thuộc về user đang đăng nhập (dựa vào username hoặc userId)
        const myBikes = allBikes.filter(
          (bike) =>
            bike.sellerName === user?.username ||
            bike.seller?.userId === user?.userId,
        );

        setEventBikes(myBikes.reverse()); // Xe mới nhất lên đầu
      } catch (error) {
        console.error("Lỗi khi tải danh sách xe sự kiện:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchMyEventBikes();
  }, [user]);

  // Helper lấy data hiển thị
  const extractBikeDisplayData = (item) => {
    const source = item.listing?.bicycle || item.bicycle || {};
    const listing = item.listing || {};
    return {
      title: listing.title || source.model || "Xe đạp tham gia sự kiện",
      price: listing.price || source.price || 0,
      image: listing.image_url
        ? listing.image_url.split(",")[0]
        : source.image_url
          ? source.image_url.split(",")[0]
          : "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=800&q=80",
      eventName: item.event?.name || "Không rõ sự kiện",
      eventId: item.event?.eventId,
      status: item.status,
    };
  };

  const getStatusBadge = (status) => {
    if (status === "Pending") {
      return (
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl text-xs font-bold text-orange-600 border border-orange-200 flex items-center gap-1.5 shadow-sm">
          <MdOutlinePendingActions size={16} /> Đang chờ duyệt
        </span>
      );
    }
    if (status === "Available") {
      return (
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl text-xs font-bold text-green-600 border border-green-200 flex items-center gap-1.5 shadow-sm">
          <MdCheckCircle size={16} /> Đã được duyệt
        </span>
      );
    }
    return (
      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 border border-slate-200 flex items-center gap-1.5 shadow-sm">
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium">
          Đang tải danh sách xe sự kiện...
        </p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-slate-900">
          Xe Đăng Ký Sự Kiện
        </h2>
        <p className="text-slate-500 mt-1">
          Danh sách các xe bạn đã đăng ký để giao dịch tại các sự kiện offline.
        </p>
      </div>

      {eventBikes.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-3xl border border-slate-100 border-dashed">
          <MdEvent size={64} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-800 mb-2">
            Chưa có xe sự kiện nào
          </h3>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">
            Bạn chưa đăng ký mang xe nào đến các sự kiện của VeloX.
          </p>
          <Link
            to="/events"
            className="inline-flex items-center justify-center bg-zinc-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors"
          >
            Khám phá sự kiện ngay
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {eventBikes.map((item) => {
            const data = extractBikeDisplayData(item);
            return (
              <div
                key={item.eventBikeId}
                className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm flex flex-col group hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                  <img
                    src={data.image}
                    alt={data.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {getStatusBadge(data.status)}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3
                    className="font-bold text-slate-900 text-lg mb-1 line-clamp-1"
                    title={data.title}
                  >
                    {data.title}
                  </h3>
                  <p className="text-orange-600 font-bold mb-4">
                    {data.price.toLocaleString()} đ
                  </p>

                  <div className="mt-auto bg-blue-50/50 p-3 rounded-xl border border-blue-100/50 flex items-start gap-3">
                    <div className="mt-0.5 text-blue-500">
                      <MdEvent size={20} />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                        Sự kiện tham gia
                      </p>
                      <Link
                        to={`/events/${data.eventId}`}
                        className="font-bold text-slate-800 hover:text-blue-600 transition-colors line-clamp-2"
                      >
                        {data.eventName}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyEventBikesTab;
