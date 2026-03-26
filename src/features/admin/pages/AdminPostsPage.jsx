import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  MdSearch,
  MdVisibility,
  MdCheckCircle,
  MdCancel,
  MdAccessTime,
  MdChevronLeft,
  MdChevronRight,
  MdOutlineDirectionsBike,
  MdCheck,
  MdClose,
  MdLocationOn,
  MdStraighten,
  MdDonutLarge,
  MdSpeed,
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
  MdEventAvailable, // Import thêm icon này
} from "react-icons/md";
import formatCurrency from "../../../utils/formatCurrency";
import { bikeService } from "../../../services/bikeService";

const AdminPostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await bikeService.getAllBikeListings();
        if (response && response.result) {
          const mappedData = response.result.map((bike) => ({
            id: bike.listingId || bike.id,
            title: bike.title,
            price: bike.price,
            seller: {
              name: bike.sellerName || "Ẩn danh",
              avatar: `https://ui-avatars.com/api/?name=${bike.sellerName || "User"}&background=random`,
            },
            // Đồng bộ trạng thái: chuyển về chữ thường và thay dấu cách bằng dấu gạch dưới (VD: "Available in event" -> "available_in_event")
            status: bike.status
              ? bike.status.toLowerCase().replace(/\s+/g, "_")
              : "pending",
            createdAt: bike.createdAt
              ? new Date(bike.createdAt).toLocaleDateString("vi-VN")
              : "N/A",
            images: bike.image_url
              ? bike.image_url.split(",")
              : ["https://via.placeholder.com/800x600?text=No+Image"],
            image: bike.image_url
              ? bike.image_url.split(",")[0]
              : "https://via.placeholder.com/150",
            category: bike.categoryName || "Khác",
            brand: bike.brandName || "Khác",
            description: bike.description || "Không có mô tả chi tiết.",
            condition: bike.condition || "N/A",
            location: "VeloX Hub",

            // Bổ sung đầy đủ thông số kỹ thuật
            frameSize: bike.frameSize || "N/A",
            wheelSize: bike.wheelSize || "N/A",
            brakeType: bike.brakeType || "N/A",
            drivetrain: bike.drivetrain || bike.numberOfGears || "N/A",
            yearManufacture: bike.yearManufacture || "N/A",
            color: bike.color || "N/A",
            frameMaterial: bike.frameMaterial || "N/A",
            forkType: bike.forkType || "N/A",
            bikeType: bike.bikeType || "N/A",
            saddle: bike.saddle || "N/A",
            chainring: bike.chainring || "N/A",
            chain: bike.chain || "N/A",
            handlebar: bike.handlebar || "N/A",
            rim: bike.rim || "N/A",
            shockAbsorber: bike.shockAbsorber || "N/A",
          }));
          mappedData.sort((a, b) => b.id - a.id);
          setPosts(mappedData);
        }
      } catch (error) {
        console.error("Lỗi tải danh sách tin đăng:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const stats = useMemo(() => {
    return {
      all: posts.length,
      pending: posts.filter((p) => p.status === "pending").length,
      available: posts.filter((p) => p.status === "available").length,
      rejected: posts.filter((p) => p.status === "rejected").length,
    };
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const term = searchTerm.toLowerCase();
      const matchSearch =
        post.title.toLowerCase().includes(term) ||
        post.id.toString().includes(term) ||
        post.seller.name.toLowerCase().includes(term);

      const matchStatus = activeTab === "all" || post.status === activeTab;
      return matchSearch && matchStatus;
    });
  }, [posts, searchTerm, activeTab]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeTab]);

  const totalItems = filteredPosts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPosts.slice(indexOfFirstItem, indexOfLastItem);

  const handleQuickAction = async (id, action) => {
    const isApprove = action === "approve";
    const newStatus = isApprove ? "Available" : "Rejected";
    const confirmMsg = isApprove ? "Duyệt" : "Từ chối";

    if (window.confirm(`Xác nhận ${confirmMsg} tin đăng #${id}?`)) {
      try {
        await bikeService.updatePostingStatus(id, { status: newStatus });
        setPosts((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, status: newStatus.toLowerCase() } : p,
          ),
        );
        if (selectedPost && selectedPost.id === id) {
          setSelectedPost((prev) => ({
            ...prev,
            status: newStatus.toLowerCase(),
          }));
        }
      } catch (error) {
        alert("Có lỗi xảy ra. Vui lòng thử lại!");
      }
    }
  };

  const openPostModal = (post) => {
    setSelectedPost(post);
    setActiveImageIdx(0);
    setIsModalOpen(true);
  };

  const closePostModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedPost(null);
      setActiveImageIdx(0);
    }, 200);
  };

  const getStatusUI = (status) => {
    switch (status) {
      case "pending":
        return {
          label: "Chờ duyệt",
          icon: <MdAccessTime size={14} />,
          style: "bg-amber-100 text-amber-700 border-amber-200",
        };
      case "available":
        return {
          label: "Đang bán (Đã duyệt)",
          icon: <MdCheckCircle size={14} />,
          style: "bg-emerald-100 text-emerald-700 border-emerald-200",
        };
      case "rejected":
        return {
          label: "Từ chối",
          icon: <MdCancel size={14} />,
          style: "bg-rose-100 text-rose-700 border-rose-200",
        };
      case "sold":
        return {
          label: "Đã bán",
          icon: <MdCheckCircle size={14} />,
          style: "bg-gray-100 text-gray-700 border-gray-200",
        };
      case "waiting_payment":
        return {
          label: "Chờ thanh toán",
          icon: <MdAccessTime size={14} />,
          style: "bg-purple-100 text-purple-700 border-purple-200",
        };
      case "deposited":
        return {
          label: "Đã có người cọc",
          icon: <MdCheckCircle size={14} />,
          style: "bg-blue-100 text-blue-700 border-blue-200",
        };
      // --- BỔ SUNG TRẠNG THÁI XE SỰ KIỆN ---
      case "available_in_event":
        return {
          label: "Xe sự kiện (Đã duyệt)",
          icon: <MdEventAvailable size={14} />,
          style: "bg-orange-100 text-orange-700 border-orange-200",
        };
      // -------------------------------------
      default:
        return {
          label: status,
          icon: null,
          style: "bg-gray-100 text-gray-700",
        };
    }
  };

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const tabs = [
    { id: "all", label: "Tất cả", count: stats.all },
    {
      id: "pending",
      label: "Chờ duyệt",
      count: stats.pending,
      color: "text-amber-600",
    },
    {
      id: "available",
      label: "Đang hiển thị",
      count: stats.available,
      color: "text-emerald-600",
    },
    {
      id: "rejected",
      label: "Đã từ chối",
      count: stats.rejected,
      color: "text-rose-600",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 font-sans relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 tracking-tight">
            Tin đăng
          </h1>
          <p className="text-zinc-500 mt-1">Quản lý và kiểm duyệt xe đạp</p>
        </div>
        <div className="relative w-full md:w-80">
          <MdSearch
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Tìm theo tên, ID, người bán..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-zinc-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all shadow-sm text-sm font-medium"
          />
        </div>
      </div>

      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-zinc-900 text-white shadow-md"
                : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.id
                  ? "bg-zinc-700 text-zinc-100"
                  : `bg-zinc-100 ${tab.color || "text-zinc-500"}`
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 border-b border-zinc-100">
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                  Xe đạp
                </th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                  Người bán
                </th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-5 flex gap-4">
                      <div className="w-16 h-16 bg-zinc-200 rounded-xl"></div>
                      <div className="space-y-2 py-1 flex-1">
                        <div className="h-4 bg-zinc-200 rounded w-3/4"></div>
                        <div className="h-3 bg-zinc-200 rounded w-1/2"></div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="h-4 bg-zinc-200 rounded w-24"></div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="h-6 bg-zinc-200 rounded-full w-20"></div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="h-8 bg-zinc-200 rounded w-16 ml-auto"></div>
                    </td>
                  </tr>
                ))
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-20 text-center">
                    <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MdOutlineDirectionsBike
                        className="text-zinc-300"
                        size={32}
                      />
                    </div>
                    <p className="text-zinc-500 font-medium">
                      Không có dữ liệu phù hợp
                    </p>
                  </td>
                </tr>
              ) : (
                currentItems.map((post) => {
                  const statusUI = getStatusUI(post.status);
                  return (
                    <tr
                      key={post.id}
                      className="hover:bg-zinc-50 transition-colors group cursor-pointer"
                      onClick={() => openPostModal(post)}
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="shrink-0 relative rounded-xl overflow-hidden border border-zinc-200 w-16 h-16 block bg-zinc-100">
                            <img
                              src={post.image}
                              alt=""
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                          <div>
                            <span className="font-bold text-zinc-900 group-hover:text-orange-600 transition-colors line-clamp-1 text-sm md:text-base">
                              {post.title}
                            </span>
                            <div className="flex items-center gap-2 mt-1 text-xs text-zinc-500 font-medium">
                              <span className="text-orange-600 font-bold">
                                {formatCurrency(post.price)}
                              </span>
                              <span>•</span>
                              <span>{post.category}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={post.seller.avatar}
                            alt=""
                            className="w-8 h-8 rounded-full border border-zinc-200 bg-zinc-50"
                          />
                          <div>
                            <p className="text-sm font-bold text-zinc-900">
                              {post.seller.name}
                            </p>
                            <p className="text-xs text-zinc-500">
                              {post.createdAt}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusUI.style}`}
                        >
                          {statusUI.icon}
                          {statusUI.label}
                        </span>
                      </td>
                      <td
                        className="px-6 py-5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openPostModal(post)}
                            className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-all"
                            title="Xem chi tiết"
                          >
                            <MdVisibility size={20} />
                          </button>

                          {post.status === "pending" && (
                            <>
                              <button
                                onClick={() =>
                                  handleQuickAction(post.id, "approve")
                                }
                                className="flex items-center justify-center w-9 h-9 text-emerald-600 hover:text-white border border-emerald-200 hover:bg-emerald-500 hover:border-emerald-500 rounded-xl transition-all"
                                title="Duyệt"
                              >
                                <MdCheck size={20} />
                              </button>
                              <button
                                onClick={() =>
                                  handleQuickAction(post.id, "reject")
                                }
                                className="flex items-center justify-center w-9 h-9 text-rose-600 hover:text-white border border-rose-200 hover:bg-rose-500 hover:border-rose-500 rounded-xl transition-all"
                                title="Từ chối"
                              >
                                <MdClose size={20} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {!loading && filteredPosts.length > 0 && (
          <div className="px-6 py-4 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-50/50">
            <div className="text-sm text-zinc-500 font-medium">
              Hiển thị{" "}
              <span className="text-zinc-900">
                {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, totalItems)}
              </span>{" "}
              / <span className="text-zinc-900">{totalItems}</span>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl bg-white border border-zinc-200 text-zinc-500 hover:bg-zinc-50 disabled:opacity-50 transition-colors shadow-sm"
                >
                  <MdChevronLeft size={20} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`w-9 h-9 rounded-xl text-sm font-bold transition-all shadow-sm ${
                        currentPage === page
                          ? "bg-zinc-900 text-white border-zinc-900"
                          : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl bg-white border border-zinc-200 text-zinc-500 hover:bg-zinc-50 disabled:opacity-50 transition-colors shadow-sm"
                >
                  <MdChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- POPUP (MODAL) CHI TIẾT LỚN HƠN --- */}
      {isModalOpen && selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-zinc-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col transform transition-all scale-100 animate-in zoom-in-95 duration-200">
            {/* Header Popup */}
            <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/80">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-black text-zinc-900">
                  Tin đăng #{selectedPost.id}
                </h2>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusUI(selectedPost.status).style}`}
                >
                  {getStatusUI(selectedPost.status).icon}
                  {getStatusUI(selectedPost.status).label}
                </span>
              </div>
              <button
                onClick={closePostModal}
                className="p-2 bg-white border border-zinc-200 text-zinc-500 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 rounded-xl transition-all"
              >
                <MdClose size={24} />
              </button>
            </div>

            {/* Nội dung Popup */}
            <div className="flex-1 overflow-y-auto p-6 lg:p-8 scrollbar-hide">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                {/* Cột trái: Hình ảnh */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-100 shadow-inner">
                    <img
                      src={selectedPost.images[activeImageIdx]}
                      alt="Ảnh chính"
                      className="w-full h-full object-cover transition-opacity duration-300"
                    />
                  </div>
                  {/* Thumbnails */}
                  {selectedPost.images.length > 1 && (
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                      {selectedPost.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImageIdx(idx)}
                          className={`w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                            activeImageIdx === idx
                              ? "border-orange-500 opacity-100"
                              : "border-transparent opacity-60 hover:opacity-100"
                          }`}
                        >
                          <img
                            src={img}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Lối tắt mở trang public */}
                  <Link
                    to={`/bikes/${selectedPost.id}`}
                    target="_blank"
                    className="flex w-full justify-center items-center gap-2 py-3 rounded-xl bg-zinc-100 text-zinc-700 font-bold hover:bg-zinc-200 transition-colors"
                  >
                    Xem trên trang mua bán <MdVisibility size={18} />
                  </Link>
                </div>

                {/* Cột phải: Chi tiết thông tin */}
                <div className="lg:col-span-7 flex flex-col">
                  <div className="mb-6">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="text-xs text-zinc-500 font-medium bg-zinc-100 px-3 py-1 rounded-full">
                        Đăng ngày: {selectedPost.createdAt}
                      </span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black text-zinc-900 leading-tight">
                      {selectedPost.title}
                    </h3>
                    <p className="text-3xl md:text-4xl font-black text-orange-600 mt-3">
                      {formatCurrency(selectedPost.price)}
                    </p>
                  </div>

                  {/* Info Seller */}
                  <div className="flex items-center gap-4 p-4 mb-8 bg-white border border-zinc-200 shadow-sm rounded-2xl">
                    <img
                      src={selectedPost.seller.avatar}
                      alt="Seller"
                      className="w-14 h-14 rounded-full border border-zinc-100 bg-zinc-50"
                    />
                    <div>
                      <p className="text-xs text-zinc-500 font-bold mb-0.5 uppercase tracking-wider">
                        Người bán
                      </p>
                      <p className="font-bold text-zinc-900 text-lg">
                        {selectedPost.seller.name}
                      </p>
                    </div>
                  </div>

                  {/* Specs Grid */}
                  <div className="mb-8">
                    <h4 className="text-lg font-black text-zinc-900 mb-4 border-b border-zinc-100 pb-2">
                      Thông số kỹ thuật
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                        <p className="text-xs text-zinc-500 font-bold mb-1 flex items-center gap-1">
                          <MdColorLens /> Thương hiệu
                        </p>
                        <p
                          className="font-bold text-zinc-900 truncate"
                          title={selectedPost.brand}
                        >
                          {selectedPost.brand}
                        </p>
                      </div>
                      <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                        <p className="text-xs text-zinc-500 font-bold mb-1 flex items-center gap-1">
                          <MdOutlineDirectionsBike /> Loại xe
                        </p>
                        <p
                          className="font-bold text-zinc-900 truncate"
                          title={selectedPost.category}
                        >
                          {selectedPost.category}
                        </p>
                      </div>
                      <div className="p-3 bg-orange-50/50 rounded-xl border border-orange-100">
                        <p className="text-xs text-orange-600 font-bold mb-1 flex items-center gap-1">
                          <MdCheckCircle /> Độ mới
                        </p>
                        <p className="font-bold text-orange-700 truncate">
                          {selectedPost.condition}%
                        </p>
                      </div>
                      <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                        <p className="text-xs text-zinc-500 font-bold mb-1 flex items-center gap-1">
                          <MdStraighten /> Size Khung
                        </p>
                        <p
                          className="font-bold text-zinc-900 truncate"
                          title={selectedPost.frameSize}
                        >
                          {selectedPost.frameSize}
                        </p>
                      </div>
                      <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                        <p className="text-xs text-zinc-500 font-bold mb-1 flex items-center gap-1">
                          <MdDonutLarge /> Size Bánh
                        </p>
                        <p
                          className="font-bold text-zinc-900 truncate"
                          title={selectedPost.wheelSize}
                        >
                          {selectedPost.wheelSize}
                        </p>
                      </div>
                      <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                        <p className="text-xs text-zinc-500 font-bold mb-1 flex items-center gap-1">
                          <MdCalendarToday /> Năm SX
                        </p>
                        <p
                          className="font-bold text-zinc-900 truncate"
                          title={selectedPost.yearManufacture}
                        >
                          {selectedPost.yearManufacture}
                        </p>
                      </div>
                      <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                        <p className="text-xs text-zinc-500 font-bold mb-1 flex items-center gap-1">
                          <MdSpeed /> Bộ đề
                        </p>
                        <p
                          className="font-bold text-zinc-900 truncate"
                          title={selectedPost.drivetrain}
                        >
                          {selectedPost.drivetrain}
                        </p>
                      </div>
                      <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                        <p className="text-xs text-zinc-500 font-bold mb-1 flex items-center gap-1">
                          <MdErrorOutline /> Phanh
                        </p>
                        <p
                          className="font-bold text-zinc-900 truncate"
                          title={selectedPost.brakeType}
                        >
                          {selectedPost.brakeType}
                        </p>
                      </div>
                      <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                        <p className="text-xs text-zinc-500 font-bold mb-1 flex items-center gap-1">
                          <MdLocationOn /> Giao dịch tại
                        </p>
                        <p
                          className="font-bold text-zinc-900 truncate"
                          title={selectedPost.location}
                        >
                          {selectedPost.location}
                        </p>
                      </div>
                      <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                        <p className="text-xs text-zinc-500 font-bold mb-1 flex items-center gap-1">
                          <MdPrecisionManufacturing /> Chất liệu
                        </p>
                        <p
                          className="font-bold text-zinc-900 truncate"
                          title={selectedPost.frameMaterial}
                        >
                          {selectedPost.frameMaterial}
                        </p>
                      </div>
                      <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                        <p className="text-xs text-zinc-500 font-bold mb-1 flex items-center gap-1">
                          <MdHardware /> Phuộc
                        </p>
                        <p
                          className="font-bold text-zinc-900 truncate"
                          title={selectedPost.forkType}
                        >
                          {selectedPost.forkType}
                        </p>
                      </div>
                      <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                        <p className="text-xs text-zinc-500 font-bold mb-1 flex items-center gap-1">
                          <MdColorLens /> Màu sắc
                        </p>
                        <p
                          className="font-bold text-zinc-900 truncate"
                          title={selectedPost.color}
                        >
                          {selectedPost.color}
                        </p>
                      </div>
                      <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                        <p className="text-xs text-zinc-500 font-bold mb-1 flex items-center gap-1">
                          <MdEventSeat /> Yên xe
                        </p>
                        <p
                          className="font-bold text-zinc-900 truncate"
                          title={selectedPost.saddle}
                        >
                          {selectedPost.saddle}
                        </p>
                      </div>
                      <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                        <p className="text-xs text-zinc-500 font-bold mb-1 flex items-center gap-1">
                          <MdSettings /> Đĩa
                        </p>
                        <p
                          className="font-bold text-zinc-900 truncate"
                          title={selectedPost.chainring}
                        >
                          {selectedPost.chainring}
                        </p>
                      </div>
                      <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                        <p className="text-xs text-zinc-500 font-bold mb-1 flex items-center gap-1">
                          <MdLink /> Xích xe
                        </p>
                        <p
                          className="font-bold text-zinc-900 truncate"
                          title={selectedPost.chain}
                        >
                          {selectedPost.chain}
                        </p>
                      </div>
                      <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                        <p className="text-xs text-zinc-500 font-bold mb-1 flex items-center gap-1">
                          <MdLinearScale /> Ghi đông
                        </p>
                        <p
                          className="font-bold text-zinc-900 truncate"
                          title={selectedPost.handlebar}
                        >
                          {selectedPost.handlebar}
                        </p>
                      </div>
                      <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                        <p className="text-xs text-zinc-500 font-bold mb-1 flex items-center gap-1">
                          <MdRadioButtonUnchecked /> Vành xe
                        </p>
                        <p
                          className="font-bold text-zinc-900 truncate"
                          title={selectedPost.rim}
                        >
                          {selectedPost.rim}
                        </p>
                      </div>
                      <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                        <p className="text-xs text-zinc-500 font-bold mb-1 flex items-center gap-1">
                          <MdCompress /> Giảm xốc
                        </p>
                        <p
                          className="font-bold text-zinc-900 truncate"
                          title={selectedPost.shockAbsorber}
                        >
                          {selectedPost.shockAbsorber}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="flex-1 flex flex-col">
                    <h4 className="text-lg font-black text-zinc-900 mb-3 border-b border-zinc-100 pb-2">
                      Mô tả chi tiết
                    </h4>
                    <div className="text-sm text-zinc-700 leading-relaxed bg-white border border-zinc-200 p-5 rounded-2xl flex-1 overflow-y-auto whitespace-pre-wrap shadow-inner">
                      {selectedPost.description}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Popup - Các nút hành động */}
            {selectedPost.status === "pending" && (
              <div className="px-6 py-5 border-t border-zinc-200 bg-white flex justify-end gap-4 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
                <button
                  onClick={() => handleQuickAction(selectedPost.id, "reject")}
                  className="px-8 py-3.5 rounded-xl font-bold text-rose-600 bg-white border-2 border-rose-200 hover:bg-rose-50 hover:border-rose-300 transition-all flex items-center gap-2"
                >
                  <MdClose size={22} /> Từ chối tin đăng
                </button>
                <button
                  onClick={() => handleQuickAction(selectedPost.id, "approve")}
                  className="px-10 py-3.5 rounded-xl font-bold text-white bg-zinc-900 hover:bg-emerald-600 shadow-xl hover:shadow-emerald-200 transition-all flex items-center gap-2"
                >
                  <MdCheck size={22} /> Duyệt cho lên sàn
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPostsPage;
