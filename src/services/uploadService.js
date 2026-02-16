import api from "../config/api";

export const uploadService = {
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append("file", file); // Tên "file" phải khớp với @RequestParam bên Backend

    const response = await api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data; // Trả về ApiResponse (kết quả nằm trong .result)
  },
};
