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

  // 3. Đổi mật khẩu (dành cho user ĐÃ có mật khẩu)
  changePassword: async (userId, oldPassword, newPassword) => {
    const response = await api.put(`/users/password/${userId}`, {
      oldPassword: oldPassword,
      newPassword: newPassword,
    });
    return response.data;
  },

  // 4. Tạo mật khẩu mới (dành cho user chưa có mật khẩu - Google Login)
  changePasswordWithEmail: async (newPassword) => {
    const response = await api.put(`/users/emailPassword`, {
      newPassword: newPassword,
    });
    return response.data;
  },
};
