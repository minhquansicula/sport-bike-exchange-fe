// import api from "../config/api";

// export const inspectorService = {
//   // Lấy danh sách nhiệm vụ (có thể filter theo status, search)
//   getTasks: async (params = {}) => {
//     const response = await api.get("/inspector/tasks", { params });
//     return response.data;
//   },

//   // Lấy chi tiết một nhiệm vụ
//   getTaskById: async (taskId) => {
//     const response = await api.get(`/inspector/tasks/${taskId}`);
//     return response.data;
//   },

//   // Tạo báo cáo kiểm định — gọi đúng endpoint backend
//   createInspectionReport: async (reservationId, data) => {
//     const response = await api.post(
//       `/inspection-reports/reservation/${reservationId}/create`,
//       data,
//     );
//     return response.data;
//   },

//   // Lấy báo cáo kiểm định theo ID
//   getInspectionReport: async (reportId) => {
//     const response = await api.get(`/inspection-reports/${reportId}`);
//     return response.data;
//   },

//   // Lấy báo cáo kiểm định theo reservationId (dành cho buyer/seller xem)
//   getReservationInspectionReport: async (reservationId) => {
//     const response = await api.get(
//       `/inspection-reports/reservation/${reservationId}/report`,
//     );
//     return response.data;
//   },

//   // Cập nhật thông tin cá nhân inspector
//   updateProfile: async (data) => {
//     const response = await api.put("/inspector/profile", data);
//     return response.data;
//   },
// };

import api from "../config/api";

export const inspectorService = {
  // ĐÃ SỬA: Loại bỏ params vì Backend chưa hỗ trợ query parameters
  getTasks: async () => {
    const response = await api.get("/inspector/tasks");
    return response.data;
  },

  // Lấy chi tiết một nhiệm vụ
  getTaskById: async (taskId) => {
    const response = await api.get(`/inspector/tasks/${taskId}`);
    return response.data;
  },

  // Tạo báo cáo kiểm định — gọi đúng endpoint backend
  createInspectionReport: async (reservationId, data) => {
    const response = await api.post(
      `/inspection-reports/reservation/${reservationId}/create`,
      data,
    );
    return response.data;
  },

  // Lấy báo cáo kiểm định theo ID
  getInspectionReport: async (reportId) => {
    const response = await api.get(`/inspection-reports/${reportId}`);
    return response.data;
  },

  // Lấy báo cáo kiểm định theo reservationId (dành cho buyer/seller xem)
  getReservationInspectionReport: async (reservationId) => {
    const response = await api.get(
      `/inspection-reports/reservation/${reservationId}/report`,
    );
    return response.data;
  },

  // Cập nhật thông tin cá nhân inspector
  updateProfile: async (data) => {
    const response = await api.put("/inspector/profile", data);
    return response.data;
  },
};
