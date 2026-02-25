import api from "../config/api";

export const bikeService = {
  createBikeListing: async (data) => {
    const response = await api.post("/bike-listings", data);
    return response.data;
  },

  getAllBikeListings: async () => {
    const response = await api.get("/bike-listings");
    return response.data;
  },

  getBikeListingById: async (listingId) => {
    const response = await api.get(`/bike-listings/${listingId}`);
    return response.data;
  },

  updateBikeListing: async (listingId, data) => {
    const response = await api.put(`/bike-listings/${listingId}`, data);
    return response.data;
  },

  deleteBikeListing: async (listingId) => {
    const response = await api.delete(`/bike-listings/${listingId}`);
    return response.data;
  },
};
