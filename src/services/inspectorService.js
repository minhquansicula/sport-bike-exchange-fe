import api from "../config/api";

export const inspectorService = {
  // Lấy danh sách nhiệm vụ (có thể filter theo status, search)
  getTasks: async (params = {}) => {
    const response = await api.get("/inspector/tasks", { params });
    return response.data;
  },

  // Lấy chi tiết một nhiệm vụ
  getTaskById: async (taskId) => {
    const response = await api.get(`/inspector/tasks/${taskId}`);
    return response.data;
  },

  // Tạo báo cáo kiểm định
  createReport: async (taskId, data) => {
    const response = await api.post(`/inspector/tasks/${taskId}/report`, data);
    return response.data;
  },

  // Cập nhật thông tin cá nhân inspector
  updateProfile: async (data) => {
    const response = await api.put("/inspector/profile", data);
    return response.data;
  },
};
