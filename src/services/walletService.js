// File: src/services/walletService.js
import api from "../config/api";

export const walletService = {
  getWallet: async () => {
    const response = await api.get("/wallet");
    return response.data;
  },

  createVNPayUrl: async (amount) => {
    const currentOrigin = window.location.origin;
    const dynamicReturnUrl = `${currentOrigin}/profile`;

    const response = await api.post("/payments/submitOrder", {
      amount: amount,
      orderInfo: "Nap tien vao vi VeloX",
      returnUrl: dynamicReturnUrl, // Gửi kèm đường link về cho Backend
    });
    return response.data;
  },

  verifyVNPayReturn: async (queryString) => {
    const response = await api.get(`/payments/vnpay-payment${queryString}`);
    return response.data;
  },
};
