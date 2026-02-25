import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { uploadService } from "../../../services/uploadService";
import { bikeService } from "../../../services/bikeService";

import {
  MdArrowBack,
  MdCloudUpload,
  MdDelete,
  MdPedalBike,
  MdAttachMoney,
  MdDescription,
  MdCheckCircle,
  MdStraighten,
  MdDonutLarge,
  MdSpeed,
  MdFitnessCenter,
  MdCalendarToday,
  MdErrorOutline,
} from "react-icons/md";

const PostBikePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    brand: "",
    model: "",
    category: "",
    manufactureYear: "",
    frameSize: "",
    wheelSize: "",
    brakeType: "",
    transmission: "",
    weight: "",
    condition: 90,
    price: "",
    description: "",
    images: [],
  });

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.images.length === 0) {
      alert("Vui lòng tải lên ít nhất 1 hình ảnh thực tế của xe!");
      return;
    }

    setLoading(true);

    try {
      const uploadedImageUrls = [];
      for (const file of formData.images) {
        const response = await uploadService.uploadImage(file);
        if (response && response.result) {
          uploadedImageUrls.push(response.result);
        }
      }

      const imageUrlString = uploadedImageUrls.join(",");

      const payload = {
        sellerId: user?.userId,
        // eventId: 1, // ID sự kiện mặc định (Bắt buộc theo backend, cần đổi lại theo logic DB thực tế)
        title: formData.title,
        brand: formData.brand,
        model: formData.model,
        category: formData.category,
        frameSize: formData.frameSize,
        wheelSize: formData.wheelSize,
        manufactureYear: formData.manufactureYear
          ? parseInt(formData.manufactureYear)
          : null,
        brakeType: formData.brakeType,
        transmission: formData.transmission,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        price: formData.price ? parseFloat(formData.price) : null,
        description: `Độ mới: ${formData.condition}%. \n${formData.description}`,
        imageUrl: imageUrlString,
        status: "pending",
      };

      await bikeService.createBikeListing(payload);

      alert("Đăng tin thành công! Xe của bạn đang chờ kiểm duyệt.");
      navigate("/bikes");
    } catch (error) {
      console.error("Lỗi khi đăng tin:", error);
      alert("Đăng tin thất bại. Vui lòng kiểm tra lại kết nối hoặc thông tin.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">
                1
              </span>
              Thông tin chung
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Tiêu đề tin đăng <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Cần bán Trek Marlin 7 Gen 2 còn rất mới..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Thương hiệu <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all cursor-pointer"
                  value={formData.brand}
                  onChange={(e) =>
                    setFormData({ ...formData, brand: e.target.value })
                  }
                >
                  <option value="">Chọn hãng xe</option>
                  <option value="Trek">Trek</option>
                  <option value="Giant">Giant</option>
                  <option value="Specialized">Specialized</option>
                  <option value="Cannondale">Cannondale</option>
                  <option value="Trinx">Trinx</option>
                  <option value="Galaxy">Galaxy</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Dòng xe (Model) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Marlin 7, XTC 800..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all"
                  value={formData.model}
                  onChange={(e) =>
                    setFormData({ ...formData, model: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Loại xe (Category) <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all cursor-pointer"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  <option value="">Chọn loại xe</option>
                  <option value="Road">Road (Đua)</option>
                  <option value="MTB">MTB (Địa hình)</option>
                  <option value="Touring">Touring (Đường phố)</option>
                  <option value="Fixed Gear">Fixed Gear</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Năm sản xuất
                </label>
                <div className="relative">
                  <MdCalendarToday className="absolute top-3.5 left-3 text-gray-400" />
                  <input
                    type="number"
                    placeholder="VD: 2022"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                    value={formData.manufactureYear}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        manufactureYear: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Độ mới ({formData.condition}%)
                </label>
                <div className="flex items-center h-[30px]">
                  <input
                    type="range"
                    min="50"
                    max="100"
                    step="1"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                    value={formData.condition}
                    onChange={(e) =>
                      setFormData({ ...formData, condition: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm">
                2
              </span>
              Thông số kỹ thuật
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                  Size Khung
                </label>
                <div className="relative">
                  <MdStraighten className="absolute top-3 left-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="VD: M, 52..."
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:border-orange-500 outline-none text-sm font-medium"
                    value={formData.frameSize}
                    onChange={(e) =>
                      setFormData({ ...formData, frameSize: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                  Size Bánh
                </label>
                <div className="relative">
                  <MdDonutLarge className="absolute top-3 left-3 text-gray-400" />
                  <select
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:border-orange-500 outline-none text-sm font-medium cursor-pointer appearance-none"
                    value={formData.wheelSize}
                    onChange={(e) =>
                      setFormData({ ...formData, wheelSize: e.target.value })
                    }
                  >
                    <option value="">Chọn size</option>
                    <option value="26 inch">26 inch</option>
                    <option value="27.5 inch">27.5 inch</option>
                    <option value="29 inch">29 inch</option>
                    <option value="700c">700c</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                  Loại Phanh
                </label>
                <div className="relative">
                  <MdErrorOutline className="absolute top-3 left-3 text-gray-400" />
                  <select
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:border-orange-500 outline-none text-sm font-medium cursor-pointer appearance-none"
                    value={formData.brakeType}
                    onChange={(e) =>
                      setFormData({ ...formData, brakeType: e.target.value })
                    }
                  >
                    <option value="">Chọn loại</option>
                    <option value="Phanh vành (Rim)">Phanh vành (Rim)</option>
                    <option value="Phanh đĩa cơ">Phanh đĩa cơ</option>
                    <option value="Phanh đĩa dầu">Phanh đĩa dầu</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                  Bộ đề (Gears)
                </label>
                <div className="relative">
                  <MdSpeed className="absolute top-3 left-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="VD: 2x11, 1x12..."
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:border-orange-500 outline-none text-sm font-medium"
                    value={formData.transmission}
                    onChange={(e) =>
                      setFormData({ ...formData, transmission: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                  Trọng lượng (Kg)
                </label>
                <div className="relative">
                  <MdFitnessCenter className="absolute top-3 left-3 text-gray-400" />
                  <input
                    type="number"
                    step="0.1"
                    placeholder="VD: 10.5"
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:border-orange-500 outline-none text-sm font-medium"
                    value={formData.weight}
                    onChange={(e) =>
                      setFormData({ ...formData, weight: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

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
                <p className="text-sm text-gray-500 mt-1">Hỗ trợ JPG, PNG</p>
              </div>
            </div>

            {formData.images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 mt-6 animate-fade-in">
                {formData.images.map((file, index) => {
                  const src = URL.createObjectURL(file);
                  return (
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
                  );
                })}
              </div>
            )}
          </div>

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
                  <input
                    type="number"
                    required
                    placeholder="Nhập giá bán..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all font-bold text-lg"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Mô tả chi tiết
                </label>
                <div className="relative">
                  <div className="absolute top-4 left-4 pointer-events-none text-gray-400">
                    <MdDescription size={20} />
                  </div>
                  <textarea
                    rows="5"
                    placeholder="Mô tả kỹ hơn về tình trạng trầy xước, phụ kiện đi kèm, lịch sử bảo dưỡng..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all resize-none"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

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
              disabled={loading}
              className="bg-zinc-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <MdCheckCircle />
              )}
              {loading ? "Đang tải ảnh & đăng tin..." : "Đăng Tin Ngay"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostBikePage;
