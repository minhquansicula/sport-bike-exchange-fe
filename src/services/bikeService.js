// File: src/services/bikeService.js
import api from "../config/api";

// 1. Khởi tạo biến lưu trữ cache trên RAM
let bikesCache = null;

// 2. Khởi tạo biến lưu trữ Promise để tránh gọi API trùng lặp cùng một thời điểm
let fetchBikesPromise = null;

export const bikeService = {
  createBikeListing: async (data) => {
    const response = await api.post("/post/create", data);
    bikeService.clearCache(); // Tự động xóa cache để cập nhật xe mới
    return response.data;
  },

  getAllBikeListings: async (forceRefresh = false) => {
    // Trường hợp 1: Đã có dữ liệu trong cache -> Trả về ngay lập tức (0ms)
    if (bikesCache && !forceRefresh) {
      return bikesCache;
    }

    // Trường hợp 2: Đang có một request lấy xe đang chạy ngầm -> Dùng chung request đó, không tạo request mới
    if (fetchBikesPromise && !forceRefresh) {
      return fetchBikesPromise;
    }

    // Trường hợp 3: Chưa có cache và chưa có request nào -> Gọi API
    fetchBikesPromise = api
      .get("/post/all")
      .then((response) => {
        bikesCache = response.data; // Lưu kết quả vào cache
        fetchBikesPromise = null; // Dọn dẹp promise khi đã hoàn thành
        return bikesCache;
      })
      .catch((error) => {
        fetchBikesPromise = null; // Nếu lỗi, xóa promise để cho phép gọi lại ở lần sau
        throw error;
      });

    return fetchBikesPromise;
  },

  getBikeListingById: async (listingId) => {
    const response = await api.get(`/post/${listingId}`);
    return response.data;
  },

  updateBikeListing: async (listingId, data) => {
    const response = await api.put(`/post/update/${listingId}`, data);
    bikeService.clearCache(); // Tự động xóa cache khi cập nhật thông tin
    return response.data;
  },

  deleteBikeListing: async (listingId) => {
    const response = await api.delete(`/post/delete/${listingId}`);
    bikeService.clearCache(); // Tự động xóa cache khi xóa xe
    return response.data;
  },

  

  // Hàm tiện ích để chủ động dọn dẹp cache từ bên ngoài Component nếu cần
  clearCache: () => {
    bikesCache = null;
    fetchBikesPromise = null;
  },
};
