import React, { useState } from "react";
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
  MdPerson,
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

  const handleAttendanceChange = (role) => {
    setAttendance((prev) => ({
      ...prev,
      [role]: !prev[role],
    }));
  };

  const isAttendanceComplete = attendance.buyerPresent && attendance.sellerPresent;

  const [newIssue, setNewIssue] = useState("");

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      id: Date.now() + Math.random(),
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
  };

  const removeImage = (imageId) => {
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
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <MdArrowBack size={24} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tạo báo cáo kiểm định</h1>
          <p className="text-gray-500 text-sm mt-1">
            Điền thông tin kiểm tra xe đạp
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Bike Info (Mock) */}
        <div className="bg-emerald-50 rounded-xl border border-emerald-100 p-6">
          <h2 className="text-lg font-semibold text-emerald-900 mb-4 flex items-center gap-2">
            <MdPedalBike className="text-emerald-600" />
            Thông tin xe kiểm định
          </h2>
          <div className="flex items-center gap-4">
            <img
              src="https://fxbike.vn/wp-content/uploads/2022/02/Trek-Marlin-7-2022-1-600x450.jpeg"
              alt="Bike"
              className="w-24 h-24 rounded-lg object-cover border border-emerald-200"
            />
            <div>
              <h3 className="font-bold text-gray-900">Trek Marlin 7 Gen 2</h3>
              <p className="text-sm text-gray-500">Người bán: Trần Thị B</p>
              <p className="text-sm text-gray-500">Người mua: Nguyễn Văn A</p>
              <p className="text-sm text-emerald-600 font-medium">Giá: 12,500,000đ</p>
            </div>
          </div>
        </div>

        {/* Điểm danh */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MdPeople className="text-emerald-500" />
            Điểm danh
            {isAttendanceComplete && (
              <span className="ml-2 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                Đã đủ
              </span>
            )}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Người mua */}
            <label
              className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                attendance.buyerPresent
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-gray-200 bg-gray-50 hover:border-gray-300"
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
                className="w-12 h-12 rounded-full border-2 border-white shadow"
              />
              <div className="flex-1">
                <p className="text-xs text-gray-500 uppercase font-medium">Người mua</p>
                <p className="font-semibold text-gray-900">Nguyễn Văn A</p>
              </div>
              {attendance.buyerPresent && (
                <MdCheckCircle className="text-emerald-500" size={24} />
              )}
            </label>

            {/* Người bán */}
            <label
              className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                attendance.sellerPresent
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-gray-200 bg-gray-50 hover:border-gray-300"
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
                className="w-12 h-12 rounded-full border-2 border-white shadow"
              />
              <div className="flex-1">
                <p className="text-xs text-gray-500 uppercase font-medium">Người bán</p>
                <p className="font-semibold text-gray-900">Trần Thị B</p>
              </div>
              {attendance.sellerPresent && (
                <MdCheckCircle className="text-emerald-500" size={24} />
              )}
            </label>
          </div>

          {!isAttendanceComplete && (
            <p className="mt-4 text-sm text-yellow-600 flex items-center gap-2">
              <MdWarning size={16} />
              Vui lòng điểm danh đủ cả hai bên trước khi tiến hành kiểm định
            </p>
          )}
        </div>

        {/* Checklist */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MdCheckCircle className="text-emerald-500" />
            Checklist kiểm tra
          </h2>

          <div className="space-y-3">
            {checklistItems.map((item) => (
              <label
                key={item.name}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <input
                  type="checkbox"
                  name={item.name}
                  checked={formData[item.name]}
                  onChange={handleChange}
                  className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                />
                <span className="text-gray-700">{item.label}</span>
                {formData[item.name] ? (
                  <MdCheckCircle className="ml-auto text-emerald-500" size={20} />
                ) : (
                  <MdWarning className="ml-auto text-yellow-500" size={20} />
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Overall Score */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Đánh giá tổng thể
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tình trạng xe
              </label>
              <select
                name="bikeCondition"
                value={formData.bikeCondition}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-50 bg-white"
              >
                <option value="excellent">Xuất sắc - Như mới</option>
                <option value="good">Tốt - Ít dấu hiệu sử dụng</option>
                <option value="fair">Khá - Có dấu hiệu sử dụng bình thường</option>
                <option value="poor">Kém - Cần sửa chữa</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Điểm đánh giá: <strong className="text-emerald-600">{formData.overallScore}%</strong>
              </label>
              <input
                type="range"
                name="overallScore"
                min="0"
                max="100"
                value={formData.overallScore}
                onChange={handleChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Issues */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MdWarning className="text-yellow-500" />
            Vấn đề phát hiện (nếu có)
          </h2>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Nhập vấn đề phát hiện..."
              value={newIssue}
              onChange={(e) => setNewIssue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addIssue())}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-300"
            />
            <button
              type="button"
              onClick={addIssue}
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium transition-colors"
            >
              Thêm
            </button>
          </div>

          {formData.issues.length > 0 && (
            <ul className="space-y-2">
              {formData.issues.map((issue, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-100 rounded-lg"
                >
                  <span className="text-sm text-yellow-800">• {issue}</span>
                  <button
                    type="button"
                    onClick={() => removeIssue(index)}
                    className="p-1 text-yellow-600 hover:text-red-500 transition-colors"
                  >
                    <MdClose size={18} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Image Upload */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MdAddAPhoto className="text-emerald-500" />
            Thêm hình ảnh
          </h2>

          {/* Upload Area */}
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors mb-4">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <MdCameraAlt className="w-10 h-10 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click để tải ảnh</span> hoặc kéo thả vào đây
              </p>
              <p className="text-xs text-gray-400">PNG, JPG (tối đa 10MB)</p>
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.images.map((image) => (
                <div
                  key={image.id}
                  className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200"
                >
                  <img
                    src={image.preview}
                    alt={image.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <MdClose size={18} />
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                    <p className="text-white text-xs truncate">{image.name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {formData.images.length === 0 && (
            <div className="text-center py-4 text-gray-400 text-sm flex items-center justify-center gap-2">
              <MdImage size={18} />
              Chưa có hình ảnh nào được thêm
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Ghi chú thêm
          </h2>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            placeholder="Nhập ghi chú, nhận xét thêm về xe..."
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-50 resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-emerald-200"
          >
            <MdSave size={18} />
            Lưu báo cáo
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateReportPage;