import api from "../config/api";

export const userService = {
  // 1. Lấy thông tin cá nhân
  getMyInfo: async () => {
    const response = await api.get("/users/myInfo");
    return response.data;
  },

  // 2. Cập nhật thông tin
  updateUser: async (userId, data) => {
    const response = await api.put(`/users/${userId}`, data);
    return response.data;
  },

  // 3. Đổi mật khẩu
  changePassword: async (userId, oldPassword, newPassword) => {
    const response = await api.put(`/users/password/${userId}`, {
      oldPassword: oldPassword,
      newPassword: newPassword,
    });
    return response.data;
  },

  // 4. Tạo mật khẩu mới
  changePasswordWithEmail: async (newPassword) => {
    const response = await api.put(`/users/emailPassword`, {
      newPassword: newPassword,
    });
    return response.data;
  },

  // ==========================================
  // CÁC HÀM DÀNH CHO QUẢN TRỊ VIÊN (ADMIN)
  // ==========================================

  // 5. Lấy danh sách tất cả user
  getAllUsers: async () => {
    const response = await api.get("/users");
    return response.data; // Trả về ApiResponse
  },

  // 6. Khóa / Mở khóa tài khoản (Dựa theo API deActiveUser của bạn)
  toggleUserStatus: async (userId) => {
    const response = await api.put(`/users/deactivate/${userId}`);
    return response.data;
  },

  // 7. Thay đổi Role (Tùy chọn - nếu sau này bạn dùng nút Edit)
  changeRole: async (userId, roleData) => {
    const response = await api.put(`/users/role/${userId}`, roleData);
    return response.data;
  },
};
