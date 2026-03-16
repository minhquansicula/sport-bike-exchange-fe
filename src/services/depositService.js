import api from "../config/api";

export const depositService = {
  // Đặt cọc thông thường (Nếu cần)
  createDeposit: async (listingId, data) => {
    const response = await api.post(`/deposits/${listingId}/create`, data);
    return response.data;
  },

  // Đặt cọc xe trên sàn (Qua listingId)
  createDepositViaVNPay: async (listingId) => {
    const response = await api.post(`/deposits/${listingId}/create-vnpay`);
    return response.data;
  },

  confirmDepositPayment: async (depositId) => {
    const response = await api.post(`/deposits/confirm/${depositId}`);
    return response.data;
  },

  // --- THÊM HÀM MỚI: ĐẶT CỌC DÀNH CHO XE SỰ KIỆN ---
  createDepositViaVNPayForEvent: async (eventBikeId) => {
    const response = await api.post(
      `/deposits/${eventBikeId}/event/create-vnpay`,
    );
    return response.data;
  },

  confirmDepositPaymentForEvent: async (depositId, username, vnpayAmount) => {
    const response = await api.post(
      `/deposits/confirm/event/${depositId}?username=${username}&vnpayAmount=${vnpayAmount}`,
    );
    return response.data;
  },
};
