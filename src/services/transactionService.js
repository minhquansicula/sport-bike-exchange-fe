import api from "../config/api";

/**
 * Service quản lý các lệnh gọi API liên quan đến Giao dịch (Transaction)
 */
export const transactionService = {
  /**
   * Lấy danh sách giao dịch mà người dùng hiện tại tham gia (với tư cách người mua hoặc người bán)
   * Tương ứng với API: GET /transactions/my-transactions
   */
  getMyTransactions: async () => {
    const response = await api.get("/transactions/my-transactions");
    return response.data;
  },

  // Lấy chi tiết một giao dịch
  getTransactionById: async (transactionId) => {
    const response = await api.get(`/transactions/${transactionId}`);
    return response.data;
  },

  /**
   * Lấy lịch sử giao dịch dựa trên trạng thái (dành cho Admin hoặc lọc FE)
   */
  getTransactionsByStatus: async (status) => {
    try {
      // Đã sửa axiosClient thành api
      const response = await api.get(`/transactions/status/${status}`);
      return response.data;
    } catch (error) {
      console.error(`Error in getTransactionsByStatus (${status}):`, error);
      throw error;
    }
  },

  /**
   * Cập nhật trạng thái giao dịch (nếu Backend có hỗ trợ)
   */
  updateTransactionStatus: async (transactionId, statusData) => {
    try {
      // Đã sửa axiosClient thành api
      const response = await api.put(
        `/transactions/${transactionId}`,
        statusData,
      );
      return response.data;
    } catch (error) {
      console.error("Error in updateTransactionStatus:", error);
      throw error;
    }
  },
};
