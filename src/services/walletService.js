// File: src/services/walletService.js
import api from "../config/api";

export const walletService = {
  getWallet: async () => {
    const response = await api.get("/wallet");
    return response.data;
  },

  createVNPayUrl: async (amount) => {
    const currentOrigin = window.location.origin; // Sẽ tự động lấy 'http://localhost:5173' hoặc 'https://myweb.vercel.app'
    const dynamicReturnUrl = `${currentOrigin}/profile?tab=wallet`;

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
