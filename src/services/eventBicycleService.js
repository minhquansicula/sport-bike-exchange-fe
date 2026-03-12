import api from "../config/api";

export const eventBicycleService = {
  // Tạo xe đạp mới cho sự kiện
  createBicycle: async (bicycleData) => {
    const response = await api.post(
      "/event-bicycles/bicycle/create",
      bicycleData,
    );
    return response.data;
  },

  // Đăng ký xe vào sự kiện (không qua bài đăng public)
  registerBicycleToEventWithoutPosting: async (eventId, bicycleId) => {
    const response = await api.post(
      `/event-bicycles/event/${eventId}/bicycle/${bicycleId}/register`,
    );
    return response.data;
  },

  // Lấy danh sách tất cả xe trong sự kiện (dành cho Admin)
  getAllEventBicycles: async () => {
    const response = await api.get("/event-bicycles");
    return response.data;
  },

  // Cập nhật trạng thái xe trong sự kiện
  updateEventBicycleStatus: async (eventBikeId) => {
    const response = await api.put(`/event-bicycles/${eventBikeId}/status`);
    return response.data;
  },
};
