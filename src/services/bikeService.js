// File: src/services/bikeService.js
import api from "../config/api";

export const bikeService = {
  createBikeListing: async (data) => {
    const response = await api.post("/post/create", data);
    return response.data;
  },

  getAllBikeListings: async () => {
    const response = await api.get("/post/all");
    return response.data;
  },

  getBikeListingById: async (listingId) => {
    const response = await api.get(`/post/${listingId}`);
    return response.data;
  },

  updateBikeListing: async (listingId, data) => {
    const response = await api.put(`/post/update/${listingId}`, data);
    return response.data;
  },

  deleteBikeListing: async (listingId) => {
    const response = await api.delete(`/post/delete/${listingId}`);
    return response.data;
  },

  updatePostingStatus: async (listingId, statusData) => {
    const response = await api.put(
      `/post/updateStatus/${listingId}`,
      statusData,
    );
    return response.data;
  },
};
