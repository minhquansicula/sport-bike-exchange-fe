import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
// Import Icons
import {
  MdArrowBack,
  MdCloudUpload,
  MdDelete,
  MdPedalBike,
  MdAttachMoney,
  MdDescription,
  MdCheckCircle,
  MdStraighten, // Icon thước kẻ (Frame)
  MdDonutLarge, // Icon bánh xe (Wheel)
  MdSpeed, // Icon tốc độ (Gears)
  MdFitnessCenter, // Icon cân nặng (Weight)
  MdCalendarToday, // Icon lịch (Year)
  MdErrorOutline, // Icon phanh (Brake)
} from "react-icons/md";

// Validation Schema với Yup
const postBikeValidationSchema = Yup.object({
  name: Yup.string()
    .required("Vui lòng nhập tên xe")
    .min(5, "Tên xe phải có ít nhất 5 ký tự"),
  brand: Yup.string().required("Vui lòng chọn thương hiệu"),
  type: Yup.string().required("Vui lòng chọn loại xe"),
  year: Yup.number()
    .nullable()
    .min(1900, "Năm sản xuất không hợp lệ")
    .max(new Date().getFullYear(), "Năm sản xuất không được vượt quá năm hiện tại"),
  condition: Yup.number().min(50).max(100).required(),
  price: Yup.number()
    .required("Vui lòng nhập giá bán")
    .min(100000, "Giá bán tối thiểu là 100,000 VNĐ"),
  frame: Yup.string(),
  wheel: Yup.string(),
  brake: Yup.string(),
  gears: Yup.string(),
  weight: Yup.number().nullable().positive("Trọng lượng phải là số dương"),
  description: Yup.string(),
});

const PostBikePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);

  // Mock upload ảnh
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (values, { setSubmitting }) => {
    // Giả lập gửi API
    setTimeout(() => {
      setSubmitting(false);
      // Log dữ liệu ra console để bạn kiểm tra
      console.log("Dữ liệu xe mới:", { ...values, images });
      alert("Đăng tin thành công! Xe của bạn đang chờ kiểm duyệt.");
      navigate("/bikes");
    }, 1500);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        {/* ... (Phần UI chưa đăng nhập giữ nguyên như cũ) ... */}
        <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4">
          <MdPedalBike size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Bạn cần đăng nhập
        </h2>
        <p className="text-gray-500 mb-6 text-center max-w-md">
          Vui lòng đăng nhập để đăng tin bán xe và quản lý giao dịch.
        </p>
        <div className="flex gap-4">
          <Link
            to="/"
            className="px-6 py-2 rounded-full border border-gray-300 font-bold hover:bg-gray-100"
          >
            Về trang chủ
          </Link>
          <Link
            to="/login"
            className="px-6 py-2 rounded-full bg-orange-600 text-white font-bold hover:bg-orange-700"
          >
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 font-sans">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header Form */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white border border-gray-200 rounded-full hover:bg-orange-50 hover:text-orange-600 transition-colors"
          >
            <MdArrowBack size={24} />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900">
              Đăng tin bán xe
            </h1>
            <p className="text-gray-500 text-sm">
              Điền đầy đủ thông số kỹ thuật giúp xe của bạn bán nhanh hơn.
            </p>
          </div>
        </div>

        <Formik
          initialValues={{
            name: "",
            brand: "",
            type: "",
            year: "",
            frame: "",
            wheel: "",
            brake: "",
            gears: "",
            weight: "",
            condition: 90,
            price: "",
            description: "",
          }}
          validationSchema={postBikeValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting, values, setFieldValue }) => (
            <Form className="space-y-6">
              {/* --- 1. THÔNG TIN CƠ BẢN --- */}
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">
                    1
                  </span>
                  Thông tin chung
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Tên xe */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Tên xe <span className="text-red-500">*</span>
                    </label>
                    <Field
                      name="name"
                      type="text"
                      placeholder="Ví dụ: Trek Marlin 7 Gen 2..."
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all"
                    />
                    {errors.name && touched.name && (
                      <div className="text-red-500 text-xs mt-1">{errors.name}</div>
                    )}
                  </div>

                  {/* Hãng xe */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Thương hiệu <span className="text-red-500">*</span>
                    </label>
                    <Field
                      as="select"
                      name="brand"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all cursor-pointer"
                    >
                      <option value="">Chọn hãng xe</option>
                      <option value="Trek">Trek</option>
                      <option value="Giant">Giant</option>
                      <option value="Specialized">Specialized</option>
                      <option value="Cannondale">Cannondale</option>
                      <option value="Trinx">Trinx</option>
                      <option value="Galaxy">Galaxy</option>
                      <option value="Khác">Khác</option>
                    </Field>
                    {errors.brand && touched.brand && (
                      <div className="text-red-500 text-xs mt-1">{errors.brand}</div>
                    )}
                  </div>

                  {/* Loại xe */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Loại xe <span className="text-red-500">*</span>
                    </label>
                    <Field
                      as="select"
                      name="type"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all cursor-pointer"
                    >
                      <option value="">Chọn loại xe</option>
                      <option value="Road">Road (Đua)</option>
                      <option value="MTB">MTB (Địa hình)</option>
                      <option value="Touring">Touring (Đường phố)</option>
                      <option value="Fixed Gear">Fixed Gear</option>
                    </Field>
                    {errors.type && touched.type && (
                      <div className="text-red-500 text-xs mt-1">{errors.type}</div>
                    )}
                  </div>

                  {/* Năm sản xuất */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Năm sản xuất
                    </label>
                    <div className="relative">
                      <MdCalendarToday className="absolute top-3.5 left-3 text-gray-400" />
                      <Field
                        name="year"
                        type="number"
                        placeholder="VD: 2022"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                      />
                    </div>
                    {errors.year && touched.year && (
                      <div className="text-red-500 text-xs mt-1">{errors.year}</div>
                    )}
                  </div>

                  {/* Độ mới */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Độ mới ({values.condition}%)
                    </label>
                    <div className="flex items-center h-[50px]">
                      <Field
                        name="condition"
                        type="range"
                        min="50"
                        max="100"
                        step="1"
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* --- 2. THÔNG SỐ KỸ THUẬT (MỚI THÊM) --- */}
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm">
                    2
                  </span>
                  Thông số kỹ thuật
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {/* Frame Size */}
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                      Size Khung
                    </label>
                    <div className="relative">
                      <MdStraighten className="absolute top-3 left-3 text-gray-400" />
                      <Field
                        name="frame"
                        type="text"
                        placeholder="VD: M, 52..."
                        className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:border-orange-500 outline-none text-sm font-medium"
                      />
                    </div>
                  </div>

                  {/* Wheel Size */}
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                      Size Bánh
                    </label>
                    <div className="relative">
                      <MdDonutLarge className="absolute top-3 left-3 text-gray-400" />
                      <Field
                        as="select"
                        name="wheel"
                        className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:border-orange-500 outline-none text-sm font-medium cursor-pointer appearance-none"
                      >
                        <option value="">Chọn size</option>
                        <option value="26 inch">26 inch</option>
                        <option value="27.5 inch">27.5 inch</option>
                        <option value="29 inch">29 inch</option>
                        <option value="700c">700c</option>
                      </Field>
                    </div>
                  </div>

                  {/* Brake Type */}
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                      Loại Phanh
                    </label>
                    <div className="relative">
                      <MdErrorOutline className="absolute top-3 left-3 text-gray-400" />
                      <Field
                        as="select"
                        name="brake"
                        className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:border-orange-500 outline-none text-sm font-medium cursor-pointer appearance-none"
                      >
                        <option value="">Chọn loại</option>
                        <option value="Phanh vành (Rim)">Phanh vành (Rim)</option>
                        <option value="Phanh đĩa cơ">Phanh đĩa cơ</option>
                        <option value="Phanh đĩa dầu">Phanh đĩa dầu</option>
                      </Field>
                    </div>
                  </div>

                  {/* Gears */}
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                      Bộ đề (Gears)
                    </label>
                    <div className="relative">
                      <MdSpeed className="absolute top-3 left-3 text-gray-400" />
                      <Field
                        name="gears"
                        type="text"
                        placeholder="VD: 2x11, 1x12..."
                        className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:border-orange-500 outline-none text-sm font-medium"
                      />
                    </div>
                  </div>

                  {/* Weight */}
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                      Trọng lượng (Kg)
                    </label>
                    <div className="relative">
                      <MdFitnessCenter className="absolute top-3 left-3 text-gray-400" />
                      <Field
                        name="weight"
                        type="number"
                        placeholder="VD: 10.5"
                        className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:border-orange-500 outline-none text-sm font-medium"
                      />
                    </div>
                    {errors.weight && touched.weight && (
                      <div className="text-red-500 text-xs mt-1">{errors.weight}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* --- 3. HÌNH ẢNH --- */}
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm">
                    3
                  </span>
                  Hình ảnh thực tế
                </h3>

                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:bg-gray-50 transition-colors relative">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center mb-3">
                      <MdCloudUpload size={24} />
                    </div>
                    <p className="font-bold text-gray-700">
                      Kéo thả hoặc bấm để tải ảnh lên
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Hỗ trợ JPG, PNG (Tối đa 5 ảnh)
                    </p>
                  </div>
                </div>

                {/* Preview Images */}
                {images.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 mt-6 animate-fade-in">
                    {images.map((src, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group"
                      >
                        <img
                          src={src}
                          alt="preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MdDelete size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* --- 4. GIÁ & MÔ TẢ --- */}
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm">
                    4
                  </span>
                  Giá & Chi tiết
                </h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Giá bán mong muốn (VNĐ){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <MdAttachMoney size={20} />
                      </div>
                      <Field
                        name="price"
                        type="number"
                        placeholder="Nhập giá bán..."
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all font-bold text-lg"
                      />
                    </div>
                    {errors.price && touched.price && (
                      <div className="text-red-500 text-xs mt-1">{errors.price}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Mô tả chi tiết
                    </label>
                    <div className="relative">
                      <div className="absolute top-4 left-4 pointer-events-none text-gray-400">
                        <MdDescription size={20} />
                      </div>
                      <Field
                        as="textarea"
                        name="description"
                        rows="5"
                        placeholder="Mô tả kỹ hơn về tình trạng trầy xước, phụ kiện đi kèm, lịch sử bảo dưỡng..."
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex items-center justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-zinc-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    "Đang xử lý..."
                  ) : (
                    <>
                      <MdCheckCircle /> Đăng Tin Ngay
                    </>
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default PostBikePage;
