import React, { useState, useEffect } from "react";
import {
  MdSearch,
  MdFilterList,
  MdBlock,
  MdCheckCircle,
  MdPerson,
  MdVerified,
  MdVisibility,
  MdChevronLeft,
  MdChevronRight,
  MdClose,
  MdLocationOn,
  MdEmail,
  MdPhone,
  MdCalendarToday,
} from "react-icons/md";
import { userService } from "../../../services/userService";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // State cho Modal Xem chi tiết
  const [viewUser, setViewUser] = useState(null);

  // --- STATE PHÂN TRANG ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // 1. Fetch dữ liệu từ Backend
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers();
      if (response && response.result) {
        setUsers(response.result);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách người dùng:", error);
      alert("Không thể tải danh sách người dùng!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Tự động quay về trang 1 khi người dùng tìm kiếm hoặc lọc
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterRole, filterStatus]);

  // 2. Xử lý khóa / mở khóa tài khoản
  const handleToggleStatus = async (userId) => {
    if (
      window.confirm("Bạn có chắc chắn muốn thay đổi trạng thái tài khoản này?")
    ) {
      try {
        await userService.toggleUserStatus(userId);
        alert("Cập nhật trạng thái thành công!");
        fetchUsers();
        // Nếu đang mở popup của người đó thì đóng luôn hoặc update
        if (viewUser && viewUser.userId === userId) {
          setViewUser(null);
        }
      } catch (error) {
        console.error("Lỗi cập nhật trạng thái:", error);
        alert("Cập nhật trạng thái thất bại.");
      }
    }
  };

  // 3. Lọc users trên giao diện (VÀ ẨN QUẢN TRỊ VIÊN)
  const filteredUsers = users.filter((user) => {
    const role = (user.role || "member").toLowerCase();

    // --- ẨN ACCOUNT ADMIN KHỎI DANH SÁCH ---
    if (role === "admin") {
      return false;
    }

    const name = user.fullName || user.username || "";
    const email = user.email || "";
    const status = (user.status || "active").toLowerCase();

    const matchSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchRole = filterRole === "all" || role === filterRole;
    const matchStatus = filterStatus === "all" || status === filterStatus;

    return matchSearch && matchRole && matchStatus;
  });

  // --- LOGIC PHÂN TRANG ---
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // UI Helpers
  const getRoleBadge = (role) => {
    const r = (role || "member").toLowerCase();
    if (r === "inspector") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
          <MdVerified size={12} /> Inspector
        </span>
      );
    }
    // Formatter fallback (mặc dù Admin đã bị ẩn)
    if (r === "admin") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
          Admin
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
        <MdPerson size={12} /> Member
      </span>
    );
  };

  const renderStatusBadge = (status) => {
    const s = (status || "active").toLowerCase();
    if (s === "active") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
          <MdCheckCircle size={12} /> Hoạt động
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
        <MdBlock size={12} /> Đã khóa
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Quản lý Users
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Quản lý Member và Inspector, xem chi tiết và khóa/mở khóa tài khoản
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
          <span className="text-sm text-gray-600 font-medium">
            Tổng hệ thống:{" "}
            <strong className="text-orange-600 text-lg">
              {filteredUsers.length}
            </strong>{" "}
            người dùng
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <MdSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={22}
            />
            <input
              type="text"
              placeholder="Tìm theo tên, username, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-all outline-none"
            />
          </div>

          <div className="flex items-center gap-2 relative min-w-[160px]">
            <MdFilterList
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-all outline-none appearance-none cursor-pointer font-medium text-slate-700"
            >
              <option value="all">Tất cả Role</option>
              <option value="member">Member</option>
              <option value="inspector">Inspector</option>
              {/* Đã xóa option Admin ở đây */}
            </select>
          </div>

          <div className="relative min-w-[180px]">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-all outline-none appearance-none cursor-pointer font-medium text-slate-700"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="banned">Đã khóa / Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm flex flex-col">
        {loading ? (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            Đang tải dữ liệu người dùng...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Người dùng
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Liên hệ
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Ngày tham gia
                  </th>
                  <th className="text-right px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {currentUsers.map((user) => {
                  const roleStr = user.role || "member";
                  const statusStr = user.status || "active";
                  const displayName =
                    user.fullName || user.username || "Chưa cập nhật tên";

                  return (
                    <tr
                      key={user.userId}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              user.avatar ||
                              `https://ui-avatars.com/api/?name=${displayName}&background=random`
                            }
                            alt="avatar"
                            className="w-10 h-10 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <p className="font-bold text-slate-900">
                              {displayName}
                            </p>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">
                              @{user.username || `user_${user.userId}`}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-900 font-medium">
                          {user.email || "—"}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {user.phone || "—"}
                        </p>
                      </td>
                      <td className="px-6 py-4">{getRoleBadge(roleStr)}</td>
                      <td className="px-6 py-4">
                        {renderStatusBadge(statusStr)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600">
                          {user.createdAt || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setViewUser(user)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Xem chi tiết"
                          >
                            <MdVisibility size={18} />
                          </button>

                          {statusStr.toLowerCase() === "active" ? (
                            <button
                              onClick={() => handleToggleStatus(user.userId)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              title="Khóa tài khoản"
                            >
                              <MdBlock size={18} />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleToggleStatus(user.userId)}
                              className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                              title="Mở khóa"
                            >
                              <MdCheckCircle size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredUsers.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MdPerson className="text-slate-400" size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">
              Không tìm thấy người dùng
            </h3>
            <p className="text-slate-500">
              Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.
            </p>
          </div>
        )}

        {/* Phân trang */}
        {!loading && filteredUsers.length > 0 && (
          <div className="border-t border-slate-100 p-4 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
            <div className="text-sm text-slate-500 font-medium">
              Hiển thị{" "}
              <span className="font-bold text-slate-900">{startIndex + 1}</span>{" "}
              đến{" "}
              <span className="font-bold text-slate-900">
                {Math.min(endIndex, filteredUsers.length)}
              </span>{" "}
              trong tổng số{" "}
              <span className="font-bold text-slate-900">
                {filteredUsers.length}
              </span>{" "}
              kết quả
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <MdChevronLeft size={20} />
              </button>
              <div className="flex items-center gap-1 px-2">
                {[...Array(totalPages)].map((_, idx) => {
                  const pageNum = idx + 1;
                  if (
                    totalPages > 5 &&
                    pageNum !== 1 &&
                    pageNum !== totalPages &&
                    Math.abs(pageNum - currentPage) > 1
                  ) {
                    if (pageNum === 2 || pageNum === totalPages - 1)
                      return (
                        <span key={idx} className="text-slate-400 px-1">
                          ...
                        </span>
                      );
                    return null;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${
                        currentPage === pageNum
                          ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                          : "bg-transparent text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <MdChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* POPUP CHI TIẾT NGƯỜI DÙNG */}
      {viewUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-all">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header Modal */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900">
                Hồ sơ người dùng
              </h3>
              <button
                onClick={() => setViewUser(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <MdClose size={24} />
              </button>
            </div>

            {/* Body Modal */}
            <div className="p-6 md:p-8 space-y-8">
              {/* Profile Top */}
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <img
                  src={
                    viewUser.avatar ||
                    `https://ui-avatars.com/api/?name=${viewUser.fullName || viewUser.username}&background=random&size=128`
                  }
                  alt="Avatar"
                  className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
                />
                <div className="text-center md:text-left flex-1">
                  <h2 className="text-2xl font-black text-slate-900 mb-1">
                    {viewUser.fullName || "Chưa cập nhật tên"}
                  </h2>
                  <p className="text-slate-500 font-medium mb-3">
                    @{viewUser.username || `user_${viewUser.userId}`}
                  </p>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                    {getRoleBadge(viewUser.role)}
                    {renderStatusBadge(viewUser.status)}
                  </div>
                </div>
              </div>

              {/* Thông tin chi tiết */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div className="flex items-start gap-3">
                  <MdEmail className="text-slate-400 mt-0.5" size={20} />
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase">
                      Email
                    </p>
                    <p className="text-sm font-medium text-slate-900 break-all">
                      {viewUser.email || "—"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MdPhone className="text-slate-400 mt-0.5" size={20} />
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase">
                      Số điện thoại
                    </p>
                    <p className="text-sm font-medium text-slate-900">
                      {viewUser.phone || "—"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 md:col-span-2">
                  <MdLocationOn className="text-slate-400 mt-0.5" size={20} />
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase">
                      Địa chỉ
                    </p>
                    <p className="text-sm font-medium text-slate-900">
                      {viewUser.address || "Người dùng chưa cập nhật địa chỉ"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 mt-2 pt-4 border-t border-slate-200">
                  <MdCalendarToday
                    className="text-slate-400 mt-0.5"
                    size={20}
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase">
                      Ngày tham gia
                    </p>
                    <p className="text-sm font-medium text-slate-900">
                      {viewUser.createdAt || "—"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 mt-2 pt-4 border-t border-slate-200">
                  <div className="mt-0.5 text-slate-400 flex">
                    <span className="font-bold text-sm bg-slate-200 rounded text-slate-600 px-1">
                      ID
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase">
                      Hệ thống ID
                    </p>
                    <p className="text-sm font-medium text-slate-900">
                      #{viewUser.userId}
                    </p>
                  </div>
                </div>

                {/* Hiển thị Google ID nếu có */}
                {viewUser.googleId && (
                  <div className="flex items-start gap-3 md:col-span-2 mt-2 bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                    <div className="text-blue-500 mt-0.5">
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth="0"
                        viewBox="0 0 488 512"
                        height="20px"
                        width="20px"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 252S110.8 0 248 0c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-blue-600 uppercase">
                        Liên kết Google
                      </p>
                      <p className="text-sm font-medium text-slate-900 break-all">
                        {viewUser.googleId}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Modal */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
              <button
                onClick={() => handleToggleStatus(viewUser.userId)}
                className={`px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2 ${
                  (viewUser.status || "active").toLowerCase() === "active"
                    ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                    : "bg-green-50 text-green-600 hover:bg-green-100 border border-green-200"
                }`}
              >
                {(viewUser.status || "active").toLowerCase() === "active" ? (
                  <>
                    <MdBlock size={18} /> Khóa tài khoản
                  </>
                ) : (
                  <>
                    <MdCheckCircle size={18} /> Mở khóa tài khoản
                  </>
                )}
              </button>
              <button
                onClick={() => setViewUser(null)}
                className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl font-bold transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
