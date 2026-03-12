import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { eventService } from "../../../services/eventService";
import { eventBicycleService } from "../../../services/eventBicycleService";
import { uploadService } from "../../../services/uploadService";
import { bikeService } from "../../../services/bikeService";

import {
  MdLocationOn,
  MdCalendarToday,
  MdStorefront,
  MdCheckCircle,
  MdLocalOffer,
  MdWarning,
  MdArrowBack,
  MdPedalBike,
  MdMap,
  MdClose,
  MdAutoAwesome,
  MdCloudUpload,
  MdAttachMoney,
  MdShoppingCartCheckout,
} from "react-icons/md";

const EventDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [eventDetail, setEventDetail] = useState(null);
  const [eventBikes, setEventBikes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Popup & Chế độ đăng ký
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerMode, setRegisterMode] = useState("new"); // "new" | "existing"
  const [myListings, setMyListings] = useState([]);
  const [selectedListingId, setSelectedListingId] = useState("");

  // Thư viện
  const [allLibraryData, setAllLibraryData] = useState([]);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [libraryBikes, setLibraryBikes] = useState([]);

  // Form xe mới
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    category: "",
    price: "",
    manufactureYear: "",
    frameSize: "",
    wheelSize: "",
    brakeType: "",
    transmission: "",
    weight: "",
    condition: "",
    color: "",
    frameMaterial: "",
    forkType: "",
    images: [],
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        const [eventRes, bikesRes] = await Promise.all([
          eventService.getEventById(id),
          eventBicycleService
            .getAllEventBicycles()
            .catch(() => ({ result: [] })),
        ]);

        if (eventRes?.result) {
          setEventDetail(eventRes.result);
        }

        const bikesList = Array.isArray(bikesRes?.result)
          ? bikesRes.result
          : Array.isArray(bikesRes)
            ? bikesRes
            : [];
        const approvedBikes = bikesList.filter(
          (b) => b.event?.eventId === parseInt(id) && b.status === "Available",
        );
        setEventBikes(approvedBikes);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu sự kiện:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEventData();
  }, [id]);

  useEffect(() => {
    if (showRegisterModal) {
      if (user) {
        bikeService
          .getMyBikeListings()
          .then((res) => {
            if (res?.result) setMyListings(res.result);
          })
          .catch(console.error);
      }

      if (availableBrands.length === 0) {
        bikeService
          .getBicycleLibrary()
          .then((res) => {
            if (res?.result) {
              setAllLibraryData(res.result);
              const uniqueBrands = Array.from(
                new Set(res.result.map((b) => b.brand?.name).filter(Boolean)),
              ).sort();
              setAvailableBrands(uniqueBrands);

              const uniqueCategories = Array.from(
                new Set(
                  res.result
                    .map((b) => b.category?.name || b.bikeType)
                    .filter(Boolean),
                ),
              ).sort();
              setAvailableCategories(uniqueCategories);
            }
          })
          .catch(console.error);
      }
    }
  }, [showRegisterModal, user, availableBrands.length]);

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

  const handleOpenRegister = () => {
    if (!user) {
      alert("Vui lòng đăng nhập để đăng ký bán xe tại sự kiện này!");
      navigate("/login");
      return;
    }
    if (eventDetail?.bikeType && eventDetail.bikeType !== "ALL") {
      setFormData((prev) => ({ ...prev, category: eventDetail.bikeType }));
    }
    setShowRegisterModal(true);
  };

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

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (registerMode === "existing") {
        if (!selectedListingId) {
          alert("Vui lòng chọn một xe đang bán!");
          setIsSubmitting(false);
          return;
        }
        await eventBicycleService.registerBicycleToEvent(
          id,
          parseInt(selectedListingId),
        );
        alert("Đăng ký xe tham gia sự kiện thành công! Chờ Admin duyệt.");
        setShowRegisterModal(false);
      } else {
        const newErrors = {};
        if (!formData.brand) newErrors.brand = "Chọn thương hiệu";
        if (!formData.model.trim()) newErrors.model = "Nhập dòng xe";
        if (!formData.category) newErrors.category = "Chọn loại xe";
        if (!formData.price || formData.price <= 0)
          newErrors.price = "Nhập giá hợp lệ";
        if (!formData.condition) newErrors.condition = "Chọn tình trạng";
        if (formData.images.length === 0)
          newErrors.images = "Thêm ít nhất 1 ảnh";

        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          setIsSubmitting(false);
          return;
        }

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
          price: parseFloat(formData.price) || 0,
          model: formData.model,
          wheelSize: formData.wheelSize || "Không rõ",
          brakeType: formData.brakeType || "Không rõ",
          drivetrain: formData.transmission || "Không rõ",
          numberOfGears: formData.transmission || "Không rõ",
          frameSize: formData.frameSize || "Không rõ",
          yearManufacture: formData.manufactureYear
            ? parseInt(formData.manufactureYear)
            : 0,
          condition: formData.condition,
          color: formData.color || "Không rõ",
          frameMaterial: formData.frameMaterial || "Không rõ",
          forkType: formData.forkType || "Không rõ",
          image_url: uploadedImageUrls.join(","),
        };

        const createBikeRes =
          await eventBicycleService.createBicycle(createBicyclePayload);
        const createdBikeId =
          createBikeRes.result?.bikeId || createBikeRes.result?.id;

        if (!createdBikeId)
          throw new Error("Không lấy được ID xe sau khi tạo.");

        await eventBicycleService.registerBicycleToEventWithoutPosting(
          id,
          createdBikeId,
        );

        alert("Đăng ký xe tham gia sự kiện thành công! Chờ Admin duyệt.");
        setShowRegisterModal(false);
        setFormData({
          brand: "",
          model: "",
          category:
            eventDetail?.bikeType === "ALL" ? "" : eventDetail?.bikeType || "",
          price: "",
          manufactureYear: "",
          frameSize: "",
          wheelSize: "",
          brakeType: "",
          transmission: "",
          weight: "",
          condition: "",
          color: "",
          frameMaterial: "",
          forkType: "",
          images: [],
        });
      }
    } catch (error) {
      console.error("Lỗi đăng ký xe event:", error);
      alert(
        error.response?.data?.message ||
          error.message ||
          "Có lỗi xảy ra, vui lòng thử lại.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeposit = (eventBike) => {
    alert(
      `Chức năng đặt cọc cho xe ID ${eventBike.eventBikeId} đang được phát triển!`,
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-bold tracking-wide">
          Đang tải thông tin sự kiện...
        </p>
      </div>
    );
  }

  if (!eventDetail) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center px-4">
        <MdWarning size={64} className="text-slate-300 mb-4" />
        <h2 className="text-2xl font-black text-slate-800 mb-2">
          Sự kiện không tồn tại
        </h2>
        <button
          onClick={() => navigate("/events")}
          className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold mt-4"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  const fallbackImage =
    "https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&q=80&w=2000";
  const mapUrl = `https://maps.google.com/?q=${eventDetail.latitude ? `${eventDetail.latitude},${eventDetail.longitude}` : encodeURIComponent(eventDetail.address || eventDetail.location)}`;

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans selection:bg-orange-500 selection:text-white">
      <div className="bg-slate-900 text-white relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 scale-105 animate-kenburns"
          style={{ backgroundImage: `url(${fallbackImage})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>

        <div className="container mx-auto px-4 py-12 md:py-24 relative z-10">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white font-medium mb-8 transition-colors bg-white/10 px-4 py-2 rounded-full backdrop-blur-md w-fit"
          >
            <MdArrowBack size={20} /> Quay lại danh sách
          </Link>

          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span
                className={`px-4 py-1.5 rounded-lg text-sm font-black tracking-wider uppercase shadow-lg ${
                  eventDetail.status === "ongoing"
                    ? "bg-green-500 text-white animate-pulse"
                    : eventDetail.status === "upcoming"
                      ? "bg-orange-500 text-white"
                      : "bg-slate-600 text-white"
                }`}
              >
                {eventDetail.status === "ongoing"
                  ? "Đang diễn ra"
                  : eventDetail.status === "upcoming"
                    ? "Sắp diễn ra"
                    : "Đã kết thúc"}
              </span>
              <span className="flex items-center gap-1.5 px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-lg text-sm font-bold shadow-lg">
                <MdPedalBike className="text-orange-400" />{" "}
                {eventDetail.bikeType === "ALL"
                  ? "Tất cả dòng xe"
                  : eventDetail.bikeType}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight drop-shadow-lg">
              {eventDetail.name}
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed drop-shadow-md">
              Cơ hội tuyệt vời để trải nghiệm thực tế, lái thử và mua bán hàng
              trăm mẫu xe đạp thể thao chất lượng cao. Mang xe của bạn đến để
              được kiểm định và bán ngay tại sự kiện!
            </p>

            {eventDetail.status !== "completed" &&
              eventDetail.status !== "cancelled" && (
                <button
                  onClick={handleOpenRegister}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-orange-500/30 flex items-center gap-3 hover:-translate-y-1 active:scale-95"
                >
                  <MdLocalOffer size={24} /> Đăng ký xe tham gia
                </button>
              )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-6 md:p-8 rounded-[24px] shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-col gap-4">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
              <MdCalendarToday size={26} />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-lg mb-2">
                Thời gian tổ chức
              </h3>
              <p className="text-slate-600 font-medium flex items-center gap-2">
                <span className="w-12 text-slate-400 text-sm">Bắt đầu:</span>{" "}
                {eventDetail.startDate}
              </p>
              <p className="text-slate-600 font-medium flex items-center gap-2">
                <span className="w-12 text-slate-400 text-sm">Kết thúc:</span>{" "}
                {eventDetail.endDate}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-[24px] shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center shrink-0">
                <MdLocationOn size={28} />
              </div>
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                title="Mở Google Maps"
              >
                <MdMap size={24} />
              </a>
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-lg mb-2">
                Địa điểm
              </h3>
              <p className="text-slate-800 font-bold text-lg leading-tight">
                {eventDetail.location}
              </p>
              <p className="text-slate-500 mt-2 line-clamp-2">
                {eventDetail.address}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 md:p-8 rounded-[24px] shadow-xl shadow-orange-200/20 border border-orange-200 flex flex-col gap-4">
            <div className="w-14 h-14 bg-white text-orange-500 shadow-sm rounded-2xl flex items-center justify-center shrink-0">
              <MdWarning size={28} />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-lg mb-2">
                Quy định sự kiện
              </h3>
              <p className="text-slate-700 leading-relaxed">
                Chỉ cho phép đăng ký kiểm định và giao dịch các dòng xe thuộc
                danh mục:
                <strong className="text-orange-600 bg-white px-2 py-1 rounded-md shadow-sm ml-1">
                  {eventDetail.bikeType === "ALL"
                    ? "Tất cả loại xe"
                    : eventDetail.bikeType}
                </strong>
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
              <MdStorefront className="text-orange-500" /> Sẽ Có Mặt Tại Sự Kiện
            </h2>
            <p className="text-slate-500 mt-2 font-medium">
              Khám phá các xe đã đăng ký tham gia giao dịch.
            </p>
          </div>
        </div>

        {eventBikes.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <MdPedalBike size={64} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-500 font-medium text-lg">
              Chưa có xe nào được duyệt tham gia sự kiện này.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {eventBikes.map((bike) => {
              const displayTitle =
                bike.listing?.title || bike.bicycle?.model || "Xe đạp sự kiện";
              const displayPrice = bike.listing?.price
                ? bike.listing.price.toLocaleString() + " đ"
                : bike.bicycle?.price
                  ? bike.bicycle.price.toLocaleString() + " đ"
                  : "Thỏa thuận";
              const displayImg =
                bike.listing?.image_url?.split(",")[0] ||
                "https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=600&q=80";
              const condition =
                bike.listing?.condition ||
                bike.bicycle?.condition ||
                "Không rõ";

              return (
                <div
                  key={bike.eventBikeId}
                  className="bg-white rounded-[20px] overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group flex flex-col"
                >
                  <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                    <img
                      src={displayImg}
                      alt={displayTitle}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl text-xs font-bold text-green-600 flex items-center gap-1.5 shadow-sm">
                      <MdCheckCircle size={16} /> Đã duyệt
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-black text-slate-900 text-lg mb-2 line-clamp-2">
                      {displayTitle}
                    </h3>
                    <p className="text-orange-600 font-bold text-lg mb-4">
                      {displayPrice}
                    </p>
                    <div className="flex flex-col gap-2 text-sm text-slate-500 font-medium mt-auto mb-4">
                      <div className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-lg">
                        <span>Chủ xe</span>
                        <span className="text-slate-900 font-bold">
                          {bike.sellerName}
                        </span>
                      </div>
                      <div className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-lg">
                        <span>Tình trạng</span>
                        <span className="text-slate-900 font-bold">
                          {condition}
                        </span>
                      </div>
                    </div>
                    {eventDetail.status !== "completed" && (
                      <button
                        onClick={() => handleDeposit(bike)}
                        className="w-full py-2.5 bg-slate-900 hover:bg-orange-500 text-white rounded-xl font-bold transition-colors flex justify-center items-center gap-2"
                      >
                        <MdShoppingCartCheckout size={20} /> Đặt cọc
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {eventDetail.status !== "completed" &&
          eventDetail.status !== "cancelled" && (
            <div className="mt-16 text-center bg-slate-900 rounded-[32px] p-10 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2"></div>
              <div className="relative z-10">
                <h3 className="text-3xl font-black text-white mb-4">
                  Bạn có xe muốn bán?
                </h3>
                <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
                  Đăng ký kiểm định trước để quá trình giao dịch tại sự kiện
                  diễn ra nhanh chóng và uy tín hơn.
                </p>
                <button
                  onClick={handleOpenRegister}
                  className="bg-orange-500 hover:bg-orange-400 text-white px-10 py-4 rounded-2xl font-black text-lg transition-all shadow-lg hover:-translate-y-1"
                >
                  Đăng Ký Ngay
                </button>
              </div>
            </div>
          )}
      </div>

      {/* MODAL ĐĂNG KÝ */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all overflow-y-auto py-10">
          <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl flex flex-col relative my-auto animate-in zoom-in-95 duration-200">
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
                onSubmit={handleRegisterSubmit}
                className="space-y-6"
              >
                {registerMode === "existing" ? (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Chọn bài đăng xe của bạn{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    {myListings.length === 0 ? (
                      <p className="text-slate-500 text-sm italic">
                        Bạn chưa có bài đăng nào. Vui lòng chọn "Tạo xe mới".
                      </p>
                    ) : (
                      <select
                        value={selectedListingId}
                        onChange={(e) => setSelectedListingId(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                      >
                        <option value="">-- Chọn xe --</option>
                        {myListings.map((item) => (
                          <option key={item.listingId} value={item.listingId}>
                            {item.title} ({item.price?.toLocaleString()}đ)
                          </option>
                        ))}
                      </select>
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
                          Dòng xe (Model){" "}
                          <span className="text-red-500">*</span>
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
                            <MdAutoAwesome size={18} /> Điền nhanh thông số từ
                            thư viện
                          </label>
                          <select
                            className="w-full px-4 py-3 bg-white border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none cursor-pointer text-orange-800"
                            onChange={handleSelectLibraryBike}
                          >
                            <option value="">-- Chọn mẫu xe --</option>
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

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
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
                          Giá bán (VNĐ) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            name="price"
                            placeholder="VD: 5000000"
                            value={formData.price}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none ${errors.price ? "border-red-500" : "border-slate-200"}`}
                          />
                          <MdAttachMoney className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
                        </div>
                        {errors.price && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.price}
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
                          <option value="Như mới">Như mới</option>
                          <option value="Cũ">Cũ</option>
                          <option value="Cần sửa chữa">Cần sửa chữa</option>
                          <option value="Xác xe">Xác xe</option>
                        </select>
                        {errors.condition && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.condition}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                        <MdAutoAwesome className="text-orange-500" /> Thông số
                        chi tiết (Tùy chọn)
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <input
                          type="text"
                          name="frameSize"
                          placeholder="Size khung"
                          value={formData.frameSize}
                          onChange={handleChange}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none"
                        />
                        <input
                          type="text"
                          name="wheelSize"
                          placeholder="Size bánh"
                          value={formData.wheelSize}
                          onChange={handleChange}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none"
                        />
                        <input
                          type="number"
                          name="manufactureYear"
                          placeholder="Năm SX"
                          value={formData.manufactureYear}
                          onChange={handleChange}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Hình ảnh thực tế <span className="text-red-500">*</span>
                      </label>
                      <label
                        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer ${errors.images ? "border-red-500 bg-red-50" : "border-slate-300 bg-slate-50 hover:bg-slate-100"}`}
                      >
                        <MdCloudUpload
                          size={32}
                          className="text-slate-400 mb-2"
                        />
                        <span className="text-sm font-bold text-slate-600">
                          Bấm hoặc kéo thả ảnh
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
                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100"
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
                className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-100"
                disabled={isSubmitting}
              >
                Hủy bỏ
              </button>
              <button
                form="registerBikeForm"
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold shadow-lg disabled:opacity-70"
              >
                {isSubmitting ? "Đang gửi..." : "Gửi Đăng Ký"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetailPage;
