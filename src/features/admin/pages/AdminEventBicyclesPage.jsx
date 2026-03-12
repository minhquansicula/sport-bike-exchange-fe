import React, { useState, useEffect } from "react";
import {
  MdSearch,
  MdFilterList,
  MdCheckCircle,
  MdPedalBike,
  MdEvent,
  MdOutlinePendingActions,
  MdOutlineDirectionsBike,
} from "react-icons/md";
import { eventBicycleService } from "../../../services/eventBicycleService";

const AdminEventBicyclesPage = () => {
  const [eventBikes, setEventBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Pending");

  const fetchEventBikes = async () => {
    try {
      setLoading(true);
      const response = await eventBicycleService.getAllEventBicycles();
      if (response && response.result) {
        // Đảo ngược mảng để xe mới nhất lên đầu
        setEventBikes(response.result.reverse());
      } else if (Array.isArray(response)) {
        setEventBikes(response.reverse());
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách xe sự kiện:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventBikes();
  }, []);

  const handleApprove = async (eventBikeId) => {
    if (window.confirm("Xác nhận duyệt xe này tham gia sự kiện?")) {
      try {
        await eventBicycleService.updateEventBicycleStatus(eventBikeId);
        alert("Đã duyệt xe thành công!");
        fetchEventBikes();
      } catch (error) {
        console.error("Lỗi khi duyệt xe:", error);
        alert(
          error.response?.data?.message ||
            "Lỗi khi duyệt xe, vui lòng thử lại.",
        );
      }
    }
  };

  // Logic Lọc Dữ Liệu
  const filteredBikes = eventBikes.filter((item) => {
    const title = item.listing?.title || item.bicycle?.model || "";
    const seller = item.sellerName || "";
    const eventName = item.event?.name || "";

    const matchSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eventName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus =
      filterStatus === "all" ? true : item.status === filterStatus;

    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-600 border border-orange-200 flex items-center gap-1 w-fit">
            <MdOutlinePendingActions size={14} /> Chờ duyệt
          </span>
        );
      case "Available":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-600 border border-green-200 flex items-center gap-1 w-fit">
            <MdCheckCircle size={14} /> Đã duyệt
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1 w-fit">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Duyệt Xe Sự Kiện
        </h1>
        <p className="text-slate-500 mt-2 text-sm">
          Quản lý và phê duyệt các xe đạp đăng ký tham gia giao dịch tại sự
          kiện.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-blue-50 text-blue-600">
            <MdOutlineDirectionsBike size={26} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium mb-1">
              Tổng số xe
            </p>
            <p className="text-3xl font-black text-slate-900">
              {loading ? "-" : eventBikes.length}
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-orange-50 text-orange-600">
            <MdOutlinePendingActions size={26} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium mb-1">Chờ duyệt</p>
            <p className="text-3xl font-black text-slate-900">
              {loading
                ? "-"
                : eventBikes.filter((b) => b.status === "Pending").length}
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-green-50 text-green-600">
            <MdCheckCircle size={26} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium mb-1">Đã duyệt</p>
            <p className="text-3xl font-black text-slate-900">
              {loading
                ? "-"
                : eventBikes.filter((b) => b.status === "Available").length}
            </p>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex-1 relative">
          <MdSearch
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={22}
          />
          <input
            type="text"
            placeholder="Tìm theo tên xe, người đăng ký, sự kiện..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-all outline-none"
          />
        </div>
        <div className="relative min-w-[200px]">
          <MdFilterList
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={22}
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full pl-12 pr-10 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-all outline-none appearance-none cursor-pointer font-medium text-slate-700"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Pending">Chờ duyệt</option>
            <option value="Available">Đã duyệt</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm">
              <tr>
                <th className="px-6 py-4 font-bold">Mã</th>
                <th className="px-6 py-4 font-bold">Thông tin xe</th>
                <th className="px-6 py-4 font-bold">Sự kiện tham gia</th>
                <th className="px-6 py-4 font-bold">Người đăng ký</th>
                <th className="px-6 py-4 font-bold">Trạng thái</th>
                <th className="px-6 py-4 font-bold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-10 text-center text-slate-500"
                  >
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : filteredBikes.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-10 text-center text-slate-500"
                  >
                    Không tìm thấy dữ liệu xe nào.
                  </td>
                </tr>
              ) : (
                filteredBikes.map((item) => {
                  const displayTitle =
                    item.listing?.title ||
                    item.bicycle?.model ||
                    "Xe đạp sự kiện";
                  const displayPrice = item.listing?.price
                    ? item.listing.price.toLocaleString() + " đ"
                    : item.bicycle?.price
                      ? item.bicycle.price.toLocaleString() + " đ"
                      : "Chưa cập nhật giá";
                  const displayImg =
                    item.listing?.image_url?.split(",")[0] ||
                    "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&q=80&w=200";

                  return (
                    <tr
                      key={item.eventBikeId}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-bold text-slate-500">
                        #{item.eventBikeId}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={displayImg}
                            alt="bike"
                            className="w-16 h-16 rounded-xl object-cover bg-slate-100 border border-slate-200"
                          />
                          <div>
                            <p className="font-bold text-slate-900 line-clamp-1 max-w-[200px]">
                              {displayTitle}
                            </p>
                            <p className="text-sm font-bold text-orange-600 mt-1">
                              {displayPrice}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                              <MdPedalBike /> {item.type || "Chưa phân loại"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                            <MdEvent size={16} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-700 line-clamp-2 max-w-[200px]">
                              {item.event?.name || "Không rõ"}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              ID: #{item.event?.eventId}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800">
                          {item.sellerName}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {item.createDate}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(item.status)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {item.status === "Pending" ? (
                          <button
                            onClick={() => handleApprove(item.eventBikeId)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-orange-500 text-white rounded-lg font-bold text-sm transition-colors active:scale-95 shadow-sm"
                          >
                            <MdCheckCircle size={16} /> Duyệt xe
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 text-slate-400 rounded-lg font-bold text-sm cursor-not-allowed">
                            Đã xử lý
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminEventBicyclesPage;
