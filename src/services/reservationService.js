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

  getMyReservationsWithEventBicycle: async () => {
    const response = await api.get(
      "/reservations/eventBicycle/my-reservations",
    );
    return response.data;
  },

  updateReservationStatus: async (reservationId, statusData) => {
    const response = await api.put(
      `/reservations/${reservationId}/status`,
      statusData,
    );
    return response.data;
  },

  // Hủy đặt cọc
  cancelReservation: async (reservationId) => {
    const response = await api.put(`/reservations/cancel/${reservationId}`);
    return response.data;
  },

  // Yêu cầu hủy giao dịch (dành cho người bán)
  requestCancelReservationBySeller: async (reservationId, data) => {
    const response = await api.put(
      `/reservations/${reservationId}/request-cancel`,
      data,
    );
    return response.data;
  },

  // Admin duyệt yêu cầu hủy giao dịch
  approveCancelReservationByAdmin: async (reservationId) => {
    const response = await api.put(
      `/reservations/${reservationId}/approve-cancel`,
    );
    return response.data;
  },

  // Admin từ chối yêu cầu hủy giao dịch
  rejectCancelReservationByAdmin: async (reservationId) => {
    const response = await api.put(
      `/reservations/${reservationId}/reject-cancel`,
    );
    return response.data;
  },

  // Thanh toán cuối sau khi kiểm định PASSED
  finalPayment: async (reservationId) => {
    const response = await api.post(
      `/reservations/${reservationId}/final-payment`,
    );
    return response.data;
  },

  // Hoàn tiền đặt cọc khi kiểm định thất bại
  refundDepositAfterInspectionFail: async (reservationId) => {
    const response = await api.post(
      `/reservations/${reservationId}/refund-inspection-fail`,
    );
    return response.data;
  },

  // Người bán nhận tiền đền bù khi người mua không đến kiểm định
  transferDepositToSellerAfterBuyerNoShow: async (reservationId) => {
    const response = await api.post(
      `/reservations/${reservationId}/compensation-buyer-no-show`,
    );
    return response.data;
  },

  // Admin chuyển tiền cho seller sau khi buyer hoàn tất thanh toán
  payoutToSeller: async (reservationId) => {
    const response = await api.post(
      `/reservations/${reservationId}/payout-seller`,
    );
    return response.data;
  },
};
