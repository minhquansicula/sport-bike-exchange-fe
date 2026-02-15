import api from "../config/api";

export const userService = {
  // 1. Lấy thông tin cá nhân (Gọi vào endpoint mới /users/myInfo)
  getMyInfo: async () => {
    const response = await api.get("/users/myInfo");
    return response.data; // Trả về ApiResponse
  },

  // 2. Cập nhật thông tin (Gọi vào PUT /users/{id})
  updateUser: async (userId, data) => {
    // data là object chứa: fullName, phone, address, email...
    const response = await api.put(`/users/${userId}`, data);
    return response.data;
  },

  // 3. (Tuỳ chọn) Đổi mật khẩu hoặc các tác vụ khác liên quan user...
};
