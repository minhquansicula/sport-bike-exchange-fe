import React, { useState, useEffect } from "react";
import {
  MdClose,
  MdAutoAwesome,
  MdCloudUpload,
  MdAttachMoney,
  MdImage,
  MdWarning,
} from "react-icons/md";
import { toast } from "react-hot-toast";
import { uploadService } from "../../../services/uploadService";
import { bikeService } from "../../../services/bikeService";
import { eventBicycleService } from "../../../services/eventBicycleService";

const BikeImage = ({ src, alt, className }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [error, setError] = useState(false);
  
  useEffect(() => {
    setImgSrc(src);
    setError(false);
  }, [src]);
  
  const handleError = () => setError(true);
  
  if (error || !imgSrc)
    return (
      <div
        className={`${className} bg-gray-100 flex items-center justify-center text-gray-400`}
      >
        <MdImage size={24} />
      </div>
    );
    
  return (
    <img src={imgSrc} alt={alt} className={className} onError={handleError} />
  );
};

const RegisterBikeModal = ({
  showRegisterModal,
  setShowRegisterModal,
  eventDetail,
  user,
  eventId,
  eventBikes,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerMode, setRegisterMode] = useState("new");
  const [myListings, setMyListings] = useState([]);
  const [selectedListingId, setSelectedListingId] = useState("");

  const [showFeeModal, setShowFeeModal] = useState(false);
  const [listingFee, setListingFee] = useState(0);
  const [previewPriceForFee, setPreviewPriceForFee] = useState(0);

  const [allLibraryData, setAllLibraryData] = useState([]);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [libraryBikes, setLibraryBikes] = useState([]);

  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    category: "",
    price: "",
    condition: "",
    manufactureYear: "",
    frameSize: "",
    frameMaterial: "",
    color: "",
    wheelSize: "",
    rim: "",
    brakeType: "",
    forkType: "",
    shockAbsorber: "",
    drivetrain: "",
    numberOfGears: "",
    chainring: "",
    chain: "",
    handlebar: "",
    saddle: "",
    weight: "",
    images: [],
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (showRegisterModal && user) {
      const fetchListingsData = async () => {
        try {
          const [listingsRes, eventPostingsRes] = await Promise.all([
            bikeService.getMyBikeListings(),
            eventBicycleService
              .getMyEventPostings()
              .catch(() => ({ result: [] })),
          ]);

          const allListings = listingsRes?.result || [];
          const eventPostings = eventPostingsRes?.result || [];

          const registeredListingIds = eventPostings
            .map((post) => post.listing?.listingId || post.listing?.id || post.listingId)
            .filter(Boolean);
const currentEventListingIds = (eventBikes || [])
            .map((bike) => bike.listing?.listingId || bike.listing?.id || bike.listingId)
            .filter(Boolean);

          const allInvalidIds = [
            ...new Set([...registeredListingIds, ...currentEventListingIds]),
          ];

          const availableListings = allListings.filter((listing) => {
            const currentId = listing.listingId || listing.id;
            const isNotRegistered = !allInvalidIds.includes(currentId);
            const isAvailableStatus = listing.status === "Available"; 

            return isNotRegistered && isAvailableStatus;
          });

          setMyListings(availableListings);
        } catch (error) {
          console.error("Lỗi lấy dữ liệu xe:", error);
        }
      };
      
      fetchListingsData();

      if (availableBrands.length === 0) {
        bikeService
          .getBicycleLibrary()
          .then((res) => {
            if (res?.result) {
              setAllLibraryData(res.result);
              setAvailableBrands(
                Array.from(
                  new Set(res.result.map((b) => b.brand?.name).filter(Boolean)),
                ).sort(),
              );
              setAvailableCategories(
                Array.from(
                  new Set(
                    res.result
                      .map((b) => b.category?.name || b.bikeType)
                      .filter(Boolean),
                  ),
                ).sort(),
              );
            }
          })
          .catch(console.error);
      }
      
      if (eventDetail?.bikeType && eventDetail.bikeType !== "ALL") {
        setFormData((prev) => ({ ...prev, category: eventDetail.bikeType }));
      }
    }
  }, [showRegisterModal, user, eventDetail, availableBrands.length]);

  useEffect(() => {
    if (formData.brand && formData.brand !== "Khác") {
      setLibraryBikes(
        allLibraryData.filter((bike) => bike.brand?.name === formData.brand),
      );
    } else {
      setLibraryBikes([]);
    }
  }, [formData.brand, allLibraryData]);

  useEffect(() => {
    return () =>
      formData.images.forEach((img) => URL.revokeObjectURL(img.preview));
  }, [formData.images]);

  const handleSelectLibraryBike = (e) => {
    const selectedBike = libraryBikes.find(
      (b) => b.id === parseInt(e.target.value),
    );
    if (selectedBike) {
      setFormData((prev) => ({
        ...prev,
        model: selectedBike.model || prev.model,
        category:
          selectedBike.category?.name || selectedBike.bikeType || prev.category,
        manufactureYear: selectedBike.yearManufacture || prev.manufactureYear,
        frameSize: selectedBike.frameSize || prev.frameSize,
        frameMaterial: selectedBike.frameMaterial || prev.frameMaterial,
        color: selectedBike.color || prev.color,
        wheelSize: selectedBike.wheelSize || prev.wheelSize,
        rim: selectedBike.rim || prev.rim,
brakeType: selectedBike.brakeType || prev.brakeType,
        forkType: selectedBike.forkType || prev.forkType,
        shockAbsorber: selectedBike.shockAbsorber || prev.shockAbsorber,
        drivetrain: selectedBike.drivetrain || prev.drivetrain,
        numberOfGears: selectedBike.numberOfGears || prev.numberOfGears,
        chainring: selectedBike.chainring || prev.chainring,
        chain: selectedBike.chain || prev.chain,
        handlebar: selectedBike.handlebar || prev.handlebar,
        saddle: selectedBike.saddle || prev.saddle,
        weight: selectedBike.weight || prev.weight,
      }));
      setErrors((prev) => ({ ...prev, model: null, category: null }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
    if (errors.images) setErrors((prev) => ({ ...prev, images: null }));
  };

  const removeImage = (index) => {
    const imgToRemove = formData.images[index];
    if (imgToRemove) URL.revokeObjectURL(imgToRemove.preview);
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const formatDisplayAmount = (val) => {
    if (!val) return "";
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handlePreSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let priceForFee = 0;

      if (registerMode === "existing") {
        if (!selectedListingId) {
          toast.error("Vui lòng chọn một xe đang bán!");
          setIsSubmitting(false);
          return;
        }

        const isAlreadyRegistered = eventBikes.some(
          (bike) =>
            (bike.listing?.listingId || bike.listingId) ===
            parseInt(selectedListingId),
        );
        if (isAlreadyRegistered) {
          toast.error("Xe này đã có trong danh sách duyệt của sự kiện!");
          setIsSubmitting(false);
          return;
        }

        await eventBicycleService.registerBicycleToEvent(
          eventId,
          parseInt(selectedListingId),
        );
        toast.success(
          "Đăng ký xe tham gia sự kiện thành công! Chờ Admin duyệt.",
        );
        setShowRegisterModal(false);
        setSelectedListingId("");
      }
      else {
        const newErrors = {};
        if (!formData.brand) newErrors.brand = "Chọn thương hiệu";
        if (!formData.model.trim()) newErrors.model = "Nhập dòng xe";
        if (!formData.category) newErrors.category = "Chọn loại xe";
if (!formData.price || parseFloat(formData.price) <= 0)
          newErrors.price = "Nhập giá hợp lệ";
        if (!formData.condition) newErrors.condition = "Chọn tình trạng";
        if (formData.images.length === 0)
          newErrors.images = "Thêm ít nhất 1 ảnh";

        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          setIsSubmitting(false);
          return;
        }

        priceForFee = parseFloat(formData.price);
        const feeResponse = await bikeService.calculateListingFee(priceForFee);
        if (feeResponse && feeResponse.result !== undefined) {
          setListingFee(feeResponse.result);
          setPreviewPriceForFee(priceForFee);
          setShowFeeModal(true);
        } else {
          throw new Error("Không lấy được thông tin phí sàn");
        }
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại sau.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    try {
      const uploadedImageUrls = [];
      for (const img of formData.images) {
        const res = await uploadService.uploadImage(img.file);
        if (res?.result) uploadedImageUrls.push(res.result);
      }

      const createBicyclePayload = {
        brandName: formData.brand,
        categoryName: formData.category,
        bikeType: formData.category,
        title: `Xe tham gia sự kiện: ${formData.model}`,
        description: "Đăng ký trực tiếp vào sự kiện",
        price: formData.price ? parseFloat(formData.price) : 0,
        model: formData.model,
        condition: formData.condition,
        yearManufacture: formData.manufactureYear
          ? parseInt(formData.manufactureYear)
          : 0,
        frameSize: formData.frameSize || "Không rõ",
        frameMaterial: formData.frameMaterial || "Không rõ",
        color: formData.color || "Không rõ",
        wheelSize: formData.wheelSize || "Không rõ",
        rim: formData.rim || "Không rõ",
        brakeType: formData.brakeType || "Không rõ",
        forkType: formData.forkType || "Không rõ",
        shockAbsorber: formData.shockAbsorber || "Không rõ",
        drivetrain: formData.drivetrain || "Không rõ",
        numberOfGears: formData.numberOfGears || "Không rõ",
        chainring: formData.chainring || "Không rõ",
        chain: formData.chain || "Không rõ",
        handlebar: formData.handlebar || "Không rõ",
        saddle: formData.saddle || "Không rõ",
        weight: formData.weight ? parseFloat(formData.weight) : null,
        image_url: uploadedImageUrls.join(","),
      };

      const createBikeRes =
        await eventBicycleService.createBicycle(createBicyclePayload);
      const createdBikeId =
        createBikeRes.result?.bikeId || createBikeRes.result?.id;

      if (!createdBikeId) throw new Error("Không lấy được ID xe sau khi tạo.");
const requestBody = {
        title: `Xe tham gia sự kiện: ${formData.model}`,
        price: parseFloat(formData.price) || 0,
        condition: formData.condition,
        image_url: uploadedImageUrls.join(","),
      };

      const registerRes =
        await eventBicycleService.registerBicycleToEventWithoutPosting(
          eventId,
          createdBikeId,
          requestBody,
        );

      if (registerRes && registerRes.result) {
        if (registerRes.result.paymentUrl) {
          toast.loading("Đang chuyển hướng thanh toán VNPay...");
          window.location.href = registerRes.result.paymentUrl;
        } else {
          toast.success(
            registerRes.result.message ||
              "Đăng ký xe tham gia sự kiện thành công! Chờ Admin duyệt.",
          );
          setShowFeeModal(false);
          setShowRegisterModal(false);
          setFormData({
            brand: "",
            model: "",
            category:
              eventDetail?.bikeType === "ALL"
                ? ""
                : eventDetail?.bikeType || "",
            price: "",
            condition: "",
            manufactureYear: "",
            frameSize: "",
            frameMaterial: "",
            color: "",
            wheelSize: "",
            rim: "",
            brakeType: "",
            forkType: "",
            shockAbsorber: "",
            drivetrain: "",
            numberOfGears: "",
            chainring: "",
            chain: "",
            handlebar: "",
            saddle: "",
            weight: "",
            images: [],
          });
        }
      }
    } catch (error) {
      console.error("Lỗi đăng ký xe event:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Có lỗi xảy ra, vui lòng thử lại.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showRegisterModal) return null;

  return (
    <>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all overflow-y-auto py-10">
        <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl flex flex-col relative my-auto animate-in zoom-in-95 duration-200">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white rounded-t-3xl z-10">
            <div>
              <h3 className="text-xl font-black text-slate-900">
                Đăng ký xe tham gia sự kiện
              </h3>
              <p className="text-sm text-slate-500">
                Xe của bạn sẽ được hiển thị và kiểm định tại sự kiện.
              </p>
            </div>
            <button
              onClick={() => setShowRegisterModal(false)}
              className="p-2 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            >
              <MdClose size={24} />
            </button>
</div>

          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex gap-4">
            <button
              onClick={() => setRegisterMode("new")}
              className={`px-4 py-2 font-bold rounded-lg transition-colors ${registerMode === "new" ? "bg-orange-500 text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"}`}
            >
              Tạo xe mới
            </button>
            <button
              onClick={() => setRegisterMode("existing")}
              className={`px-4 py-2 font-bold rounded-lg transition-colors ${registerMode === "existing" ? "bg-orange-500 text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"}`}
            >
              Chọn xe đang bán
            </button>
          </div>

          <div className="p-6 md:p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
            <form
              id="registerBikeForm"
              onSubmit={handlePreSubmit}
              className="space-y-6"
            >
              {registerMode === "existing" ? (
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700">
                    Chọn bài đăng xe của bạn{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  {myListings.length === 0 ? (
                    <p className="text-slate-500 text-sm italic p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                      Bạn không có bài đăng xe hợp lệ nào. Vui lòng chọn "Tạo xe
                      mới".
                    </p>
                  ) : (
                    <>
                      <select
                        value={selectedListingId}
                        onChange={(e) => setSelectedListingId(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none cursor-pointer"
                      >
                        <option value="">-- Chọn xe --</option>
                        {myListings.map((item) => (
                          <option key={item.listingId} value={item.listingId}>
                            {item.title} ({item.price?.toLocaleString()}đ)
                          </option>
                        ))}
                      </select>
                      {selectedListingId &&
                        (() => {
                          const previewBike = myListings.find(
                            (b) => b.listingId === parseInt(selectedListingId),
                          );
                          if (!previewBike) return null;
                          return (
                            <div className="flex items-center gap-4 p-4 border border-orange-200 bg-orange-50 rounded-xl animate-in fade-in zoom-in-95 duration-200">
                              <BikeImage
src={previewBike.image_url?.split(",")[0]}
                                alt="preview"
                                className="w-24 h-24 rounded-lg object-cover border border-orange-200 shadow-sm"
                              />
                              <div className="flex-1">
                                <p className="font-bold text-slate-900 text-lg mb-1">
                                  {previewBike.title}
                                </p>
                                <p className="text-orange-600 font-bold">
                                  {previewBike.price?.toLocaleString()} đ
                                </p>
                                <p className="text-xs text-slate-500 bg-white px-2 py-1 rounded-md border border-orange-100 inline-block mt-2">
                                  Tình trạng: {previewBike.condition}
                                </p>
                              </div>
                            </div>
                          );
                        })()}
                    </>
                  )}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Thương hiệu <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="brand"
                        value={formData.brand}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            brand: e.target.value,
                            model: "",
                          });
                          if (errors.brand)
                            setErrors({ ...errors, brand: null });
                        }}
                        className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none ${errors.brand ? "border-red-500" : "border-slate-200"}`}
                      >
                        <option value="">Chọn hãng xe</option>
                        {availableBrands.map((b, idx) => (
                          <option key={idx} value={b}>
                            {b}
                          </option>
                        ))}
                        <option value="Khác">Khác</option>
                      </select>
                      {errors.brand && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.brand}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Dòng xe (Model) <span className="text-red-500">*</span>
                      </label>
<input
                        type="text"
                        name="model"
                        placeholder="VD: Marlin 7"
                        value={formData.model}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none ${errors.model ? "border-red-500" : "border-slate-200"}`}
                      />
                      {errors.model && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.model}
                        </p>
                      )}
                    </div>

                    {libraryBikes.length > 0 && (
                      <div className="sm:col-span-2 bg-orange-50/50 p-4 rounded-xl border border-orange-100">
                        <label className="block text-sm font-bold text-orange-600 mb-2 flex items-center gap-1">
                          <MdAutoAwesome size={18} /> Điền nhanh thông số từ thư
                          viện
                        </label>
                        <select
                          className="w-full px-4 py-3 bg-white border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all cursor-pointer text-orange-800"
                          onChange={handleSelectLibraryBike}
                        >
                          <option value="">
                            -- Chọn mẫu xe để tự động điền --
                          </option>
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
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Loại xe <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        disabled={
                          eventDetail?.bikeType &&
                          eventDetail.bikeType !== "ALL"
                        }
                        className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none ${errors.category ? "border-red-500" : "border-slate-200"}`}
                      >
                        <option value="">Chọn loại</option>
{availableCategories.map((c, idx) => (
                          <option key={idx} value={c}>
                            {c}
                          </option>
                        ))}
                        <option value="Khác">Khác</option>
                      </select>
                      {errors.category && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.category}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Tình trạng <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="condition"
                        value={formData.condition}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none ${errors.condition ? "border-red-500" : "border-slate-200"}`}
                      >
                        <option value="">Đánh giá xe</option>
                        <option value="Như mới">
                          Như mới (Hoạt động hoàn hảo)
                        </option>
                        <option value="Cũ">
                          Cũ (Trầy xước, hoạt động tốt)
                        </option>
                        <option value="Cần sửa chữa">
                          Cần sửa chữa (Hư hỏng nhẹ)
                        </option>
                        <option value="Xác xe">
                          Xác xe (Hư hỏng nặng/Lấy phụ tùng)
                        </option>
                      </select>
                      {errors.condition && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.condition}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Giá bán (VNĐ) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MdAttachMoney
                        className="absolute left-3 top-3.5 text-slate-400"
                        size={20}
                      />
                      <input
                        type="text"
                        name="price"
                        placeholder="VD: 5.000.000"
                        value={formatDisplayAmount(formData.price)}
                        onChange={(e) => {
                          let rawValue = e.target.value.replace(/\D/g, "");
                          if (rawValue.startsWith("0"))
                            rawValue = rawValue.replace(/^0+/, "");
setFormData({ ...formData, price: rawValue });
                          if (errors.price)
                            setErrors({ ...errors, price: null });
                        }}
                        className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-orange-500 font-bold outline-none ${errors.price ? "border-red-500" : "border-slate-200"}`}
                      />
                    </div>
                    {errors.price && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.price}
                      </p>
                    )}
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                      <MdAutoAwesome className="text-orange-500" /> Thông số chi
                      tiết (Tùy chọn)
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        name="frameSize"
                        placeholder="Size khung"
                        value={formData.frameSize}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-orange-500"
                      />
                      <input
                        type="text"
                        name="wheelSize"
                        placeholder="Size bánh"
                        value={formData.wheelSize}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-orange-500"
                      />
                      <input
                        type="number"
                        name="manufactureYear"
                        placeholder="Năm SX"
                        value={formData.manufactureYear}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-orange-500"
                      />
                      <input
                        type="text"
                        name="brakeType"
                        placeholder="Loại phanh"
                        value={formData.brakeType}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-orange-500"
                      />
                      <input
                        type="text"
                        name="frameMaterial"
                        placeholder="Chất liệu"
value={formData.frameMaterial}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-orange-500"
                      />
                      <input
                        type="text"
                        name="color"
                        placeholder="Màu sắc"
                        value={formData.color}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Hình ảnh thực tế <span className="text-red-500">*</span>
                    </label>
                    <label
                      className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${errors.images ? "border-red-500 bg-red-50" : "border-slate-300 bg-slate-50 hover:bg-slate-100"}`}
                    >
                      <MdCloudUpload
                        size={32}
                        className="text-slate-400 mb-2"
                      />
                      <span className="text-sm font-bold text-slate-600">
                        Bấm hoặc kéo thả ảnh vào đây
                      </span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    {errors.images && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.images}
                      </p>
                    )}
                    {formData.images.length > 0 && (
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mt-4">
                        {formData.images.map((img, idx) => (
                          <div
                            key={idx}
                            className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group"
                          >
                            <img
                              src={img.preview}
                              alt="preview"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(idx)}
className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                            >
                              <MdClose size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </form>
          </div>

          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-3xl">
            <button
              type="button"
              onClick={() => setShowRegisterModal(false)}
              className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-100 transition-colors"
              disabled={isSubmitting}
            >
              Hủy bỏ
            </button>
            <button
              form="registerBikeForm"
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold transition-all shadow-lg disabled:opacity-70"
            >
              {isSubmitting && (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {registerMode === "existing" ? "Đăng Ký Tham Gia" : "Tiếp tục"}
            </button>
          </div>
        </div>
      </div>

      {showFeeModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-all">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 md:p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mb-4">
                <MdWarning size={32} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">
                Thanh toán phí đăng ký
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                Để tham gia sự kiện, bạn cần thanh toán một khoản phí sàn. Số
                tiền này sẽ được trừ vào ví của bạn.
              </p>

              <div className="bg-gray-50 border border-gray-200 rounded-xl w-full p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 font-medium">
                    Giá xe đăng bán:
                  </span>
                  <span className="font-bold text-gray-900">
                    {formatDisplayAmount(previewPriceForFee)} đ
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
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleConfirmSubmit}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 shadow-lg shadow-orange-200 transition-all disabled:opacity-70 flex justify-center items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>{" "}
                      Đang xử lý
                    </>
                  ) : (
                    "Đồng ý & Đăng ký"
                  )}
                </button>
              </div>

              {isSubmitting && (
                <p className="text-xs text-orange-500 font-medium mt-4 animate-pulse">
                  Vui lòng không đóng trình duyệt. Sẽ tự động chuyển hướng nếu
                  ví không đủ tiền...
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RegisterBikeModal;