import React, { useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  MdArrowBack,
  MdCheckCircle,
  MdCancel,
  MdLocationOn,
  MdAccessTime,
  MdVerified,
  MdWarning,
  MdInfo,
  MdGridView,
  MdPhone,
  MdCalendarToday,
  MdStar,
} from "react-icons/md";
import formatCurrency from "../../../utils/formatCurrency";
// IMPORT DỮ LIỆU TỪ MOCK
import { MOCK_BIKES } from "../../../mockData/bikes";

const AdminPostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  // --- LOGIC LẤY DỮ LIỆU XE THEO ID ---
  const bike = useMemo(() => {
    // Tìm xe trong Mock Data (chuyển id sang string để so sánh)
    const foundBike = MOCK_BIKES.find((b) => b.id.toString() === id);
    // Nếu không tìm thấy, lấy xe đầu tiên làm fallback để không bị lỗi trang
    return foundBike || MOCK_BIKES[0];
  }, [id]);

  // --- CHUYỂN ĐỔI DỮ LIỆU SANG CẤU TRÚC TRANG DETAIL ---
  const post = {
    id: bike.id,
    title: bike.name,
    price: bike.price,
    originalPrice: bike.originalPrice,
    description: bike.description,
    seller: {
      ...bike.seller,
      joinDate: "15/01/2024", // Mock thêm
      phone: "0912***456", // Mock thêm
      rating: 4.8, // Mock thêm
      totalReview: 12, // Mock thêm
    },
    // Mock gallery ảnh (Vì mock data chỉ có 1 ảnh, ta nhân bản lên để demo UI)
    images: [bike.image, bike.image, bike.image, bike.image],
    specs: {
      "Thương hiệu": bike.brand,
      "Dòng xe": bike.type,
      "Khung sườn": bike.frame || "N/A",
      "Kích thước": "Tiêu chuẩn",
      "Bánh xe": bike.wheel || "N/A",
      "Tình trạng": `${bike.condition}%`,
      "Bộ truyền động": bike.gears || "N/A",
      Phanh: bike.brake || "N/A",
    },
    location: bike.location,
    createdAt: bike.postedTime,
    // Giả lập trạng thái dựa trên inspectorChecked
    status: bike.inspectorChecked ? "active" : "pending",
  };

  const handleApprove = () => {
    if (window.confirm("Xác nhận DUYỆT tin đăng này và hiển thị lên sàn?")) {
      alert("Đã duyệt tin thành công!");
      navigate("/admin/posts");
    }
  };

  const handleReject = () => {
    if (!rejectReason.trim()) return alert("Vui lòng nhập lý do từ chối");
    console.log("Reject reason:", rejectReason);
    alert("Đã từ chối tin đăng!");
    navigate("/admin/posts");
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* --- HEADER --- */}
      <div className="flex items-center justify-between mb-6 sticky top-0 bg-gray-50/95 backdrop-blur-sm py-4 z-10 border-b border-gray-200/50">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/posts"
            className="p-2 hover:bg-white hover:shadow-md rounded-xl transition-all border border-transparent hover:border-gray-200"
          >
            <MdArrowBack size={24} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              Chi tiết tin đăng
              <span className="text-xs font-normal text-gray-500 bg-gray-200 px-2 py-0.5 rounded-md">
                #{post.id}
              </span>
            </h1>
          </div>
        </div>
        <div>
          {post.status === "pending" ? (
            <span className="bg-yellow-100 text-yellow-700 px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 shadow-sm border border-yellow-200">
              <MdAccessTime /> Chờ duyệt
            </span>
          ) : (
            <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 shadow-sm border border-green-200">
              <MdCheckCircle /> Đã duyệt
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* --- LEFT COLUMN --- */}
        <div className="lg:col-span-8 space-y-8">
          {/* IMAGE GALLERY */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className="aspect-[16/9] rounded-xl overflow-hidden mb-3 bg-gray-100 border border-gray-100 relative group">
              <img
                src={post.images[selectedImage]}
                alt="Main"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex gap-3 overflow-x-auto pb-1 custom-scrollbar">
              {post.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? "border-orange-500 ring-2 ring-orange-100"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumb ${index}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
              <MdInfo className="text-blue-500" /> Mô tả chi tiết
            </h3>
            <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed whitespace-pre-line bg-gray-50/50 p-4 rounded-xl border border-gray-100">
              {post.description}
            </div>
          </div>

          {/* SPECS */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
              <MdGridView className="text-orange-500" /> Thông số kỹ thuật
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(post.specs).map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between items-center p-3 rounded-lg bg-gray-50 border border-gray-100 hover:bg-orange-50/50 transition-colors"
                >
                  <span className="text-sm text-gray-500 font-medium">
                    {key}
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN --- */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-24">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-2">
                {post.title}
              </h2>
              <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
                <MdLocationOn className="text-gray-400" />
                {post.location} •{" "}
                <MdCalendarToday className="ml-2 text-gray-400" />{" "}
                {post.createdAt}
              </div>
              <div className="flex items-end gap-3 pb-4 border-b border-gray-100">
                <span className="text-3xl font-bold text-orange-600">
                  {formatCurrency(post.price)}
                </span>
                {post.originalPrice && (
                  <span className="text-sm text-gray-400 line-through mb-1.5">
                    {formatCurrency(post.originalPrice)}
                  </span>
                )}
              </div>
            </div>

            {/* Seller Info */}
            <div className="mb-6">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                Người bán
              </h4>
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={post.seller.avatar}
                  alt={post.seller.name}
                  className="w-12 h-12 rounded-full border border-gray-100 shadow-sm"
                />
                <div>
                  <p className="font-bold text-gray-900 flex items-center gap-1">
                    {post.seller.name} <MdVerified className="text-blue-500" />
                  </p>
                  <div className="flex items-center gap-1 text-xs text-orange-500 font-bold">
                    {post.seller.rating} <MdStar />
                    <span className="text-gray-400 font-normal">
                      ({post.seller.totalReview} đánh giá)
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                <div className="bg-gray-50 p-2 rounded flex items-center gap-1">
                  <MdCalendarToday /> Tham gia: {post.seller.joinDate}
                </div>
                <div className="bg-gray-50 p-2 rounded flex items-center gap-1">
                  <MdPhone /> SĐT: {post.seller.phone}
                </div>
              </div>
            </div>

            {/* BUTTONS */}
            {post.status === "pending" && (
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleApprove}
                  className="w-full py-3.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-green-200 flex items-center justify-center gap-2"
                >
                  <MdCheckCircle size={20} /> DUYỆT BÀI NGAY
                </button>
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="w-full py-3.5 bg-white border border-gray-200 text-red-500 hover:bg-red-50 hover:border-red-200 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                >
                  <MdCancel size={20} /> TỪ CHỐI BÀI
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-red-600 flex items-center gap-2">
              <MdWarning /> Từ chối bài đăng?
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Vui lòng nhập lý do từ chối để gửi thông báo cho người bán.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="VD: Hình ảnh mờ, sai danh mục..."
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-50 transition-all resize-none text-sm mb-6"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleReject}
                className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-lg shadow-red-200"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPostDetailPage;
