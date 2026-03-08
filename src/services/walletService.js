// // File: src/services/walletService.js
// import api from "../config/api";

// export const walletService = {
//   getWallet: async () => {
//     const response = await api.get("/wallet");
//     return response.data;
//   },

//   addFunds: async (amount) => {
//     const response = await api.put("/wallet/add", { amount });
//     return response.data;
//   },

//   getTransactions: async () => {
//     const response = await api.get("/wallet/transactions");
//     return response.data;
//   },
// };
// File: src/services/walletService.js
import api from "../config/api";

export const walletService = {
  getWallet: async () => {
    const response = await api.get("/wallet");
    return response.data;
  },

  // (Đã thay thế) Hàm này chỉ dùng nếu bạn muốn cộng tiền trực tiếp không qua VNPay
  // addFunds: async (amount) => { ... }

  // 1. Gọi API Backend để lấy URL chuyển hướng sang VNPay Sandbox
  createVNPayUrl: async (amount) => {
    // Giả sử backend của bạn có endpoint này, truyền amount lên
    const response = await api.get(`/payment/create_vnpay?amount=${amount}`);
    return response.data;
  },

  // 2. Gửi chuỗi query string từ VNPay về Backend để xác thực và cộng tiền
  verifyVNPayReturn: async (queryString) => {
    const response = await api.get(`/payment/vnpay_return${queryString}`);
    return response.data;
  },
};
