// File: src/pages/user/PostBikePage.jsx
import React, { useState, useEffect } from "react";
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
  MdColorLens,
  MdPrecisionManufacturing,
  MdHardware,
  MdEventSeat,
  MdSettings,
  MdLink,
  MdLinearScale,
  MdRadioButtonUnchecked,
  MdCompress,
  MdAutoAwesome,
  MdWarning,
  MdClose,
} from "react-icons/md";

const PostBikePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // --- QUẢN LÝ DỮ LIỆU THƯ VIỆN ĐỘNG ---
  const [allLibraryData, setAllLibraryData] = useState([]);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [libraryBikes, setLibraryBikes] = useState([]);

  // --- STATE THANH TOÁN ---
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [listingFee, setListingFee] = useState(0);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

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
    condition: "",
    price: "",
    description: "",
    color: "",
    frameMaterial: "",
    forkType: "",
    saddle: "",
    chainring: "",
    chain: "",
    handlebar: "",
    rim: "",
    shockAbsorber: "",
    images: [],
  });

  const [errors, setErrors] = useState({});

  // 1. TẢI TOÀN BỘ DỮ LIỆU TỪ API THƯ VIỆN KHI VÀO TRANG
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const res = await bikeService.getBicycleLibrary();
        if (res && res.result) {
          setAllLibraryData(res.result);

          const uniqueBrands = Array.from(
            new Set(res.result.map((bike) => bike.brand?.name).filter(Boolean)),
          ).sort();
          setAvailableBrands(uniqueBrands);

          const uniqueCategories = Array.from(
            new Set(
              res.result
                .map((bike) => bike.category?.name || bike.bikeType)
                .filter(Boolean),
            ),
          ).sort();
          setAvailableCategories(uniqueCategories);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu library:", error);
      }
    };
    if (user) {
      fetchInitialData();
    }
  }, [user]);

  // 2. LỌC MẪU XE KHI CHỌN HÃNG
  useEffect(() => {
    if (formData.brand && formData.brand !== "Khác") {
      const filteredBikes = allLibraryData.filter(
        (bike) => bike.brand?.name === formData.brand,
      );
      setLibraryBikes(filteredBikes);
    } else {
      setLibraryBikes([]);
    }
  }, [formData.brand, allLibraryData]);

  // 3. XỬ LÝ ĐIỀN FORM TỰ ĐỘNG KHI CHỌN XE MẪU
  const handleSelectLibraryBike = (e) => {
    const selectedId = parseInt(e.target.value);
    const selectedBike = libraryBikes.find((b) => b.id === selectedId);

    if (selectedBike) {
      setFormData((prev) => ({
        ...prev,
        model: selectedBike.model || prev.model,
        category:
          selectedBike.category?.name || selectedBike.bikeType || prev.category,
        manufactureYear: selectedBike.yearManufacture || prev.manufactureYear,
        frameSize: selectedBike.frameSize || prev.frameSize,
        wheelSize: selectedBike.wheelSize || prev.wheelSize,
        brakeType: selectedBike.brakeType || prev.brakeType,
        transmission:
          selectedBike.numberOfGears ||
          selectedBike.drivetrain ||
          prev.transmission,
        weight: selectedBike.weight || prev.weight,
        color: selectedBike.color || prev.color,
        frameMaterial: selectedBike.frameMaterial || prev.frameMaterial,
        forkType: selectedBike.forkType || prev.forkType,
        saddle: selectedBike.saddle || prev.saddle,
        chainring: selectedBike.chainring || prev.chainring,
        chain: selectedBike.chain || prev.chain,
        handlebar: selectedBike.handlebar || prev.handlebar,
        rim: selectedBike.rim || prev.rim,
        shockAbsorber: selectedBike.shockAbsorber || prev.shockAbsorber,
      }));

      if (!formData.title) {
        setFormData((prev) => ({
          ...prev,
          title:
            `Cần bán ${selectedBike.brand?.name || ""} ${selectedBike.model || ""} ${selectedBike.yearManufacture ? `đời ${selectedBike.yearManufacture}` : ""}`.trim(),
        }));
      }
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
    if (errors.images) setErrors((prev) => ({ ...prev, images: null }));
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const currentYear = new Date().getFullYear();

    if (!formData.title.trim()) {
      newErrors.title = "Vui lòng nhập tiêu đề tin đăng.";
    } else if (formData.title.length < 10) {
      newErrors.title = "Tiêu đề quá ngắn (tối thiểu 10 ký tự).";
    }

    if (!formData.brand) newErrors.brand = "Vui lòng chọn thương hiệu.";
    if (!formData.model.trim()) newErrors.model = "Vui lòng nhập dòng xe.";
    if (!formData.category) newErrors.category = "Vui lòng chọn loại xe.";
    if (!formData.condition)
      newErrors.condition = "Vui lòng chọn tình trạng xe.";

    if (formData.manufactureYear) {
      const year = parseInt(formData.manufactureYear);
      if (year < 1900 || year > currentYear + 1) {
        newErrors.manufactureYear = `Năm sản xuất không hợp lệ (1900 - ${currentYear + 1}).`;
      }
    }

    if (formData.weight && parseFloat(formData.weight) <= 0) {
      newErrors.weight = "Trọng lượng phải lớn hơn 0.";
    }

    const numericPrice = parseFloat(formData.price);
    if (!formData.price) {
      newErrors.price = "Vui lòng nhập giá bán.";
    } else if (isNaN(numericPrice) || numericPrice <= 0) {
      newErrors.price = "Giá bán phải lớn hơn 0.";
    } else if (numericPrice > 500000000) {
      newErrors.price = "Giá bán vượt quá giới hạn (500.000.000đ).";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Vui lòng nhập mô tả chi tiết của xe.";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Mô tả chi tiết quá ngắn (tối thiểu 10 ký tự).";
    }

    if (formData.images.length === 0) {
      newErrors.images = "Vui lòng tải lên ít nhất 1 hình ảnh thực tế của xe.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- BƯỚC 1: XỬ LÝ KHI BẤM NÚT "ĐĂNG TIN NGAY" ---
  const handlePreSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setLoading(true);
    try {
      // Gọi API tính phí
      const feeResponse = await bikeService.calculateListingFee(
        parseFloat(formData.price),
      );

      if (feeResponse && feeResponse.result !== undefined) {
        setListingFee(feeResponse.result);
        setShowFeeModal(true); // Mở Popup xác nhận thanh toán
      } else {
        throw new Error("Không lấy được thông tin phí sàn");
      }
    } catch (error) {
      console.error("Lỗi khi tính phí:", error);
      alert("Có lỗi xảy ra khi tính phí sàn. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // --- BƯỚC 2: XỬ LÝ KHI BẤM "ĐỒNG Ý THANH TOÁN" TRONG POPUP ---
  const handleConfirmSubmit = async () => {
    setIsProcessingPayment(true);

    try {
      // 1. Upload ảnh
      const uploadedImageUrls = [];
      const uploadPromises = formData.images.map((file) =>
        uploadService.uploadImage(file),
      );
      const uploadResponses = await Promise.all(uploadPromises);

      uploadResponses.forEach((response) => {
        if (response && response.result) {
          uploadedImageUrls.push(response.result);
        }
      });

      if (uploadedImageUrls.length === 0) {
        throw new Error("Không thể tải ảnh lên server.");
      }

      const imageUrlString = uploadedImageUrls.join(",");

      // 2. Chuẩn bị payload
      const payload = {
        title: formData.title,
        description: `Tình trạng: ${formData.condition}. \n${formData.description}`,
        price: parseFloat(formData.price),
        brandName: formData.brand,
        categoryName: formData.category,
        bikeType: formData.category,
        wheelSize: formData.wheelSize,
        brakeType: formData.brakeType,
        drivetrain: formData.transmission,
        numberOfGears: formData.transmission,
        frameSize: formData.frameSize,
        yearManufacture: formData.manufactureYear
          ? parseInt(formData.manufactureYear)
          : 0,
        condition: formData.condition,
        color: formData.color || "Không rõ",
        frameMaterial: formData.frameMaterial || "Không rõ",
        forkType: formData.forkType || "Không rõ",
        saddle: formData.saddle || "Không rõ",
        chainring: formData.chainring || "Không rõ",
        chain: formData.chain || "Không rõ",
        handlebar: formData.handlebar || "Không rõ",
        rim: formData.rim || "Không rõ",
        shockAbsorber: formData.shockAbsorber || "Không rõ",
        image_url: imageUrlString,
      };

      // 3. Gọi API Create
      const createResponse = await bikeService.createBikeListing(payload);

      // 4. Xử lý phản hồi từ Backend
      if (createResponse && createResponse.result) {
        const { paymentUrl, message } = createResponse.result;

        if (paymentUrl) {
          // Ví không đủ tiền -> Chuyển hướng sang VNPay
          window.location.href = paymentUrl;
        } else {
          // Ví đủ tiền -> Đăng bài thành công, trừ ví nội bộ
          alert(
            message || "Đăng tin thành công! Xe của bạn đang chờ kiểm duyệt.",
          );
          navigate("/bikes");
        }
      }
    } catch (error) {
      console.error("Lỗi khi đăng tin:", error);
      alert(
        error.response?.data?.message || "Đăng tin thất bại. Vui lòng thử lại.",
      );
    } finally {
      setIsProcessingPayment(false);
      setShowFeeModal(false);
    }
  };

  const formatDisplayAmount = (val) => {
    if (!val) return "";
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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

        {/* --- ĐỔI HÀM SUBMIT FORM --- */}
        <form onSubmit={handlePreSubmit} className="space-y-6">
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
                  placeholder="Ví dụ: Cần bán Trek Marlin 7 Gen 2 còn rất mới..."
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all ${
                    errors.title ? "border-red-500" : "border-gray-200"
                  }`}
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value });
                    if (errors.title) setErrors({ ...errors, title: null });
                  }}
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1 font-medium">
                    {errors.title}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Thương hiệu <span className="text-red-500">*</span>
                </label>
                <select
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all cursor-pointer ${
                    errors.brand ? "border-red-500" : "border-gray-200"
                  }`}
                  value={formData.brand}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      brand: e.target.value,
                      model: "",
                    });
                    if (errors.brand) setErrors({ ...errors, brand: null });
                  }}
                >
                  <option value="">Chọn hãng xe</option>
                  {availableBrands.map((brandName, index) => (
                    <option key={index} value={brandName}>
                      {brandName}
                    </option>
                  ))}
                  <option value="Khác">Khác</option>
                </select>
                {errors.brand && (
                  <p className="text-red-500 text-xs mt-1 font-medium">
                    {errors.brand}
                  </p>
                )}
              </div>

              {libraryBikes.length > 0 ? (
                <div>
                  <label className="block text-sm font-bold text-orange-600 mb-2 flex items-center gap-1">
                    <MdAutoAwesome /> Điền nhanh thông số từ thư viện
                  </label>
                  <select
                    className="w-full px-4 py-3 bg-orange-50 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all cursor-pointer text-orange-800"
                    onChange={handleSelectLibraryBike}
                  >
                    <option value="">-- Chọn mẫu xe để tự động điền --</option>
                    {libraryBikes.map((bike) => (
                      <option key={bike.id} value={bike.id}>
                        {bike.model}{" "}
                        {bike.yearManufacture
                          ? `(${bike.yearManufacture})`
                          : ""}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="hidden md:block"></div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Dòng xe (Model) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="VD: Marlin 7, XTC 800..."
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all ${
                    errors.model ? "border-red-500" : "border-gray-200"
                  }`}
                  value={formData.model}
                  onChange={(e) => {
                    setFormData({ ...formData, model: e.target.value });
                    if (errors.model) setErrors({ ...errors, model: null });
                  }}
                />
                {errors.model && (
                  <p className="text-red-500 text-xs mt-1 font-medium">
                    {errors.model}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Loại xe (Category) <span className="text-red-500">*</span>
                </label>
                <select
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all cursor-pointer ${
                    errors.category ? "border-red-500" : "border-gray-200"
                  }`}
                  value={formData.category}
                  onChange={(e) => {
                    setFormData({ ...formData, category: e.target.value });
                    if (errors.category)
                      setErrors({ ...errors, category: null });
                  }}
                >
                  <option value="">Chọn loại xe</option>
                  {availableCategories.map((catName, index) => (
                    <option key={index} value={catName}>
                      {catName}
                    </option>
                  ))}
                  <option value="Khác">Khác</option>
                </select>
                {errors.category && (
                  <p className="text-red-500 text-xs mt-1 font-medium">
                    {errors.category}
                  </p>
                )}
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
                    className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none ${
                      errors.manufactureYear
                        ? "border-red-500"
                        : "border-gray-200"
                    }`}
                    value={formData.manufactureYear}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        manufactureYear: e.target.value,
                      });
                      if (errors.manufactureYear)
                        setErrors({ ...errors, manufactureYear: null });
                    }}
                  />
                </div>
                {errors.manufactureYear && (
                  <p className="text-red-500 text-xs mt-1 font-medium">
                    {errors.manufactureYear}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Tình trạng xe <span className="text-red-500">*</span>
                </label>
                <select
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all cursor-pointer ${
                    errors.condition ? "border-red-500" : "border-gray-200"
                  }`}
                  value={formData.condition}
                  onChange={(e) => {
                    setFormData({ ...formData, condition: e.target.value });
                    if (errors.condition)
                      setErrors({ ...errors, condition: null });
                  }}
                >
                  <option value="">Chọn tình trạng</option>
                  <option value="Như mới">Như mới (Hoạt động hoàn hảo)</option>
                  <option value="Cũ">Cũ (Có trầy xước, hoạt động tốt)</option>
                  <option value="Cần sửa chữa">
                    Cần sửa chữa (Hư hỏng nhẹ)
                  </option>
                  <option value="Xác xe">
                    Xác xe (Hư hỏng nặng/Lấy phụ tùng)
                  </option>
                </select>
                {errors.condition && (
                  <p className="text-red-500 text-xs mt-1 font-medium">
                    {errors.condition}
                  </p>
                )}
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
                    className={`w-full pl-9 pr-3 py-2.5 bg-gray-50 border rounded-lg focus:border-orange-500 outline-none text-sm font-medium ${
                      errors.weight ? "border-red-500" : "border-gray-200"
                    }`}
                    value={formData.weight}
                    onChange={(e) => {
                      setFormData({ ...formData, weight: e.target.value });
                      if (errors.weight) setErrors({ ...errors, weight: null });
                    }}
                  />
                </div>
                {errors.weight && (
                  <p className="text-red-500 text-xs mt-1 font-medium">
                    {errors.weight}
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                  Màu sắc
                </label>
                <div className="relative">
                  <MdColorLens className="absolute top-3 left-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="VD: Đen nhám..."
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:border-orange-500 outline-none text-sm font-medium"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                  Chất liệu khung
                </label>
                <div className="relative">
                  <MdPrecisionManufacturing className="absolute top-3 left-3 text-gray-400" />
                  <select
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:border-orange-500 outline-none text-sm font-medium cursor-pointer appearance-none"
                    value={formData.frameMaterial}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        frameMaterial: e.target.value,
                      })
                    }
                  >
                    <option value="">Chọn chất liệu</option>
                    <option value="Nhôm (Aluminum)">Nhôm (Aluminum)</option>
                    <option value="Carbon">Carbon</option>
                    <option value="Thép (Steel)">Thép (Steel)</option>
                    <option value="Titanium">Titanium</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                  Loại Phuộc
                </label>
                <div className="relative">
                  <MdHardware className="absolute top-3 left-3 text-gray-400" />
                  <select
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:border-orange-500 outline-none text-sm font-medium cursor-pointer appearance-none"
                    value={formData.forkType}
                    onChange={(e) =>
                      setFormData({ ...formData, forkType: e.target.value })
                    }
                  >
                    <option value="">Chọn loại phuộc</option>
                    <option value="Phuộc đơ (Rigid)">Phuộc đơ (Rigid)</option>
                    <option value="Phuộc nhún lò xo">Phuộc nhún lò xo</option>
                    <option value="Phuộc hơi">Phuộc hơi</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                  Yên xe
                </label>
                <div className="relative">
                  <MdEventSeat className="absolute top-3 left-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="VD: Yên thể thao..."
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:border-orange-500 outline-none text-sm font-medium"
                    value={formData.saddle}
                    onChange={(e) =>
                      setFormData({ ...formData, saddle: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                  Đĩa (Chainring)
                </label>
                <div className="relative">
                  <MdSettings className="absolute top-3 left-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="VD: 34T..."
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:border-orange-500 outline-none text-sm font-medium"
                    value={formData.chainring}
                    onChange={(e) =>
                      setFormData({ ...formData, chainring: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                  Xích xe (Chain)
                </label>
                <div className="relative">
                  <MdLink className="absolute top-3 left-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="VD: KMC X11..."
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:border-orange-500 outline-none text-sm font-medium"
                    value={formData.chain}
                    onChange={(e) =>
                      setFormData({ ...formData, chain: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                  Ghi đông (Handlebar)
                </label>
                <div className="relative">
                  <MdLinearScale className="absolute top-3 left-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="VD: Hợp kim nhôm..."
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:border-orange-500 outline-none text-sm font-medium"
                    value={formData.handlebar}
                    onChange={(e) =>
                      setFormData({ ...formData, handlebar: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                  Vành xe (Rim)
                </label>
                <div className="relative">
                  <MdRadioButtonUnchecked className="absolute top-3 left-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="VD: Vành đúc..."
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:border-orange-500 outline-none text-sm font-medium"
                    value={formData.rim}
                    onChange={(e) =>
                      setFormData({ ...formData, rim: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                  Giảm xốc
                </label>
                <div className="relative">
                  <MdCompress className="absolute top-3 left-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="VD: Lò xo kép..."
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:border-orange-500 outline-none text-sm font-medium"
                    value={formData.shockAbsorber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shockAbsorber: e.target.value,
                      })
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
              Hình ảnh thực tế <span className="text-red-500 ml-1">*</span>
            </h3>

            <div
              className={`border-2 border-dashed rounded-2xl p-8 text-center hover:bg-gray-50 transition-colors relative ${
                errors.images ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                    errors.images
                      ? "bg-red-100 text-red-500"
                      : "bg-purple-50 text-purple-500"
                  }`}
                >
                  <MdCloudUpload size={24} />
                </div>
                <p
                  className={`font-bold ${errors.images ? "text-red-600" : "text-gray-700"}`}
                >
                  {errors.images
                    ? errors.images
                    : "Kéo thả hoặc bấm để tải ảnh lên"}
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
                    type="text"
                    placeholder="Nhập giá bán..."
                    className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all font-bold text-lg ${
                      errors.price ? "border-red-500" : "border-gray-200"
                    }`}
                    value={formatDisplayAmount(formData.price)}
                    onChange={(e) => {
                      let rawValue = e.target.value.replace(/\D/g, "");
                      if (rawValue.startsWith("0"))
                        rawValue = rawValue.replace(/^0+/, "");
                      setFormData({ ...formData, price: rawValue });
                      if (errors.price) setErrors({ ...errors, price: null });
                    }}
                  />
                </div>
                {errors.price && (
                  <p className="text-red-500 text-xs mt-1 font-medium">
                    {errors.price}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Mô tả chi tiết <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute top-4 left-4 pointer-events-none text-gray-400">
                    <MdDescription size={20} />
                  </div>
                  <textarea
                    rows="5"
                    placeholder="Mô tả kỹ hơn về tình trạng trầy xước, phụ kiện đi kèm, lịch sử bảo dưỡng..."
                    className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all resize-none ${
                      errors.description ? "border-red-500" : "border-gray-200"
                    }`}
                    value={formData.description}
                    onChange={(e) => {
                      setFormData({ ...formData, description: e.target.value });
                      if (errors.description) setErrors({ ...errors, description: null });
                    }}
                  ></textarea>
                </div>
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1 font-medium">
                    {errors.description}
                  </p>
                )}
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
              {loading ? "Đang xử lý..." : "Đăng Tin Ngay"}
            </button>
          </div>
        </form>
      </div>

      {/* --- MODAL XÁC NHẬN THANH TOÁN PHÍ SÀN --- */}
      {showFeeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-all">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 md:p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mb-4">
                <MdWarning size={32} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">
                Thanh toán phí đăng bài
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                Để đăng bài viết này, bạn cần thanh toán một khoản phí sàn. Số
                tiền này sẽ được trừ vào ví của bạn.
              </p>

              <div className="bg-gray-50 border border-gray-200 rounded-xl w-full p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 font-medium">
                    Giá xe đăng bán:
                  </span>
                  <span className="font-bold text-gray-900">
                    {formatDisplayAmount(formData.price)} đ
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="text-gray-800 font-bold">
                    Phí sàn phải trả:
                  </span>
                  <span className="font-black text-xl text-orange-600">
                    {formatDisplayAmount(listingFee)} đ
                  </span>
                </div>
              </div>

              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowFeeModal(false)}
                  disabled={isProcessingPayment}
                  className="flex-1 px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleConfirmSubmit}
                  disabled={isProcessingPayment}
                  className="flex-1 px-4 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 shadow-lg shadow-orange-200 transition-all disabled:opacity-70 flex justify-center items-center gap-2"
                >
                  {isProcessingPayment ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>{" "}
                      Đang xử lý
                    </>
                  ) : (
                    "Đồng ý & Đăng bài"
                  )}
                </button>
              </div>

              {isProcessingPayment && (
                <p className="text-xs text-orange-500 font-medium mt-4 animate-pulse">
                  Vui lòng không đóng trình duyệt. Sẽ tự động chuyển hướng nếu
                  ví không đủ tiền...
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostBikePage;
