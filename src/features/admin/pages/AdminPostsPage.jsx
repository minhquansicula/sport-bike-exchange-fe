import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MdSearch,
  MdFilterList,
  MdVisibility,
  MdCheckCircle,
  MdCancel,
  MdAccessTime,
  MdImage,
  MdChevronLeft, // Icon mũi tên trái
  MdChevronRight, // Icon mũi tên phải
} from "react-icons/md";
import formatCurrency from "../../../utils/formatCurrency";
import { MOCK_BIKES } from "../../../mockData/bikes";

const AdminPostsPage = () => {
  // --- 1. PREPARE DATA ---
  const initialData = MOCK_BIKES.map((bike) => ({
    id: bike.id,
    title: bike.name,
    price: bike.price,
    seller: bike.seller,
    status: bike.inspectorChecked ? "active" : "pending",
    createdAt: bike.postedTime,
    image: bike.image,
    category: bike.type,
    location: bike.location,
  }));

  const [posts, setPosts] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // --- 2. PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Số lượng tin hiển thị trên 1 trang

  // --- 3. FILTER LOGIC ---
  const filteredPosts = posts.filter((post) => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      post.title.toLowerCase().includes(term) ||
      post.id.toString().includes(term) ||
      post.seller.name.toLowerCase().includes(term);

    const matchStatus = filterStatus === "all" || post.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // --- 4. RESET PAGE KHI FILTER THAY ĐỔI ---
  // (Để tránh lỗi đang ở trang 5 mà lọc xong chỉ còn 1 trang)
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  // --- 5. PAGINATION CALCULATION ---
  const totalItems = filteredPosts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Dữ liệu thực tế sẽ hiển thị (đã cắt)
  const currentItems = filteredPosts.slice(indexOfFirstItem, indexOfLastItem);

  // --- HANDLERS ---
  const handleQuickAction = (id, action) => {
    if (
      window.confirm(
        `Bạn có chắc muốn ${
          action === "approve" ? "duyệt" : "từ chối"
        } tin này?`,
      )
    ) {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, status: action === "approve" ? "active" : "rejected" }
            : p,
        ),
      );
    }
  };

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 border border-yellow-200">
            <MdAccessTime size={12} /> Chờ duyệt
          </span>
        );
      case "active":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
            <MdCheckCircle size={12} /> Đang hiển thị
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
            <MdCancel size={12} /> Bị từ chối
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Tin đăng</h1>
          <p className="text-gray-500 text-sm mt-1">
            Kiểm duyệt tin đăng bán xe từ thành viên
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">
            Chờ duyệt
          </p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">
            {posts.filter((p) => p.status === "pending").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">
            Đang hiển thị
          </p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {posts.filter((p) => p.status === "active").length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo tên xe, mã tin, người bán..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-50 text-sm transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <MdFilterList className="text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-300 text-sm bg-white cursor-pointer"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ duyệt</option>
              <option value="active">Đang hiển thị</option>
              <option value="rejected">Đã từ chối</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Người bán
                </th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Giá bán
                </th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="text-right px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {/* Thay vì map filteredPosts, ta map currentItems */}
              {currentItems.map((post) => (
                <tr
                  key={post.id}
                  className="hover:bg-gray-50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <Link
                      to={`/admin/posts/${post.id}`}
                      className="flex items-center gap-3 group cursor-pointer"
                      title="Bấm để xem chi tiết"
                    >
                      <div className="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200 relative">
                        <img
                          src={post.image}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 line-clamp-1 max-w-[220px] group-hover:text-orange-600 transition-colors text-sm">
                          {post.title}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          {post.category} • {post.location}
                        </p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={post.seller.avatar}
                        alt=""
                        className="w-6 h-6 rounded-full border border-gray-100"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {post.seller.name}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 pl-8">
                      {post.createdAt}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-orange-600 text-sm">
                      {formatCurrency(post.price)}
                    </span>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(post.status)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        to={`/admin/posts/${post.id}`}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Xem chi tiết"
                      >
                        <MdVisibility size={18} />
                      </Link>

                      {post.status === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              handleQuickAction(post.id, "approve")
                            }
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                            title="Duyệt nhanh"
                          >
                            <MdCheckCircle size={18} />
                          </button>
                          <button
                            onClick={() => handleQuickAction(post.id, "reject")}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Từ chối nhanh"
                          >
                            <MdCancel size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <MdImage className="text-gray-300" size={32} />
            </div>
            <p className="text-gray-500 font-medium">
              Không tìm thấy tin đăng nào
            </p>
          </div>
        )}

        {/* --- PAGINATION FOOTER --- */}
        {filteredPosts.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50/50">
            {/* Info Text */}
            <div className="text-sm text-gray-500">
              Hiển thị{" "}
              <span className="font-bold text-gray-900">
                {indexOfFirstItem + 1}
              </span>{" "}
              -{" "}
              <span className="font-bold text-gray-900">
                {Math.min(indexOfLastItem, totalItems)}
              </span>{" "}
              trên tổng số{" "}
              <span className="font-bold text-gray-900">{totalItems}</span> tin
              đăng
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <MdChevronLeft size={20} />
              </button>

              {/* Page Numbers */}
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === page
                          ? "bg-orange-600 text-white shadow-sm"
                          : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}
              </div>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <MdChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPostsPage;
