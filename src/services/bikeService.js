// // File: src/services/bikeService.js
// import api from "../config/api";

// // 1. Khởi tạo biến lưu trữ cache trên RAM
// let bikesCache = null;

// // 2. Khởi tạo biến lưu trữ Promise để tránh gọi API trùng lặp cùng một thời điểm
// let fetchBikesPromise = null;

// let myBikesCache = null;

// export const bikeService = {
//   createBikeListing: async (data) => {
//     const response = await api.post("/post/create", data);
//     bikeService.clearCache(); // Tự động xóa cache để cập nhật xe mới
//     return response.data;
//   },

//   getAllBikeListings: async (forceRefresh = false) => {
//     // Trường hợp 1: Đã có dữ liệu trong cache -> Trả về ngay lập tức (0ms)
//     if (bikesCache && !forceRefresh) {
//       return bikesCache;
//     }

//     // Trường hợp 2: Đang có một request lấy xe đang chạy ngầm -> Dùng chung request đó, không tạo request mới
//     if (fetchBikesPromise && !forceRefresh) {
//       return fetchBikesPromise;
//     }

//     // Trường hợp 3: Chưa có cache và chưa có request nào -> Gọi API
//     fetchBikesPromise = api
//       .get("/post/all")
//       .then((response) => {
//         bikesCache = response.data; // Lưu kết quả vào cache
//         fetchBikesPromise = null; // Dọn dẹp promise khi đã hoàn thành
//         return bikesCache;
//       })
//       .catch((error) => {
//         fetchBikesPromise = null; // Nếu lỗi, xóa promise để cho phép gọi lại ở lần sau
//         throw error;
//       });

//     return fetchBikesPromise;
//   },

//   getBikeListingById: async (listingId) => {
//     const response = await api.get(`/post/${listingId}`);
//     return response.data;
//   },

//   updateBikeListing: async (listingId, data) => {
//     const response = await api.put(`/post/update/${listingId}`, data);
//     bikeService.clearCache(); // Tự động xóa cache khi cập nhật thông tin
//     return response.data;
//   },

//   deleteBikeListing: async (listingId) => {
//     const response = await api.delete(`/post/delete/${listingId}`);
//     bikeService.clearCache(); // Tự động xóa cache khi xóa xe
//     return response.data;
//   },

//   updatePostingStatus: async (listingId, statusData) => {
//     const response = await api.put(
//       `/post/updateStatus/${listingId}`,
//       statusData,
//     );
//     bikeService.clearCache(); // Tự động xóa cache khi đổi trạng thái xe
//     return response.data;
//   },

//   getMyBikeListings: async (forceRefresh = false) => {
//     if (myBikesCache && !forceRefresh) {
//       return myBikesCache;
//     }

//     const response = await api.get("/post/my-posts");
//     myBikesCache = response.data;
//     return myBikesCache;
//   },

//   clearCache: () => {
//     bikesCache = null;
//     myBikesCache = null; // Xóa cả cache cá nhân
//     fetchBikesPromise = null;
//   },
// };

import api from "../config/api";

// Chỉ giữ cache cho các xe Public
let bikesCache = null;
let fetchBikesPromise = null;

export const bikeService = {
  createBikeListing: async (data) => {
    const response = await api.post("/post/create", data);
    bikeService.clearCache();
    return response.data;
  },

  getAllBikeListings: async (forceRefresh = false) => {
    if (bikesCache && !forceRefresh) return bikesCache;
    if (fetchBikesPromise && !forceRefresh) return fetchBikesPromise;

    fetchBikesPromise = api
      .get("/post/all")
      .then((response) => {
        bikesCache = response.data;
        fetchBikesPromise = null;
        return bikesCache;
      })
      .catch((error) => {
        fetchBikesPromise = null;
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
    bikeService.clearCache();
    return response.data;
  },

  deleteBikeListing: async (listingId) => {
    const response = await api.delete(`/post/delete/${listingId}`);
    bikeService.clearCache();
    return response.data;
  },

  updatePostingStatus: async (listingId, statusData) => {
    const response = await api.put(
      `/post/updateStatus/${listingId}`,
      statusData,
    );
    bikeService.clearCache();
    return response.data;
  },

  getMyBikeListings: async () => {
    const response = await api.get("/post/my-posts");
    return response.data;
  },

  // --- API LẤY THƯ VIỆN XE (BICYCLE LIBRARY) ---
  getBicycleLibrary: async (brandName, year) => {
    let url = "/bicycle-library";
    const params = new URLSearchParams();

    if (brandName) params.append("brandName", brandName);
    if (year) params.append("year", year);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await api.get(url);
    return response.data;
  },

  clearCache: () => {
    bikesCache = null;
    fetchBikesPromise = null;
  },
};
