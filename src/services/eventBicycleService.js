// File: src/services/eventBicycleService.js
import api from "../config/api";

// 1. Biến lưu trữ cache dữ liệu xe sự kiện trên RAM
let eventBikesCache = null;

// 2. Biến lưu Promise đang gọi dở dang để tránh duplicate request
let fetchEventBikesPromise = null;

export const eventBicycleService = {
  // Tạo xe đạp mới (chỉ lưu vào db, chưa tạo posting)
  createBicycle: async (bicycleData) => {
    const response = await api.post(
      "/event-bicycles/bicycle/create",
      bicycleData,
    );
    return response.data;
  },

  // Đăng ký xe vào sự kiện (dành cho Xe mới tạo)
  registerBicycleToEventWithoutPosting: async (eventId, bicycleId) => {
    const response = await api.post(
      `/event-bicycles/event/${eventId}/bicycle/${bicycleId}/register`,
    );
    eventBicycleService.clearCache(); // Xóa cache vì đã thêm xe mới
    return response.data;
  },

  // Đăng ký xe vào sự kiện (dành cho Bài đăng - Listing CÓ SẴN)
  registerBicycleToEvent: async (eventId, listingId) => {
    const response = await api.post(
      `/event-bicycles/event/${eventId}/listing/${listingId}/register`,
    );
    eventBicycleService.clearCache(); // Xóa cache vì đã thêm xe mới
    return response.data;
  },

  // Lấy danh sách tất cả xe trong sự kiện (Có hỗ trợ Cache)
  getAllEventBicycles: async (forceRefresh = false) => {
    // Trường hợp 1: Có cache và không bắt buộc refresh -> Trả về luôn
    if (eventBikesCache && !forceRefresh) {
      return eventBikesCache;
    }

    // Trường hợp 2: Có một request đang chạy ngầm -> Dùng chung request đó
    if (fetchEventBikesPromise && !forceRefresh) {
      return fetchEventBikesPromise;
    }

    // Trường hợp 3: Chưa có cache -> Gọi API
    fetchEventBikesPromise = api
      .get("/event-bicycles")
      .then((response) => {
        eventBikesCache = response.data; // Lưu data vào RAM
        fetchEventBikesPromise = null; // Xóa promise vì đã chạy xong
        return eventBikesCache;
      })
      .catch((error) => {
        fetchEventBikesPromise = null; // Xóa promise để có thể thử lại
        throw error;
      });

    return fetchEventBikesPromise;
  },

  // Cập nhật trạng thái xe trong sự kiện (Ví dụ: Duyệt xe)
  updateEventBicycleStatus: async (eventBikeId) => {
    const response = await api.put(`/event-bicycles/${eventBikeId}/status`);
    eventBicycleService.clearCache(); // Xóa cache vì trạng thái xe vừa đổi
    return response.data;
  },

  // Hàm thủ công dọn dẹp cache
  clearCache: () => {
    eventBikesCache = null;
    fetchEventBikesPromise = null;
  },
};
