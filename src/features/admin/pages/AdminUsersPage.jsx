import React, { useState } from "react";
import {
  MdSearch,
  MdFilterList,
  MdMoreVert,
  MdBlock,
  MdCheckCircle,
  MdPerson,
  MdVerified,
  MdEdit,
  MdVisibility,
} from "react-icons/md";

// Mock data users
const MOCK_ADMIN_USERS = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "nguyenvana@gmail.com",
    phone: "0914303252",
    role: "member",
    status: "active",
    avatar: "https://i.pravatar.cc/150?u=1",
    joinDate: "2024-01-15",
    totalTransactions: 5,
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "tranthib@gmail.com",
    phone: "0987654321",
    role: "member",
    status: "active",
    avatar: "https://i.pravatar.cc/150?u=2",
    joinDate: "2024-02-20",
    totalTransactions: 12,
  },
  {
    id: 3,
    name: "Lê Inspector",
    email: "inspector@oldbike.vn",
    phone: "0912345678",
    role: "inspector",
    status: "active",
    avatar: "https://i.pravatar.cc/150?u=3",
    joinDate: "2023-11-10",
    totalTransactions: 48,
  },
  {
    id: 4,
    name: "Hoàng Văn C",
    email: "hoangvanc@gmail.com",
    phone: "0909090909",
    role: "member",
    status: "banned",
    avatar: "https://i.pravatar.cc/150?u=4",
    joinDate: "2024-03-05",
    totalTransactions: 2,
    banReason: "Boom hàng 2 lần",
  },
  {
    id: 5,
    name: "Phạm Inspector 2",
    email: "inspector2@oldbike.vn",
    phone: "0911111111",
    role: "inspector",
    status: "active",
    avatar: "https://i.pravatar.cc/150?u=5",
    joinDate: "2024-01-01",
    totalTransactions: 35,
  },
];

const AdminUsersPage = () => {
  const [users] = useState(MOCK_ADMIN_USERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Lọc users
  const filteredUsers = users.filter((user) => {
    const matchSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = filterRole === "all" || user.role === filterRole;
    const matchStatus = filterStatus === "all" || user.status === filterStatus;
    return matchSearch && matchRole && matchStatus;
  });

  const getRoleBadge = (role) => {
    switch (role) {
      case "inspector":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
            <MdVerified size={12} /> Inspector
          </span>
        );
      case "admin":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
            Admin
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            <MdPerson size={12} /> Member
          </span>
        );
    }
  };

  const getStatusBadge = (status) => {
    if (status === "active") {
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Users</h1>
          <p className="text-gray-500 text-sm mt-1">
            Quản lý Member và Inspector, khóa/mở khóa tài khoản
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            Tổng: <strong>{filteredUsers.length}</strong> người dùng
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo tên, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-50 text-sm"
            />
          </div>

          {/* Filter Role */}
          <div className="flex items-center gap-2">
            <MdFilterList className="text-gray-400" />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-300 text-sm bg-white"
            >
              <option value="all">Tất cả Role</option>
              <option value="member">Member</option>
              <option value="inspector">Inspector</option>
            </select>
          </div>

          {/* Filter Status */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-300 text-sm bg-white"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="banned">Đã khóa</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Người dùng
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Liên hệ
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Giao dịch
                </th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">
                          Tham gia: {user.joinDate}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{user.email}</p>
                    <p className="text-xs text-gray-500">{user.phone}</p>
                  </td>
                  <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                  <td className="px-6 py-4">
                    {getStatusBadge(user.status)}
                    {user.banReason && (
                      <p className="text-xs text-red-500 mt-1">
                        {user.banReason}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">
                      {user.totalTransactions}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Xem chi tiết"
                      >
                        <MdVisibility size={18} />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
                        title="Chỉnh sửa"
                      >
                        <MdEdit size={18} />
                      </button>
                      {user.status === "active" ? (
                        <button
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Khóa tài khoản"
                        >
                          <MdBlock size={18} />
                        </button>
                      ) : (
                        <button
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                          title="Mở khóa"
                        >
                          <MdCheckCircle size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <MdPerson className="mx-auto text-gray-300" size={48} />
            <p className="mt-4 text-gray-500">Không tìm thấy người dùng nào</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
