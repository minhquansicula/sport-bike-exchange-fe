import api from "../config/api";

export const reservationService = {
  createReservation: async (listingId, data) => {
    const response = await api.post(`/reservations/${listingId}/create`, data);
    return response.data;
  },

  getAllReservations: async () => {
    const response = await api.get("/reservations");
    return response.data;
  },

  scheduleReservation: async (reservationId, data) => {
    const response = await api.put(
      `/reservations/${reservationId}/schedule`,
      data,
    );
    return response.data;
  },

  // THÊM HÀM NÀY ĐỂ USER LẤY DANH SÁCH CỦA CHÍNH MÌNH
  getMyReservations: async () => {
    const response = await api.get("/reservations/my-reservations");
    return response.data;
  },

  updateReservationStatus: async (reservationId, statusData) => {
    const response = await api.put(
      `/reservations/${reservationId}/status`,
      statusData,
    );
    return response.data;
  },

  scheduleReservation: async (reservationId, scheduleData) => {
    const response = await api.put(
      `/reservations/${reservationId}/schedule`,
      scheduleData,
    );
    return response.data;
  },
};
