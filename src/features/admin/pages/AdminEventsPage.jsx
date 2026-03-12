import React, { useState, useEffect } from "react";
import {
  MdSearch,
  MdFilterList,
  MdAdd,
  MdEdit,
  MdDeleteOutline,
  MdLocationOn,
  MdCalendarToday,
  MdPedalBike,
  MdEvent,
  MdArrowForward,
  MdClose,
  MdSave,
} from "react-icons/md";
import { eventService } from "../../../services/eventService";
import LocationPicker from "../../../components/common/LocationPicker";

const AdminEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [viewEvent, setViewEvent] = useState(null);
  const [editEvent, setEditEvent] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Thêm state lưu lỗi validation
  const [formErrors, setFormErrors] = useState({});

  const [newEvent, setNewEvent] = useState({
    name: "",
    bikeType: "",
    location: "",
    address: "",
    latitude: null,
    longitude: null,
    startDate: "",
    endDate: "",
    status: "draft",
  });

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventService.getAllEvents();
      if (response && response.result) {
        setEvents(response.result);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sự kiện:", error);
      alert("Không thể tải danh sách sự kiện!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = events.filter((evt) => {
    const matchSearch =
      evt.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus =
      filterStatus === "all" ? true : evt.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status) => {
    const styles = {
      draft: "bg-slate-100 text-slate-600 border-slate-200",
      upcoming: "bg-blue-50 text-blue-600 border-blue-200",
      ongoing: "bg-emerald-50 text-emerald-600 border-emerald-200",
      completed: "bg-zinc-100 text-zinc-500 border-zinc-200",
      cancelled: "bg-red-50 text-red-600 border-red-200",
    };

    const labels = {
      draft: "Bản nháp",
      upcoming: "Sắp diễn ra",
      ongoing: "Đang diễn ra",
      completed: "Đã kết thúc",
      cancelled: "Đã hủy",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-[11px] font-bold border tracking-wide uppercase ${
          styles[status] || styles.draft
        }`}
      >
        {labels[status] || "Unknown"}
      </span>
    );
  };

  // Hàm validate form (Đã tối ưu không chặn ngày quá khứ khi Edit)
  const validateEventForm = (formData, isEdit = false) => {
    const errors = {};
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    if (!formData.name || !formData.name.trim())
      errors.name = "Tên sự kiện không được để trống.";

    if (!formData.bikeType || !formData.bikeType.trim())
      errors.bikeType = "Vui lòng nhập loại xe tham gia.";

    if (!formData.startDate) {
      errors.startDate = "Vui lòng chọn ngày bắt đầu.";
    } else if (!isEdit && formData.startDate < today) {
      // Chỉ chặn ngày quá khứ khi TẠO MỚI. Khi Edit vẫn cho phép lưu.
      errors.startDate = "Ngày bắt đầu không được trong quá khứ.";
    }

    if (!formData.endDate) {
      errors.endDate = "Vui lòng chọn ngày kết thúc.";
    } else if (formData.startDate && formData.endDate < formData.startDate) {
      errors.endDate = "Ngày kết thúc phải từ ngày bắt đầu trở đi.";
    }

    if (!formData.location || !formData.location.trim())
      errors.location = "Vui lòng nhập khu vực sự kiện.";

    if (!formData.address || !formData.address.trim()) {
      errors.address = "Vui lòng chọn hoặc nhập địa chỉ chi tiết trên bản đồ.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0; // Trả về true nếu không có lỗi
  };

  const handleCreateEvent = async () => {
    // Gọi hàm validate và truyền false vì đây là tạo mới
    if (!validateEventForm(newEvent, false)) return;

    try {
      await eventService.createEvent(newEvent);
      alert("Tạo sự kiện thành công!");
      setShowCreateModal(false);
      setNewEvent({
        name: "",
        bikeType: "",
        location: "",
        address: "",
        latitude: null,
        longitude: null,
        startDate: "",
        endDate: "",
        status: "draft",
      });
      setFormErrors({});
      fetchEvents();
    } catch (error) {
      console.error("Lỗi tạo sự kiện:", error);
      alert("Lỗi khi tạo sự kiện, vui lòng thử lại.");
    }
  };

  const handleSaveEdit = async (updatedEvent) => {
    // Gọi hàm validate và truyền true vì đây là chế độ Edit
    if (!validateEventForm(updatedEvent, true)) return;

    try {
      const requestBody = {
        name: updatedEvent.name,
        bikeType: updatedEvent.bikeType,
        location: updatedEvent.location,
        address: updatedEvent.address,
        latitude: updatedEvent.latitude,
        longitude: updatedEvent.longitude,
        startDate: updatedEvent.startDate,
        endDate: updatedEvent.endDate,
        status: updatedEvent.status,
      };

      await eventService.updateEvent(updatedEvent.eventId, requestBody);
      alert("Cập nhật thành công!");
      setEditEvent(null);
      setFormErrors({});
      fetchEvents();
    } catch (error) {
      console.error("Lỗi cập nhật sự kiện:", error);
      alert("Lỗi khi cập nhật sự kiện!");
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Bạn có chắc chắn muốn xóa sự kiện này? Thao tác này có thể xóa luôn các dữ liệu Check-in liên quan.",
      )
    ) {
      try {
        await eventService.deleteEvent(id);
        alert("Đã xóa sự kiện thành công!");
        fetchEvents();
      } catch (error) {
        console.error("Lỗi xóa sự kiện:", error);
        if (error.response?.status === 500) {
          alert(
            "Không thể xóa: Sự kiện này đã có người đăng ký tham gia hoặc check-in. Vui lòng xóa dữ liệu check-in trước.",
          );
        } else {
          alert("Lỗi khi xóa sự kiện!");
        }
      }
    }
  };

  // Hàm hỗ trợ xóa lỗi khi người dùng đóng modal
  const closeModal = (isEdit) => {
    setFormErrors({});
    if (isEdit) {
      setEditEvent(null);
    } else {
      setShowCreateModal(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Sự kiện & Hội chợ
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
            Quản lý các chiến dịch, hội chợ giao thương và sự kiện offline.
          </p>
        </div>
        <button
          onClick={() => {
            setFormErrors({});
            setShowCreateModal(true);
          }}
          className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-orange-500/30 active:scale-95"
        >
          <MdAdd size={20} /> Tạo sự kiện mới
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: "Tổng sự kiện",
            value: events.length,
            icon: MdEvent,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Sắp diễn ra",
            value: events.filter((e) => e.status === "upcoming").length,
            icon: MdCalendarToday,
            color: "text-orange-600",
            bg: "bg-orange-50",
          },
          {
            label: "Đã hoàn thành",
            value: events.filter((e) => e.status === "completed").length,
            icon: MdPedalBike,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5 transition-all hover:shadow-md"
          >
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}
            >
              <stat.icon size={26} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium mb-1">
                {stat.label}
              </p>
              <p className="text-3xl font-black text-slate-900">
                {loading ? "-" : stat.value}
              </p>
            </div>
          </div>
        ))}
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
            placeholder="Tìm kiếm sự kiện, địa điểm..."
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
            <option value="upcoming">Sắp diễn ra</option>
            <option value="ongoing">Đang diễn ra</option>
            <option value="draft">Bản nháp</option>
            <option value="completed">Đã kết thúc</option>
          </select>
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="text-center py-10 text-slate-500">
          Đang tải dữ liệu...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {filteredEvents.map((evt) => (
              <div
                key={evt.eventId}
                className="group bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="text-sm font-bold text-slate-400">
                      #{evt.eventId}
                    </span>
                    {getStatusBadge(evt.status)}
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setFormErrors({});
                        setEditEvent(evt);
                      }}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    >
                      <MdEdit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(evt.eventId)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <MdDeleteOutline size={20} />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 leading-tight mb-4 group-hover:text-orange-600 transition-colors">
                  {evt.name}
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                      <MdCalendarToday size={16} className="text-slate-400" />
                    </div>
                    <span className="font-medium">
                      {evt.startDate}{" "}
                      <span className="text-slate-400 mx-1">→</span>{" "}
                      {evt.endDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                      <MdLocationOn size={18} className="text-slate-400" />
                    </div>
                    <span className="truncate font-medium">
                      {evt.location}{" "}
                      <span className="text-slate-400 font-normal">
                        ({evt.address})
                      </span>
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mt-auto mb-6">
                  <div className="px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                      Loại
                    </span>
                    <span className="text-sm font-bold text-slate-800">
                      {evt.bikeType}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                  <button
                    onClick={() => setViewEvent(evt)}
                    className="text-sm font-bold text-slate-900 hover:text-orange-600 flex items-center gap-1.5 transition-colors"
                  >
                    Xem chi tiết <MdArrowForward size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {!loading && filteredEvents.length === 0 && (
            <div className="text-center py-20 bg-white border border-slate-100 rounded-3xl">
              <MdEvent size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-800 mb-1">
                Không tìm thấy sự kiện
              </h3>
              <p className="text-slate-500">
                Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.
              </p>
            </div>
          )}
        </>
      )}

      {/* POPUP XEM CHI TIẾT */}
      {viewEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-all">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900">
                Chi tiết sự kiện
              </h3>
              <button
                onClick={() => setViewEvent(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <MdClose size={24} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <div className="mb-3">{getStatusBadge(viewEvent.status)}</div>
                <h2 className="text-2xl font-black text-slate-900 leading-tight">
                  {viewEvent.name}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div>
                  <span className="block text-slate-500 mb-1">Loại xe</span>
                  <strong className="text-slate-900">
                    {viewEvent.bikeType}
                  </strong>
                </div>
                <div>
                  <span className="block text-slate-500 mb-1">ID Hệ thống</span>
                  <strong className="text-slate-900">
                    #{viewEvent.eventId}
                  </strong>
                </div>
                <div>
                  <span className="block text-slate-500 mb-1">Bắt đầu</span>
                  <strong className="text-slate-900">
                    {viewEvent.startDate}
                  </strong>
                </div>
                <div>
                  <span className="block text-slate-500 mb-1">Kết thúc</span>
                  <strong className="text-slate-900">
                    {viewEvent.endDate}
                  </strong>
                </div>
                <div className="md:col-span-2">
                  <span className="block text-slate-500 mb-1">Địa điểm</span>
                  <strong className="text-slate-900">
                    {viewEvent.location} - {viewEvent.address}
                  </strong>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button
                onClick={() => setViewEvent(null)}
                className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl font-bold transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP TẠO/CHỈNH SỬA */}
      {(showCreateModal || editEvent) &&
        (() => {
          const isEdit = !!editEvent;
          const formData = isEdit ? editEvent : newEvent;
          const setFormData = isEdit ? setEditEvent : setNewEvent;

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-all">
              <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    {isEdit ? "Chỉnh sửa sự kiện" : "Tạo sự kiện mới"}
                  </h3>
                  <button
                    onClick={() => closeModal(isEdit)}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <MdClose size={24} />
                  </button>
                </div>

                <div className="p-8 overflow-y-auto space-y-6 flex-1">
                  {/* Tên & Loại */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Tên sự kiện <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="VD: VeloX Fest 2026..."
                        className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-4 focus:outline-none transition-all ${
                          formErrors.name
                            ? "border-red-500 focus:ring-red-500/10"
                            : "border-slate-200 focus:border-orange-500 focus:ring-orange-500/10"
                        }`}
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (formErrors.name)
                            setFormErrors({ ...formErrors, name: null });
                        }}
                      />
                      {formErrors.name && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.name}
                        </p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Loại xe tham gia <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="VD: MTB, Road, Touring..."
                        className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-4 focus:outline-none transition-all ${
                          formErrors.bikeType
                            ? "border-red-500 focus:ring-red-500/10"
                            : "border-slate-200 focus:border-orange-500 focus:ring-orange-500/10"
                        }`}
                        value={formData.bikeType}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            bikeType: e.target.value,
                          });
                          if (formErrors.bikeType)
                            setFormErrors({ ...formErrors, bikeType: null });
                        }}
                      />
                      {formErrors.bikeType && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.bikeType}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Thời gian */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Ngày bắt đầu <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-4 focus:outline-none transition-all text-slate-700 ${
                          formErrors.startDate
                            ? "border-red-500 focus:ring-red-500/10"
                            : "border-slate-200 focus:border-orange-500 focus:ring-orange-500/10"
                        }`}
                        value={formData.startDate}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            startDate: e.target.value,
                          });
                          if (formErrors.startDate)
                            setFormErrors({ ...formErrors, startDate: null });
                        }}
                      />
                      {formErrors.startDate && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.startDate}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Ngày kết thúc <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-4 focus:outline-none transition-all text-slate-700 ${
                          formErrors.endDate
                            ? "border-red-500 focus:ring-red-500/10"
                            : "border-slate-200 focus:border-orange-500 focus:ring-orange-500/10"
                        }`}
                        value={formData.endDate}
                        onChange={(e) => {
                          setFormData({ ...formData, endDate: e.target.value });
                          if (formErrors.endDate)
                            setFormErrors({ ...formErrors, endDate: null });
                        }}
                      />
                      {formErrors.endDate && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.endDate}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Địa điểm */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Khu vực (Tên Tòa nhà / Công viên){" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="VD: Công viên Yên Sở"
                        className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-4 focus:outline-none transition-all ${
                          formErrors.location
                            ? "border-red-500 focus:ring-red-500/10"
                            : "border-slate-200 focus:border-orange-500 focus:ring-orange-500/10"
                        }`}
                        value={formData.location}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            location: e.target.value,
                          });
                          if (formErrors.location)
                            setFormErrors({ ...formErrors, location: null });
                        }}
                      />
                      {formErrors.location && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.location}
                        </p>
                      )}
                    </div>

                    {/* KHUNG BẢN ĐỒ LEAFLET */}
                    <div className="md:col-span-2 relative z-10">
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Địa chỉ chi tiết (Tìm kiếm hoặc Click trên bản đồ){" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div
                        className={`${
                          formErrors.address
                            ? "ring-2 ring-red-500 rounded-lg"
                            : ""
                        }`}
                      >
                        <LocationPicker
                          initialAddress={formData.address}
                          onLocationSelect={(locationData) => {
                            setFormData({
                              ...formData,
                              address: locationData.address,
                              latitude: locationData.lat,
                              longitude: locationData.lng,
                            });
                            if (formErrors.address)
                              setFormErrors({ ...formErrors, address: null });
                          }}
                        />
                      </div>
                      {formErrors.address && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.address}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Trạng thái
                    </label>
                    <select
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all appearance-none font-medium text-slate-700"
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                    >
                      <option value="draft">Bản nháp</option>
                      <option value="upcoming">Sắp diễn ra</option>
                      <option value="ongoing">Đang diễn ra</option>
                      <option value="completed">Đã kết thúc</option>
                      <option value="cancelled">Đã hủy</option>
                    </select>
                  </div>
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 shrink-0 rounded-b-3xl">
                  <button
                    onClick={() => closeModal(isEdit)}
                    className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={() =>
                      isEdit ? handleSaveEdit(formData) : handleCreateEvent()
                    }
                    className="px-6 py-2.5 bg-slate-900 hover:bg-orange-500 text-white rounded-xl font-bold transition-all shadow-md active:scale-95 flex items-center gap-2"
                  >
                    {isEdit ? "Lưu thay đổi" : "Tạo sự kiện"}
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
};

export default AdminEventsPage;
