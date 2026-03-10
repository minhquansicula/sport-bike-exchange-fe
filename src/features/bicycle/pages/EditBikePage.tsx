// File: src/pages/user/EditBikePage.tsx
import React, {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  FormEvent,
} from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { bikeService } from "../../../services/bikeService";
import { uploadService } from "../../../services/uploadService";
import { Toaster, toast } from "react-hot-toast";
import {
  MdArrowBack,
  MdSave,
  MdCameraAlt,
  MdDirectionsBike,
} from "react-icons/md";

const EditBikePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Lấy danh sách Brand và Category từ API để render Dropdown (Tránh việc phải gõ tay)
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  // State Form
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    brandName: "",
    categoryName: "",
    bikeType: "",
    frameSize: "",
    wheelSize: "",
    numberOfGears: "",
    yearManufacture: "",
    brakeType: "",
    drivetrain: "",
    color: "",
    frameMaterial: "",
    forkType: "",
    condition: "90", // Mặc định
    image_url: "",
    saddle: "",
    chainring: "",
    chain: "",
    handlebar: "",
    rim: "",
    shockAbsorber: "",
  });

  // 1. Tải danh sách Hãng và Loại xe để bỏ vào Dropdown
  useEffect(() => {
    const fetchLibraryData = async () => {
      try {
        const res = await bikeService.getBicycleLibrary();
        if (res && res.result) {
          const uniqueBrands = Array.from(
            new Set(
              res.result.map((bike: any) => bike.brand?.name).filter(Boolean),
            ),
          ).sort() as string[];
          setAvailableBrands(uniqueBrands);

          const uniqueCategories = Array.from(
            new Set(
              res.result
                .map((bike: any) => bike.category?.name || bike.bikeType)
                .filter(Boolean),
            ),
          ).sort() as string[];
          setAvailableCategories(uniqueCategories);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu library:", error);
      }
    };
    fetchLibraryData();
  }, []);

  // 2. Tải dữ liệu của xe đang được Edit
  useEffect(() => {
    const fetchBikeDetail = async () => {
      if (!id) return;

      try {
        const response = await bikeService.getBikeListingById(id);
        if (response && response.result) {
          const bike = response.result;
          setFormData({
            title: bike.title || "",
            price: bike.price?.toString() || "",
            description: bike.description || "",
            brandName: bike.brandName || "",
            categoryName: bike.categoryName || "",
            bikeType: bike.bikeType || "",
            frameSize: bike.frameSize || "",
            wheelSize: bike.wheelSize || "",
            numberOfGears: bike.numberOfGears || "",
            yearManufacture: bike.yearManufacture
              ? new Date(bike.yearManufacture).getFullYear().toString()
              : "",
            brakeType: bike.brakeType || "",
            drivetrain: bike.drivetrain || "",
            color: bike.color || "",
            frameMaterial: bike.frameMaterial || "",
            forkType: bike.forkType || "",
            condition: bike.condition?.toString() || "90",
            image_url: bike.image_url || "",
            saddle: bike.saddle || "",
            chainring: bike.chainring || "",
            chain: bike.chain || "",
            handlebar: bike.handlebar || "",
            rim: bike.rim || "",
            shockAbsorber: bike.shockAbsorber || "",
          });
        }
      } catch (error) {
        console.error("Lỗi tải chi tiết xe:", error);
        toast.error("Không thể tải thông tin xe.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBikeDetail();
  }, [id]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Nâng cấp 1: Hàm hiển thị format giá tiền (10.000.000)
  const formatDisplayAmount = (val: string) => {
    if (!val) return "";
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    let rawValue = e.target.value.replace(/\D/g, "");
    if (rawValue.startsWith("0")) {
      rawValue = rawValue.replace(/^0+/, "");
    }
    setFormData((prev) => ({ ...prev, price: rawValue }));
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file ảnh hợp lệ!");
      return;
    }

    setIsUploading(true);
    try {
      const response = await uploadService.uploadImage(file);
      const imageUrl = response.result;

      if (imageUrl) {
        setFormData((prev) => ({ ...prev, image_url: imageUrl }));
        toast.success("Tải ảnh lên thành công!");
      } else {
        throw new Error("Không lấy được đường dẫn ảnh");
      }
    } catch (error) {
      console.error("Upload ảnh lỗi:", error);
      toast.error("Tải ảnh thất bại.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return;

    setIsSaving(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        brandName: formData.brandName,
        categoryName: formData.categoryName,
        bikeType: formData.bikeType,
        frameSize: formData.frameSize,
        wheelSize: formData.wheelSize,
        numberOfGears: formData.numberOfGears,
        brakeType: formData.brakeType,
        drivetrain: formData.drivetrain,
        color: formData.color,
        frameMaterial: formData.frameMaterial,
        forkType: formData.forkType,
        image_url: formData.image_url,
        saddle: formData.saddle,
        chainring: formData.chainring,
        chain: formData.chain,
        handlebar: formData.handlebar,
        rim: formData.rim,
        shockAbsorber: formData.shockAbsorber,
        price: parseFloat(formData.price) || 0,
        condition: parseInt(formData.condition) || 0,
        yearManufacture: parseInt(formData.yearManufacture) || 0,
      };

      await bikeService.updateBikeListing(id, payload);
      toast.success("Cập nhật thông tin xe thành công!");
      setTimeout(() => {
        navigate(`/bikes/${id}`);
      }, 1500);
    } catch (error) {
      console.error("Lỗi cập nhật xe:", error);
      toast.error("Cập nhật thất bại, vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 font-sans">
      <Toaster position="top-center" />
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            type="button"
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-zinc-500 hover:text-orange-600 hover:bg-orange-50 shadow-sm transition-all"
          >
            <MdArrowBack size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-zinc-900 flex items-center gap-2">
              <MdDirectionsBike className="text-orange-500" /> Chỉnh sửa tin
              đăng
            </h1>
            <p className="text-sm text-gray-500">
              Cập nhật thông tin cho xe của bạn
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SECTION HÌNH ẢNH */}
          <div className="bg-white p-6 md:p-8 rounded-[24px] border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-zinc-900 mb-6 border-b border-gray-100 pb-4">
              Hình ảnh sản phẩm
            </h2>
            <div className="flex flex-col items-center">
              <div className="relative w-full max-w-lg aspect-[16/10] bg-gray-100 rounded-2xl overflow-hidden mb-4 group border-2 border-dashed border-gray-300">
                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-white border-t-transparent"></div>
                  </div>
                )}
                {formData.image_url ? (
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <MdCameraAlt size={48} className="mb-2 opacity-50" />
                    <span>Chưa có hình ảnh</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white text-zinc-900 px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-orange-50 hover:text-orange-600 cursor-pointer"
                  >
                    <MdCameraAlt /> Thay đổi ảnh
                  </button>
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
                accept="image/*"
              />
            </div>
          </div>

          {/* SECTION THÔNG TIN CƠ BẢN */}
          <div className="bg-white p-6 md:p-8 rounded-[24px] border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-zinc-900 border-b border-gray-100 pb-4">
              Thông tin cơ bản
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-zinc-700 mb-2">
                  Tiêu đề bài đăng *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2">
                  Giá bán (VNĐ) *
                </label>
                {/* Đã sửa: Định dạng có dấu chấm */}
                <input
                  type="text"
                  required
                  value={formatDisplayAmount(formData.price)}
                  onChange={handlePriceChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all font-bold"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2">
                  Độ mới ({formData.condition}%) *
                </label>
                {/* Đã sửa: Dùng thanh trượt giống PostBikePage */}
                <div className="flex items-center h-[48px] bg-gray-50 px-4 border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-orange-500">
                  <input
                    type="range"
                    name="condition"
                    min="50"
                    max="100"
                    required
                    value={formData.condition}
                    onChange={handleChange}
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-orange-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2">
                  Thương hiệu
                </label>
                <select
                  name="brandName"
                  value={formData.brandName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all cursor-pointer"
                >
                  <option value="">Chọn hãng xe</option>
                  {availableBrands.map((brand, i) => (
                    <option key={i} value={brand}>
                      {brand}
                    </option>
                  ))}
                  {/* Option fallback nếu hãng cũ không nằm trong list API */}
                  {!availableBrands.includes(formData.brandName) &&
                    formData.brandName && (
                      <option value={formData.brandName}>
                        {formData.brandName}
                      </option>
                    )}
                  <option value="Khác">Khác</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2">
                  Phân loại (Category)
                </label>
                <select
                  name="categoryName"
                  value={formData.categoryName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all cursor-pointer"
                >
                  <option value="">Chọn loại xe</option>
                  {availableCategories.map((cat, i) => (
                    <option key={i} value={cat}>
                      {cat}
                    </option>
                  ))}
                  {/* Option fallback nếu loại xe cũ không nằm trong list API */}
                  {!availableCategories.includes(formData.categoryName) &&
                    formData.categoryName && (
                      <option value={formData.categoryName}>
                        {formData.categoryName}
                      </option>
                    )}
                  <option value="Khác">Khác</option>
                </select>
              </div>
            </div>

            <div className="pt-4">
              <label className="block text-sm font-bold text-zinc-700 mb-2">
                Mô tả chi tiết
              </label>
              <textarea
                name="description"
                rows={5}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all resize-none"
              ></textarea>
            </div>
          </div>

          {/* SECTION THÔNG SỐ KỸ THUẬT */}
          <div className="bg-white p-6 md:p-8 rounded-[24px] border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-zinc-900 border-b border-gray-100 pb-4">
              Thông số kỹ thuật
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2">
                  Năm sản xuất
                </label>
                <input
                  type="number"
                  name="yearManufacture"
                  value={formData.yearManufacture}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2">
                  Size Khung
                </label>
                <input
                  type="text"
                  name="frameSize"
                  value={formData.frameSize}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                />
              </div>

              {/* Đã nâng cấp các trường phổ biến thành Select Dropdown */}
              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2">
                  Size Bánh
                </label>
                <select
                  name="wheelSize"
                  value={formData.wheelSize}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all cursor-pointer"
                >
                  <option value="">Chọn size</option>
                  <option value="26 inch">26 inch</option>
                  <option value="27.5 inch">27.5 inch</option>
                  <option value="29 inch">29 inch</option>
                  <option value="700c">700c</option>
                  {!["26 inch", "27.5 inch", "29 inch", "700c", ""].includes(
                    formData.wheelSize,
                  ) && (
                    <option value={formData.wheelSize}>
                      {formData.wheelSize}
                    </option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2">
                  Loại Phanh
                </label>
                <select
                  name="brakeType"
                  value={formData.brakeType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all cursor-pointer"
                >
                  <option value="">Chọn loại</option>
                  <option value="Phanh vành (Rim)">Phanh vành (Rim)</option>
                  <option value="Phanh đĩa cơ">Phanh đĩa cơ</option>
                  <option value="Phanh đĩa dầu">Phanh đĩa dầu</option>
                  {![
                    "Phanh vành (Rim)",
                    "Phanh đĩa cơ",
                    "Phanh đĩa dầu",
                    "",
                  ].includes(formData.brakeType) && (
                    <option value={formData.brakeType}>
                      {formData.brakeType}
                    </option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2">
                  Chất liệu khung
                </label>
                <select
                  name="frameMaterial"
                  value={formData.frameMaterial}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all cursor-pointer"
                >
                  <option value="">Chọn chất liệu</option>
                  <option value="Nhôm (Aluminum)">Nhôm (Aluminum)</option>
                  <option value="Carbon">Carbon</option>
                  <option value="Thép (Steel)">Thép (Steel)</option>
                  <option value="Titanium">Titanium</option>
                  {![
                    "Nhôm (Aluminum)",
                    "Carbon",
                    "Thép (Steel)",
                    "Titanium",
                    "",
                  ].includes(formData.frameMaterial) && (
                    <option value={formData.frameMaterial}>
                      {formData.frameMaterial}
                    </option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2">
                  Loại phuộc
                </label>
                <select
                  name="forkType"
                  value={formData.forkType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all cursor-pointer"
                >
                  <option value="">Chọn loại phuộc</option>
                  <option value="Phuộc đơ (Rigid)">Phuộc đơ (Rigid)</option>
                  <option value="Phuộc nhún lò xo">Phuộc nhún lò xo</option>
                  <option value="Phuộc hơi">Phuộc hơi</option>
                  {![
                    "Phuộc đơ (Rigid)",
                    "Phuộc nhún lò xo",
                    "Phuộc hơi",
                    "",
                  ].includes(formData.forkType) && (
                    <option value={formData.forkType}>
                      {formData.forkType}
                    </option>
                  )}
                </select>
              </div>

              {/* Các trường còn lại giữ dạng Text Input */}
              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2">
                  Hệ dẫn động (Drivetrain)
                </label>
                <input
                  type="text"
                  name="drivetrain"
                  value={formData.drivetrain}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2">
                  Số líp/đĩa (Gears)
                </label>
                <input
                  type="text"
                  name="numberOfGears"
                  value={formData.numberOfGears}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2">
                  Màu sắc
                </label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2">
                  Yên xe
                </label>
                <input
                  type="text"
                  name="saddle"
                  value={formData.saddle}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2">
                  Đĩa (Chainring)
                </label>
                <input
                  type="text"
                  name="chainring"
                  value={formData.chainring}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2">
                  Xích xe (Chain)
                </label>
                <input
                  type="text"
                  name="chain"
                  value={formData.chain}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2">
                  Ghi đông (Handlebar)
                </label>
                <input
                  type="text"
                  name="handlebar"
                  value={formData.handlebar}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2">
                  Vành xe (Rim)
                </label>
                <input
                  type="text"
                  name="rim"
                  value={formData.rim}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2">
                  Giảm xốc
                </label>
                <input
                  type="text"
                  name="shockAbsorber"
                  value={formData.shockAbsorber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 sticky bottom-6 z-10">
            <button
              onClick={() => navigate(-1)}
              type="button"
              className="px-6 py-3.5 bg-white text-zinc-700 border border-gray-200 font-bold rounded-xl shadow-sm hover:bg-gray-50 transition-all"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSaving || isUploading}
              className={`px-8 py-3.5 font-bold rounded-xl text-white shadow-lg flex items-center gap-2 transition-all ${
                isSaving || isUploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-orange-600 hover:bg-orange-700 shadow-orange-500/30"
              }`}
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <MdSave size={20} />
              )}
              {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBikePage;
