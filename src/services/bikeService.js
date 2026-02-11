import api from "../config/api";

export const bikeService = {
  // Lấy danh sách xe thật từ Database
  getAllBikes: async () => {
    const response = await api.get("/bike-listings");
    return response.data.result; // Trả về mảng xe từ result của ApiResponse
  },

  // Đăng tin mới lên Server
  createBike: async (bikeData) => {
    const response = await api.post("/bike-listings", bikeData);
    return response.data;
  },
};
