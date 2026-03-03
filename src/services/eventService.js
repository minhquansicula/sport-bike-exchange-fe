import api from "../config/api"; // Đảm bảo đường dẫn tới file config api của bạn là đúng

export const eventService = {
  // Lấy tất cả sự kiện
  getAllEvents: async () => {
    const response = await api.get("/events");
    return response.data;
  },

  // Lấy chi tiết 1 sự kiện theo ID
  getEventById: async (eventId) => {
    const response = await api.get(`/events/${eventId}`);
    return response.data;
  },

  // Tạo sự kiện mới
  createEvent: async (eventData) => {
    const response = await api.post("/events", eventData);
    return response.data;
  },

  // Cập nhật sự kiện
  updateEvent: async (eventId, eventData) => {
    const response = await api.put(`/events/${eventId}`, eventData);
    return response.data;
  },

  // Xóa sự kiện
  deleteEvent: async (eventId) => {
    const response = await api.delete(`/events/${eventId}`);
    return response.data;
  },
};
