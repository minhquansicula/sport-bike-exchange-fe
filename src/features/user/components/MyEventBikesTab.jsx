// File: src/pages/user/components/MyEventBikesTab.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MdEvent,
  MdOutlinePendingActions,
  MdCheckCircle,
  MdPedalBike,
  MdEdit,
  MdDeleteOutline, // Import thêm icon Xóa
  MdClose,
  MdSave,
} from "react-icons/md";
import { eventBicycleService } from "../../../services/eventBicycleService";
import { toast } from "react-hot-toast";

const MyEventBikesTab = ({ user }) => {
  const [eventBikes, setEventBikes] = useState([]);
  const [loading, setLoading] = useState(true);

  // State cho modal cập nhật
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedBike, setSelectedBike] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    title: "",
    price: "",
    condition: "",
    description: "",
    bikeType: "",
  });

  const fetchMyEventBikes = async () => {
    try {
      setLoading(true);
      const response = await eventBicycleService.getAllEventBicycles(true); // forceRefresh = true

      const allBikes = Array.isArray(response?.result)
        ? response.result
        : Array.isArray(response)
          ? response
          : [];

      const myBikes = allBikes.filter(
        (bike) =>
          bike.sellerName === user?.username ||
          bike.seller?.userId === user?.userId,
      );

      setEventBikes(myBikes.reverse());
    } catch (error) {
      console.error("Lỗi khi tải danh sách xe sự kiện:", error);
      toast.error("Không thể tải danh sách xe sự kiện");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchMyEventBikes();
  }, [user]);

  const extractBikeDisplayData = (item) => {
    const source = item.listing?.bicycle || item.bicycle || {};
    const listing = item.listing || {};
    return {
      title:
        item.title ||
        listing.title ||
        source.model ||
        "Xe đạp tham gia sự kiện",
      price:
        item.price !== null && item.price !== undefined
          ? item.price
          : listing.price || source.price || 0,
      image: item.image_url
        ? item.image_url.split(",")[0]
        : listing.image_url
          ? listing.image_url.split(",")[0]
          : source.image_url
            ? source.image_url.split(",")[0]
            : "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=800&q=80",
      eventName: item.event?.name || "Không rõ sự kiện",
      eventId: item.event?.eventId,
      status: item.status,
      description: listing.description || source.description || "",
      condition: item.condition || listing.condition || source.condition || "",
      bikeType: item.bikeType || source.category?.name || "",
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
    if (status === "Available_in_event") {
      return (
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl text-xs font-bold text-green-600 border border-green-200 flex items-center gap-1.5 shadow-sm">
          <MdCheckCircle size={16} /> Đã được duyệt
        </span>
      );
    }
     if (status === "Deposited") {
      return (
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl text-xs font-bold text-blue-600 border border-blue-200 flex items-center gap-1.5 shadow-sm">
          <MdCheckCircle size={16} /> Đã được cọc
        </span>
      );
    }
    if (status === "Waiting_Payment") {
      return (
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl text-xs font-bold text-blue-600 border border-blue-200 flex items-center gap-1.5 shadow-sm">
          Chờ thanh toán phí
        </span>
      );
    }
    if (status === "Sold") {
      return (
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl text-xs font-bold text-blue-600 border border-blue-200 flex items-center gap-1.5 shadow-sm">
          Đã bán
        </span>
      );
    }
    return (
      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 border border-slate-200 flex items-center gap-1.5 shadow-sm">
        {status}
      </span>
    );
  };

  const handleOpenUpdateModal = (bike, e) => {
    e.stopPropagation();
    const data = extractBikeDisplayData(bike);
    setSelectedBike(bike);
    setUpdateForm({
      title: data.title || "",
      price:
        data.price !== null && data.price !== undefined
          ? data.price.toString()
          : "",
      condition: data.condition || "",
      description: data.description || "",
      bikeType: data.bikeType || "",
    });
    setIsUpdateModalOpen(true);
  };

  // --- HÀM XỬ LÝ XÓA XE ---
  const handleDeleteBike = async (eventBikeId, e) => {
    e.stopPropagation();

    if (
      !window.confirm(
        "Bạn có chắc chắn muốn hủy đăng ký và xóa xe này khỏi sự kiện không?",
      )
    ) {
      return;
    }

    try {
      await eventBicycleService.deleteEventBicycle(eventBikeId);
      toast.success("Đã xóa xe khỏi sự kiện thành công!");
      fetchMyEventBikes(); // Tải lại danh sách sau khi xóa
    } catch (error) {
      console.error("Lỗi khi xóa xe sự kiện:", error);
      toast.error(
        error.response?.data?.message || "Xóa xe thất bại. Vui lòng thử lại.",
      );
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBike) return;

    setIsSubmitting(true);
    try {
      await eventBicycleService.updateEventBicycle(selectedBike.eventBikeId, {
        title: updateForm.title,
        price: parseFloat(updateForm.price) || 0,
        condition: updateForm.condition,
        bikeType: updateForm.bikeType,
        description: updateForm.description,
      });

      toast.success(
        "Cập nhật thông tin xe thành công! Xe chuyển về chờ duyệt.",
      );
      setIsUpdateModalOpen(false);
      fetchMyEventBikes();
    } catch (error) {
      console.error("Lỗi cập nhật xe:", error);
      toast.error(error.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setIsSubmitting(false);
    }
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
                className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm flex flex-col group hover:shadow-md transition-shadow relative"
              >
                <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                  <img
                    src={data.image}
                    alt={data.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {getStatusBadge(item.status)}

                  {/* NÚT XÓA XE */}
                  <button
                    onClick={(e) => handleDeleteBike(item.eventBikeId, e)}
                    className="absolute top-3 right-3 bg-red-100 text-red-600 hover:bg-red-600 hover:text-white p-2 rounded-full transition-colors shadow-sm opacity-0 group-hover:opacity-100"
                    title="Xóa/Hủy đăng ký"
                  >
                    <MdDeleteOutline size={20} />
                  </button>
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

                  <div className="mt-auto flex flex-col gap-3">
                    <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100/50 flex items-start gap-3">
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

                    <button
                      onClick={(e) => handleOpenUpdateModal(item, e)}
                      className="w-full py-2.5 bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 border border-orange-200 hover:border-orange-600 mt-2"
                    >
                      <MdEdit size={18} /> Cập nhật thông tin xe
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal cập nhật */}
      {isUpdateModalOpen && selectedBike && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-black text-lg text-slate-900">
                Cập nhật thông tin xe
              </h3>
              <button
                onClick={() => setIsUpdateModalOpen(false)}
                className="text-slate-400 hover:text-red-500 transition-colors"
              >
                <MdClose size={24} />
              </button>
            </div>

            <form
              onSubmit={handleUpdateSubmit}
              className="p-6 space-y-5 max-h-[75vh] overflow-y-auto"
            >
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Tiêu đề <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={updateForm.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Giá bán (VNĐ) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    required
                    min="0"
                    value={updateForm.price}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Tình trạng <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="condition"
                    required
                    value={updateForm.condition}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                  >
                    <option value="">Chọn tình trạng</option>
                    <option value="Như mới">Như mới</option>
                    <option value="Cũ">Cũ</option>
                    <option value="Cần sửa chữa">Cần sửa chữa</option>
                    <option value="Xác xe">Xác xe</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Loại xe
                </label>
                <input
                  type="text"
                  name="bikeType"
                  value={updateForm.bikeType}
                  onChange={handleChange}
                  placeholder="Ví dụ: Xe đạp địa hình, Xe đạp đường phố..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  name="description"
                  rows={4}
                  value={updateForm.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none resize-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl font-bold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  disabled={isSubmitting}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl font-bold bg-orange-600 text-white hover:bg-orange-700 shadow-md disabled:opacity-70 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    "Đang lưu..."
                  ) : (
                    <>
                      <MdSave size={18} /> Lưu thay đổi
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyEventBikesTab;
