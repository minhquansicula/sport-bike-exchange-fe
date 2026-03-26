import React, { useState, useEffect, useMemo } from "react";
import {
  MdSearch,
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
  MdCalendarToday,
  MdAttachMoney,
} from "react-icons/md";
import { eventBicycleService } from "../../../services/eventBicycleService";

const AdminEventBicyclesPage = () => {
  const [eventBikes, setEventBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  // Mặc định hiện xe cần duyệt
  const [filterStatus, setFilterStatus] = useState("pending");
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
        if (selectedBike) setSelectedBike(null);
        fetchEventBikes();
      } catch (error) {
        alert(
          error.response?.data?.message ||
            "Lỗi khi duyệt xe, vui lòng thử lại.",
        );
      }
    }
  };

  const extractBikeDisplayData = (item) => {
    const source = item.listing?.bicycle || item.bicycle || {};
    const listing = item.listing || {};
    return {
      eventBikeId: item.eventBikeId,
      status: item.status,
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
      condition: listing.condition || source.condition || "N/A",
      brand: source.brand?.name || source.brandName || "N/A",
      category: item.bikeType || source.category?.name || "N/A",
      year: source.yearManufacture || "N/A",
      frameSize: source.frameSize || "N/A",
      frameMaterial: source.frameMaterial || "N/A",
      color: source.color || "N/A",
      wheelSize: source.wheelSize || "N/A",
      rim: source.rim || "N/A",
      brakeType: source.brakeType || "N/A",
      forkType: source.forkType || "N/A",
      shockAbsorber: source.shockAbsorber || "N/A",
      drivetrain: source.drivetrain || "N/A",
      numberOfGears: source.numberOfGears || "N/A",
      chainring: source.chainring || "N/A",
      chain: source.chain || "N/A",
      handlebar: source.handlebar || "N/A",
      saddle: source.saddle || "N/A",
      weight: source.weight ? `${source.weight} kg` : "N/A",
      sellerName: item.sellerName || "Ẩn danh",
      eventName: item.event?.name || "Không rõ",
      eventId: item.event?.eventId,
      createDate: item.createDate,
    };
  };

  const filteredBikes = eventBikes.filter((item) => {
    const title =
      item.title || item.listing?.title || item.bicycle?.model || "";
    const seller = item.sellerName || "";
    const eventName = item.event?.name || "";

    const matchSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eventName.toLowerCase().includes(searchTerm.toLowerCase());

    const itemStatus = (item.status || "").toLowerCase();

    let matchStatus = false;
    if (filterStatus === "pending") {
      matchStatus = itemStatus === "pending";
    } else if (filterStatus === "available") {
      matchStatus = ["available", "available_in_event"].includes(itemStatus);
    } else if (filterStatus === "deposited") {
      matchStatus = itemStatus === "deposited";
    }

    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "pending") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-700">
          <MdOutlinePendingActions size={14} /> Chờ duyệt
        </span>
      );
    }
    if (s === "available" || s === "available_in_event") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-700">
          <MdCheckCircle size={14} /> Đã duyệt
        </span>
      );
    }
    if (s === "deposited") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-blue-100 text-blue-700">
          <MdAttachMoney size={14} /> Đã cọc
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-gray-100 text-gray-600">
        {status}
      </span>
    );
  };

  const stats = useMemo(() => {
    return {
      pending: eventBikes.filter(
        (b) => (b.status || "").toLowerCase() === "pending",
      ).length,
      available: eventBikes.filter((b) =>
        ["available", "available_in_event"].includes(
          (b.status || "").toLowerCase(),
        ),
      ).length,
      deposited: eventBikes.filter(
        (b) => (b.status || "").toLowerCase() === "deposited",
      ).length,
    };
  }, [eventBikes]);

  const tabs = [
    {
      id: "pending",
      label: "Cần duyệt",
      icon: MdOutlinePendingActions,
      count: stats.pending,
    },
    {
      id: "available",
      label: "Đã duyệt",
      icon: MdCheckCircle,
      count: stats.available,
    },
    {
      id: "deposited",
      label: "Đã cọc",
      icon: MdAttachMoney,
      count: stats.deposited,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Xe Sự Kiện
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Quản lý và phê duyệt xe đạp đăng ký tham gia sự kiện.
          </p>
        </div>
      </div>

      {/* Tabs thay cho Stats dạng khối */}
      <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap border ${
              filterStatus === tab.id
                ? "bg-gray-900 text-white border-gray-900 shadow-md"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
          >
            <tab.icon size={18} />
            <span>{tab.label}</span>
            <span
              className={`px-2 py-0.5 rounded-md text-xs ${
                filterStatus === tab.id
                  ? "bg-gray-700 text-gray-100"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <MdSearch
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Tìm kiếm xe, người bán, sự kiện..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all outline-none text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Xe đăng ký</th>
                <th className="px-6 py-4">Sự kiện</th>
                <th className="px-6 py-4">Người bán</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center">
                    <div className="flex justify-center items-center gap-2 text-gray-400">
                      <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                      Đang tải...
                    </div>
                  </td>
                </tr>
              ) : filteredBikes.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    Không tìm thấy xe nào.
                  </td>
                </tr>
              ) : (
                filteredBikes.map((item) => {
                  const bike = extractBikeDisplayData(item);
                  const isPending =
                    (bike.status || "").toLowerCase() === "pending";

                  return (
                    <tr
                      key={bike.eventBikeId}
                      className="hover:bg-gray-50/50 transition-colors group cursor-pointer"
                      onClick={() => setSelectedBike(item)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={bike.images[0]}
                            alt=""
                            className="w-12 h-12 rounded-lg object-cover bg-gray-100 border border-gray-200"
                          />
                          <div>
                            <p className="font-bold text-gray-900 max-w-[200px] truncate">
                              {bike.title}
                            </p>
                            <p className="text-gray-500 font-medium mt-0.5">
                              {bike.price.toLocaleString()} đ
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <MdEvent className="text-gray-400" size={16} />
                          <span className="font-medium text-gray-700 max-w-[150px] truncate">
                            {bike.eventName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">
                          {bike.sellerName}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                          <MdCalendarToday size={12} />
                          {bike.createDate
                            ? new Date(bike.createDate).toLocaleDateString(
                                "vi-VN",
                              )
                            : "N/A"}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(bike.status)}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBike(item);
                          }}
                          className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Xem chi tiết"
                        >
                          <MdVisibility size={18} />
                        </button>
                        {isPending && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApprove(bike.eventBikeId);
                            }}
                            className="inline-flex items-center justify-center h-8 px-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium text-xs transition-colors"
                          >
                            Duyệt
                          </button>
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

      {/* MODERN MODAL */}
      {selectedBike &&
        (() => {
          const bike = extractBikeDisplayData(selectedBike);
          const isPending = (bike.status || "").toLowerCase() === "pending";
          const specs = [
            { label: "Thương hiệu", value: bike.brand },
            { label: "Danh mục", value: bike.category },
            { label: "Tình trạng", value: bike.condition },
            { label: "Khung xe", value: bike.frameMaterial },
            { label: "Size khung", value: bike.frameSize },
            { label: "Bánh xe", value: bike.wheelSize },
            { label: "Truyền động", value: bike.drivetrain },
            { label: "Phanh", value: bike.brakeType },
          ].filter(
            (s) => s.value && s.value !== "N/A" && s.value !== "Chưa cập nhật",
          );

          return (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-all">
              <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh] animate-in zoom-in-95 duration-200">
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-gray-900 text-lg">
                      Chi tiết xe sự kiện
                    </h3>
                    {getStatusBadge(bike.status)}
                  </div>
                  <button
                    onClick={() => setSelectedBike(null)}
                    className="p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-full transition-colors"
                  >
                    <MdClose size={20} />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column: Images */}
                  <div className="space-y-3">
                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                      <img
                        src={bike.images[0]}
                        alt={bike.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {bike.images.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                        {bike.images.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt=""
                            className="w-16 h-16 rounded-lg object-cover border border-gray-200 shrink-0"
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right Column: Info */}
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-black text-gray-900 leading-tight">
                        {bike.title}
                      </h2>
                      <p className="text-2xl font-bold text-gray-900 mt-2">
                        {bike.price.toLocaleString()} đ
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-1 bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <p className="text-xs text-gray-500 font-medium flex items-center gap-1 mb-1">
                          <MdEvent /> Sự kiện
                        </p>
                        <p className="font-bold text-gray-900 text-sm truncate">
                          {bike.eventName}
                        </p>
                      </div>
                      <div className="flex-1 bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <p className="text-xs text-gray-500 font-medium flex items-center gap-1 mb-1">
                          <MdPerson /> Người bán
                        </p>
                        <p className="font-bold text-gray-900 text-sm truncate">
                          {bike.sellerName}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-1.5">
                        <MdSettingsSuggest
                          className="text-gray-400"
                          size={18}
                        />
                        Thông số nổi bật
                      </h4>
                      <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                        {specs.map((spec, idx) => (
                          <div key={idx} className="text-sm">
                            <span className="text-gray-500 block text-xs">
                              {spec.label}
                            </span>
                            <span className="font-medium text-gray-900 truncate block">
                              {spec.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-1.5">
                        <MdInfoOutline className="text-gray-400" size={18} />
                        Mô tả thêm
                      </h4>
                      <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100 whitespace-pre-wrap">
                        {bike.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                  <button
                    onClick={() => setSelectedBike(null)}
                    className="px-5 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
                  >
                    Đóng
                  </button>
                  {isPending && (
                    <button
                      onClick={() => handleApprove(bike.eventBikeId)}
                      className="px-6 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
                    >
                      <MdCheckCircle size={18} /> Phê duyệt xe này
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
