import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdArrowBack,
  MdSave,
  MdCheckCircle,
  MdWarning,
  MdClose,
  MdCameraAlt,
  MdPedalBike,
  MdAddAPhoto,
  MdImage,
  MdPeople,
} from "react-icons/md";

const CreateReportPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    bikeCondition: "good",
    frameCheck: true,
    brakeCheck: true,
    wheelCheck: true,
    gearCheck: true,
    overallScore: 85,
    notes: "",
    issues: [],
    images: [],
  });

  // State điểm danh
  const [attendance, setAttendance] = useState({
    buyerPresent: false,
    sellerPresent: false,
  });

  const [newIssue, setNewIssue] = useState("");

  const handleAttendanceChange = (role) => {
    setAttendance((prev) => ({
      ...prev,
      [role]: !prev[role],
    }));
  };

  const isAttendanceComplete =
    attendance.buyerPresent && attendance.sellerPresent;

  // --- FIX MEMORY LEAK TẠI ĐÂY ---
  useEffect(() => {
    return () => {
      // Dọn dẹp URL Object khi component unmount (người dùng rời trang) để tránh tràn RAM
      formData.images.forEach((img) => URL.revokeObjectURL(img.preview));
    };
  }, [formData.images]);

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      id: Date.now() + Math.random(),
      file,
      preview: URL.createObjectURL(file), // Tạo URL tạm để preview
      name: file.name,
    }));
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
  };

  const removeImage = (imageId) => {
    // Dọn dẹp URL của ảnh bị xóa
    const imageToRemove = formData.images.find((img) => img.id === imageId);
    if (imageToRemove) {
      URL.revokeObjectURL(imageToRemove.preview);
    }

    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.id !== imageId),
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addIssue = () => {
    if (newIssue.trim()) {
      setFormData((prev) => ({
        ...prev,
        issues: [...prev.issues, newIssue.trim()],
      }));
      setNewIssue("");
    }
  };

  const removeIssue = (index) => {
    setFormData((prev) => ({
      ...prev,
      issues: prev.issues.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isAttendanceComplete) {
      alert("Vui lòng xác nhận điểm danh 2 bên trước khi lưu báo cáo!");
      return;
    }

    console.log("Report data:", formData);
    alert("Đã tạo báo cáo kiểm định thành công!");
    navigate("/inspector/tasks");
  };

  const checklistItems = [
    { name: "frameCheck", label: "Khung xe nguyên vẹn, không nứt/móp" },
    { name: "brakeCheck", label: "Hệ thống phanh hoạt động tốt" },
    { name: "wheelCheck", label: "Bánh xe, lốp, nan hoa đạt chuẩn" },
    { name: "gearCheck", label: "Hệ thống sang số mượt mà" },
  ];

  return (
    <div className="max-w-4xl mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-white rounded-full shadow-sm hover:bg-emerald-50 transition-colors"
        >
          <MdArrowBack size={24} className="text-gray-700" />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
            Tạo báo cáo kiểm định
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Đánh giá và cấp chứng nhận chất lượng xe
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Bike Info (Mock) */}
        <div className="bg-emerald-50 rounded-2xl border border-emerald-100/50 p-6">
          <h2 className="text-lg font-bold text-emerald-900 mb-4 flex items-center gap-2">
            <MdPedalBike className="text-emerald-600" /> Thông tin xe kiểm định
          </h2>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <img
              src="https://fxbike.vn/wp-content/uploads/2022/02/Trek-Marlin-7-2022-1-600x450.jpeg"
              alt="Bike"
              className="w-full sm:w-32 h-32 rounded-xl object-cover border-2 border-white shadow-sm"
            />
            <div className="w-full">
              <h3 className="font-black text-xl text-gray-900 mb-2">
                Trek Marlin 7 Gen 2
              </h3>
              <div className="grid grid-cols-2 gap-y-1 text-sm">
                <span className="text-gray-500">Mã GD:</span>{" "}
                <span className="font-semibold">#TRK-9921</span>
                <span className="text-gray-500">Người bán:</span>{" "}
                <span className="font-medium">Trần Thị B</span>
                <span className="text-gray-500">Người mua:</span>{" "}
                <span className="font-medium">Nguyễn Văn A</span>
                <span className="text-gray-500">Giá trị:</span>{" "}
                <span className="text-emerald-600 font-bold">12.500.000 đ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Điểm danh */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MdPeople className="text-emerald-500" />
            Xác nhận mặt đối mặt
            {isAttendanceComplete && (
              <span className="ml-2 px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wider">
                Đã đủ mặt
              </span>
            )}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Người mua */}
            <label
              className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                attendance.buyerPresent
                  ? "border-emerald-500 bg-emerald-50/50"
                  : "border-gray-100 bg-gray-50 hover:border-gray-200"
              }`}
            >
              <input
                type="checkbox"
                checked={attendance.buyerPresent}
                onChange={() => handleAttendanceChange("buyerPresent")}
                className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
              />
              <img
                src="https://i.pravatar.cc/150?u=1"
                alt="Buyer"
                className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
              />
              <div className="flex-1">
                <p className="text-[11px] text-gray-500 uppercase font-bold tracking-wider">
                  Người mua
                </p>
                <p className="font-bold text-gray-900">Nguyễn Văn A</p>
              </div>
              {attendance.buyerPresent && (
                <MdCheckCircle className="text-emerald-500" size={24} />
              )}
            </label>

            {/* Người bán */}
            <label
              className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                attendance.sellerPresent
                  ? "border-emerald-500 bg-emerald-50/50"
                  : "border-gray-100 bg-gray-50 hover:border-gray-200"
              }`}
            >
              <input
                type="checkbox"
                checked={attendance.sellerPresent}
                onChange={() => handleAttendanceChange("sellerPresent")}
                className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
              />
              <img
                src="https://i.pravatar.cc/150?u=2"
                alt="Seller"
                className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
              />
              <div className="flex-1">
                <p className="text-[11px] text-gray-500 uppercase font-bold tracking-wider">
                  Người bán
                </p>
                <p className="font-bold text-gray-900">Trần Thị B</p>
              </div>
              {attendance.sellerPresent && (
                <MdCheckCircle className="text-emerald-500" size={24} />
              )}
            </label>
          </div>

          {!isAttendanceComplete && (
            <p className="mt-4 text-sm text-yellow-600 flex items-center gap-2 bg-yellow-50 p-3 rounded-lg border border-yellow-100">
              <MdWarning size={18} />
              Vui lòng điểm danh đủ cả hai bên trước khi ban hành báo cáo kiểm
              định!
            </p>
          )}
        </div>

        {/* Checklist */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MdCheckCircle className="text-emerald-500" />
            Checklist kiểm tra
          </h2>

          <div className="space-y-3">
            {checklistItems.map((item) => (
              <label
                key={item.name}
                className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer border border-transparent hover:border-gray-200"
              >
                <input
                  type="checkbox"
                  name={item.name}
                  checked={formData[item.name]}
                  onChange={handleChange}
                  className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                />
                <span className="text-gray-700 font-medium">{item.label}</span>
                {formData[item.name] ? (
                  <MdCheckCircle
                    className="ml-auto text-emerald-500"
                    size={22}
                  />
                ) : (
                  <MdWarning className="ml-auto text-gray-300" size={22} />
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Overall Score */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Đánh giá tổng thể
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Tình trạng xe
              </label>
              <select
                name="bikeCondition"
                value={formData.bikeCondition}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-50 bg-white font-medium"
              >
                <option value="excellent">Xuất sắc - Như mới</option>
                <option value="good">Tốt - Ít dấu hiệu sử dụng</option>
                <option value="fair">
                  Khá - Có dấu hiệu sử dụng bình thường
                </option>
                <option value="poor">Kém - Cần sửa chữa nhiều</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Điểm đánh giá:{" "}
                <strong className="text-emerald-600 text-lg">
                  {formData.overallScore}%
                </strong>
              </label>
              <div className="flex items-center h-[46px] bg-gray-50 px-4 border border-gray-200 rounded-xl">
                <input
                  type="range"
                  name="overallScore"
                  min="0"
                  max="100"
                  value={formData.overallScore}
                  onChange={handleChange}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1.5 font-medium px-1">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Issues */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MdWarning className="text-yellow-500" />
            Vấn đề phát hiện (nếu có)
          </h2>

          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <input
              type="text"
              placeholder="VD: Xước nhẹ ở khung sườn trái..."
              value={newIssue}
              onChange={(e) => setNewIssue(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), addIssue())
              }
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-50"
            />
            <button
              type="button"
              onClick={addIssue}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 font-bold transition-colors"
            >
              Thêm lỗi
            </button>
          </div>

          {formData.issues.length > 0 && (
            <ul className="space-y-2 mt-4">
              {formData.issues.map((issue, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between p-3.5 bg-yellow-50 border border-yellow-100 rounded-xl"
                >
                  <span className="text-sm text-yellow-800 font-medium">
                    • {issue}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeIssue(index)}
                    className="p-1.5 bg-white text-yellow-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shadow-sm"
                  >
                    <MdClose size={18} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Image Upload */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MdAddAPhoto className="text-emerald-500" />
            Thêm hình ảnh thực tế
          </h2>

          {/* Upload Area */}
          <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-gray-50 hover:bg-emerald-50 hover:border-emerald-300 transition-colors mb-6 group">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                <MdCameraAlt className="w-6 h-6 text-emerald-500" />
              </div>
              <p className="mb-1 text-sm text-gray-600">
                <span className="font-bold text-emerald-600">
                  Click để tải ảnh
                </span>{" "}
                hoặc kéo thả vào đây
              </p>
              <p className="text-xs text-gray-400 font-medium">
                Hỗ trợ PNG, JPG (Tối đa 10MB)
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
            />
          </label>

          {/* Image Preview Grid */}
          {formData.images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 animate-in fade-in">
              {formData.images.map((image) => (
                <div
                  key={image.id}
                  className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 shadow-sm"
                >
                  <img
                    src={image.preview}
                    alt={image.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-transform hover:scale-110 shadow-lg"
                    >
                      <MdClose size={20} />
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white text-xs truncate font-medium">
                      {image.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {formData.images.length === 0 && (
            <div className="text-center py-6 text-gray-400 text-sm flex flex-col items-center justify-center gap-2 border border-gray-100 rounded-xl bg-gray-50">
              <MdImage size={24} className="text-gray-300" />
              Chưa có hình ảnh nào được thêm
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Ghi chú riêng của Inspector
          </h2>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            placeholder="Nhập ghi chú ẩn rủi ro, nhận xét chuyên môn về xe (Người dùng sẽ không thấy phần này)..."
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-50 resize-none bg-gray-50"
          />
        </div>

        {/* Sticky Actions Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 sticky bottom-0 bg-gray-50 py-4 border-t border-gray-200 z-10 -mx-4 px-4 md:mx-0 md:px-0">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-bold hover:bg-gray-100 transition-colors shadow-sm"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            className={`inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all shadow-lg ${
              isAttendanceComplete
                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200 hover:shadow-emerald-300 active:scale-95"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <MdSave size={20} /> Ban hành chứng nhận
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateReportPage;
