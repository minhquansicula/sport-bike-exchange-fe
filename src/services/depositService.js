import api from "../config/api";

export const depositService = {
  // Đặt cọc thông thường
  createDeposit: async (listingId, data) => {
    const response = await api.post(`/deposits/${listingId}/create`, data);
    return response.data;
  },

  // GỌI API ĐẶT CỌC QUA VNPAY (HOẶC TRỪ THẲNG TỪ VÍ)
  createDepositViaVNPay: async (listingId) => {
    const response = await api.post(`/deposits/${listingId}/create-vnpay`);
    return response.data;
  },

  confirmDepositPayment: async (depositId) => {
    const response = await api.post(`/deposits/confirm/${depositId}`);
    return response.data;
  },
};
