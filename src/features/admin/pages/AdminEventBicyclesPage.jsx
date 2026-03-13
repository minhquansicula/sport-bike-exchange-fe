import React, { useState, useEffect } from "react";
import {
  MdSearch,
  MdFilterList,
  MdCheckCircle,
  MdPedalBike,
  MdEvent,
  MdOutlinePendingActions,
  MdOutlineDirectionsBike,
  MdVisibility,
  MdClose,
  MdInfoOutline,
  MdSettingsSuggest,
  MdPerson,
} from "react-icons/md";
import { eventBicycleService } from "../../../services/eventBicycleService";

const AdminEventBicyclesPage = () => {
  const [eventBikes, setEventBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Pending");

  // State quản lý popup xem chi tiết xe
  const [selectedBike, setSelectedBike] = useState(null);

  const fetchEventBikes = async () => {
    try {
      setLoading(true);
      const response = await eventBicycleService.getAllEventBicycles();
      if (response && response.result) {
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
        if (selectedBike) setSelectedBike(null); // Đóng popup nếu đang mở
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

  // Trích xuất dữ liệu để hiển thị trong popup (ĐÃ SỬA THEO API MỚI)
  const extractBikeDisplayData = (item) => {
    const source = item.listing?.bicycle || item.bicycle || {};
    const listing = item.listing || {};
    return {
      eventBikeId: item.eventBikeId,
      status: item.status,
      // Ưu tiên lấy title và price trực tiếp từ item
      title:
        item.title ||
        listing.title ||
        source.model ||
        "Xe đạp tham gia sự kiện",
      price: item.price || listing.price || source.price || 0,
      description:
        listing.description || source.description || "Không có mô tả chi tiết.",
      images: listing.image_url
        ? listing.image_url.split(",")
        : source.image_url
          ? source.image_url.split(",")
          : [
              "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=800&q=80",
            ],
      condition: listing.condition || source.condition || "Không rõ",
      brand: source.brand?.name || source.brandName || "Không rõ",
      // Ưu tiên lấy bikeType trực tiếp từ item
      category: item.bikeType || source.category?.name || "Không rõ",

      // Thông số kỹ thuật
      year: source.yearManufacture || "Chưa cập nhật",
      frameSize: source.frameSize || "Chưa cập nhật",
      frameMaterial: source.frameMaterial || "Chưa cập nhật",
      color: source.color || "Chưa cập nhật",
      wheelSize: source.wheelSize || "Chưa cập nhật",
      rim: source.rim || "Chưa cập nhật",
      brakeType: source.brakeType || "Chưa cập nhật",
      forkType: source.forkType || "Chưa cập nhật",
      shockAbsorber: source.shockAbsorber || "Chưa cập nhật",
      drivetrain: source.drivetrain || "Chưa cập nhật",
      numberOfGears: source.numberOfGears || "Chưa cập nhật",
      chainring: source.chainring || "Chưa cập nhật",
      chain: source.chain || "Chưa cập nhật",
      handlebar: source.handlebar || "Chưa cập nhật",
      saddle: source.saddle || "Chưa cập nhật",
      weight: source.weight ? `${source.weight} kg` : "Chưa cập nhật",

      sellerName: item.sellerName || "Ẩn danh",
      eventName: item.event?.name || "Không rõ",
      eventId: item.event?.eventId,
      createDate: item.createDate,
    };
  };

  const filteredBikes = eventBikes.filter((item) => {
    // Sửa lại cách lấy title cho bộ lọc tìm kiếm
    const title =
      item.title || item.listing?.title || item.bicycle?.model || "";
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
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-600 border border-orange-200 flex items-center gap-1 w-fit whitespace-nowrap">
            <MdOutlinePendingActions size={14} /> Chờ duyệt
          </span>
        );
      case "Available":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-600 border border-green-200 flex items-center gap-1 w-fit whitespace-nowrap">
            <MdCheckCircle size={14} /> Đã duyệt
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1 w-fit whitespace-nowrap">
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
          Kiểm tra thông số kỹ thuật và phê duyệt các xe đạp đăng ký tham gia
          giao dịch tại sự kiện.
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
          <table className="w-full min-w-[900px] text-left">
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
                  const bikeInfo = extractBikeDisplayData(item);

                  return (
                    <tr
                      key={item.eventBikeId}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-bold text-slate-500">
                        #{bikeInfo.eventBikeId}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={bikeInfo.images[0]}
                            alt="bike"
                            className="w-16 h-16 rounded-xl object-cover bg-slate-100 border border-slate-200"
                          />
                          <div>
                            <p
                              className="font-bold text-slate-900 line-clamp-1 max-w-[200px]"
                              title={bikeInfo.title}
                            >
                              {bikeInfo.title}
                            </p>
                            <p className="text-sm font-bold text-orange-600 mt-1">
                              {bikeInfo.price.toLocaleString()} đ
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                              <MdPedalBike /> {bikeInfo.category}
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
                            <p className="font-bold text-slate-700 line-clamp-2 max-w-[180px]">
                              {bikeInfo.eventName}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              ID: #{bikeInfo.eventId}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800">
                          {bikeInfo.sellerName}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {bikeInfo.createDate}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(bikeInfo.status)}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedBike(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-sm transition-colors active:scale-95 shadow-sm"
                        >
                          <MdVisibility size={16} /> Chi tiết
                        </button>
                        {bikeInfo.status === "Pending" ? (
                          <button
                            onClick={() => handleApprove(bikeInfo.eventBikeId)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-orange-500 text-white rounded-lg font-bold text-sm transition-colors active:scale-95 shadow-sm"
                          >
                            <MdCheckCircle size={16} /> Duyệt
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-2 bg-green-50 text-green-600 border border-green-200 rounded-lg font-bold text-sm cursor-not-allowed">
                            Đã duyệt
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

      {/* POPUP CHI TIẾT XE */}
      {selectedBike &&
        (() => {
          const bikeInfo = extractBikeDisplayData(selectedBike);

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto py-10">
              <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl flex flex-col relative my-auto animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white rounded-t-3xl z-10">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <MdInfoOutline className="text-orange-500" /> Chi tiết hồ sơ
                    xe
                  </h3>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(bikeInfo.status)}
                    <button
                      onClick={() => setSelectedBike(null)}
                      className="p-2 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <MdClose size={24} />
                    </button>
                  </div>
                </div>

                <div className="p-6 md:p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Cột trái: Ảnh */}
                    <div className="space-y-4">
                      <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                        <img
                          src={bikeInfo.images[0]}
                          alt={bikeInfo.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {bikeInfo.images.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                          {bikeInfo.images.map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt=""
                              className="w-20 h-20 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Cột phải: Thông tin */}
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-black text-slate-900 leading-tight mb-2">
                          {bikeInfo.title}
                        </h2>
                        <p className="text-3xl font-black text-orange-600">
                          {bikeInfo.price.toLocaleString()} đ
                        </p>
                      </div>

                      <div className="flex flex-col gap-3">
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center gap-4">
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-500 shadow-sm shrink-0">
                            <MdEvent size={20} />
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 font-medium">
                              Sự kiện đăng ký
                            </p>
                            <p className="font-bold text-slate-900 line-clamp-1">
                              {bikeInfo.eventName}
                            </p>
                          </div>
                        </div>

                        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 flex items-center gap-4">
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-orange-500 shadow-sm shrink-0">
                            <MdPerson size={20} />
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 font-medium">
                              Người bán / Đăng ký
                            </p>
                            <p className="font-bold text-slate-900">
                              {bikeInfo.sellerName}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                          <MdSettingsSuggest className="text-slate-400" /> Thông
                          số kỹ thuật
                        </h4>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                          {[
                            { label: "Thương hiệu", value: bikeInfo.brand },
                            { label: "Danh mục", value: bikeInfo.category },
                            { label: "Tình trạng", value: bikeInfo.condition },
                            { label: "Năm sản xuất", value: bikeInfo.year },
                            {
                              label: "Chất liệu khung",
                              value: bikeInfo.frameMaterial,
                            },
                            { label: "Size khung", value: bikeInfo.frameSize },
                            { label: "Màu sắc", value: bikeInfo.color },
                            { label: "Bánh xe", value: bikeInfo.wheelSize },
                            { label: "Vành xe", value: bikeInfo.rim },
                            { label: "Loại phanh", value: bikeInfo.brakeType },
                            { label: "Loại phuộc", value: bikeInfo.forkType },
                            {
                              label: "Giảm xóc",
                              value: bikeInfo.shockAbsorber,
                            },
                            {
                              label: "Bộ truyền động",
                              value: bikeInfo.drivetrain,
                            },
                            {
                              label: "Số líp/tốc độ",
                              value: bikeInfo.numberOfGears,
                            },
                            { label: "Đĩa", value: bikeInfo.chainring },
                            { label: "Xích", value: bikeInfo.chain },
                            { label: "Ghi đông", value: bikeInfo.handlebar },
                            { label: "Yên xe", value: bikeInfo.saddle },
                            { label: "Trọng lượng", value: bikeInfo.weight },
                          ].map((spec, idx) => (
                            <div
                              key={idx}
                              className="bg-slate-50 p-3 rounded-lg border border-slate-100"
                            >
                              <span className="block text-slate-400 text-[11px] uppercase tracking-wider mb-1 font-bold">
                                {spec.label}
                              </span>
                              <span
                                className="font-bold text-slate-800 line-clamp-1"
                                title={spec.value}
                              >
                                {spec.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 mb-2">
                          Mô tả người bán
                        </h4>
                        <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed whitespace-pre-wrap">
                          {bikeInfo.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-3xl">
                  <button
                    onClick={() => setSelectedBike(null)}
                    className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-100 transition-colors"
                  >
                    Đóng
                  </button>
                  {bikeInfo.status === "Pending" && (
                    <button
                      onClick={() => handleApprove(bikeInfo.eventBikeId)}
                      className="flex items-center gap-2 px-8 py-2.5 bg-slate-900 hover:bg-orange-500 text-white rounded-xl font-bold shadow-lg transition-colors active:scale-95"
                    >
                      <MdCheckCircle size={20} /> Phê duyệt xe này
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
};

export default AdminEventBicyclesPage;
