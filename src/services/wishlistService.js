// File: src/services/wishlistService.js
import api from "../config/api";

export const wishlistService = {
  // Lấy danh sách wishlist của user đang đăng nhập
  getMyWishlist: async () => {
    const response = await api.get("/wishlists/my-wishlist");
    return response.data;
  },

  // Thêm xe vào wishlist
  addToWishlist: async (listingId) => {
    const response = await api.post(`/wishlists/add/${listingId}`);
    return response.data;
  },

  // Xóa xe khỏi wishlist
  removeFromWishlist: async (listingId) => {
    const response = await api.delete(`/wishlists/remove/${listingId}`);
    return response.data;
  },

  // Toggle (thêm hoặc xóa) xe trong wishlist
  toggleWishlist: async (listingId) => {
    const response = await api.post(`/wishlists/toggle/${listingId}`);
    return response.data;
  },

  // Kiểm tra xe có trong wishlist không
  isInWishlist: async (listingId) => {
    const response = await api.get(`/wishlists/check/${listingId}`);
    return response.data;
  },

  // Lấy chi tiết 1 wishlist item
  getWishlistById: async (wishlistId) => {
    const response = await api.get(`/wishlists/${wishlistId}`);
    return response.data;
  },

  // Đếm số lượt wishlist của 1 listing
  getWishlistCount: async (listingId) => {
    const response = await api.get(`/wishlists/count/${listingId}`);
    return response.data;
  },
};
