import React, { useState } from "react";
import {
  MdSearch,
  MdFilterList,
  MdVisibility,
  MdCheckCircle,
  MdCancel,
  MdAccessTime,
  MdAttachMoney,
  MdPerson,
  MdPedalBike,
} from "react-icons/md";
import formatCurrency from "../../../utils/formatCurrency";

// Mock transactions data
const MOCK_TRANSACTIONS = [
  {
    id: "TXN001",
    buyer: {
      name: "Nguyễn Văn A",
      avatar: "https://i.pravatar.cc/150?u=1",
    },
    seller: {
      name: "Trần Thị B",
      avatar: "https://i.pravatar.cc/150?u=2",
    },
    bike: {
      name: "Trek Marlin 7 Gen 2",
      price: 12500000,
      image: "https://fxbike.vn/wp-content/uploads/2022/02/Trek-Marlin-7-2022-1-600x450.jpeg",
    },
    status: "pending",
    type: "reservation",
    deposit: 2000000,
    createdAt: "2026-01-28 10:30",
    scheduledDate: "2026-02-01 14:00",
    location: "Trạm OldBike Đống Đa",
  },
  {
    id: "TXN002",
    buyer: {
      name: "Lê Văn C",
      avatar: "https://i.pravatar.cc/150?u=3",
    },
    seller: {
      name: "Hoàng Văn D",
      avatar: "https://i.pravatar.cc/150?u=4",
    },
    bike: {
      name: "Giant Escape 2 City Disc",
      price: 8200000,
      image: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=400",
    },
    status: "completed",
    type: "transaction",
    deposit: 1500000,
    createdAt: "2026-01-25 09:15",
    completedAt: "2026-01-27 16:00",
    location: "Trạm OldBike Q1 HCM",
  },
  {
    id: "TXN003",
    buyer: {
      name: "Phạm Thị E",
      avatar: "https://i.pravatar.cc/150?u=5",
    },
    seller: {
      name: "Nguyễn Văn F",
      avatar: "https://i.pravatar.cc/150?u=6",
    },
    bike: {
      name: "Specialized Allez E5 Sport",
      price: 21000000,
      image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400",
    },
    status: "cancelled",
    type: "reservation",
    deposit: 3000000,
    createdAt: "2026-01-20 14:00",
    cancelledAt: "2026-01-22 10:00",
    cancelReason: "Người mua không đến điểm hẹn",
    location: "Trạm OldBike Đà Nẵng",
  },
  {
    id: "TXN004",
    buyer: {
      name: "Võ Văn G",
      avatar: "https://i.pravatar.cc/150?u=7",
    },
    seller: {
      name: "Đặng Thị H",
      avatar: "https://i.pravatar.cc/150?u=8",
    },
    bike: {
      name: "Cannondale Trail 5",
      price: 14500000,
      image: "https://images.unsplash.com/photo-1511994298241-608e28f14fde?w=400",
    },
    status: "processing",
    type: "request",
    deposit: 0,
    createdAt: "2026-01-28 08:00",
    location: "Chờ xác nhận địa điểm",
  },
];

const AdminTransactionsPage = () => {
  const [transactions] = useState(MOCK_TRANSACTIONS);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  // Lọc transactions
  const filteredTransactions = transactions.filter((txn) => {
    const matchSearch =
      txn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.bike.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "all" || txn.status === filterStatus;
    const matchType = filterType === "all" || txn.type === filterType;
    return matchSearch && matchStatus && matchType;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
            <MdAccessTime size={12} /> Chờ xử lý
          </span>
        );
      case "processing":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            <MdAccessTime size={12} /> Đang xử lý
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <MdCheckCircle size={12} /> Hoàn thành
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            <MdCancel size={12} /> Đã hủy
          </span>
        );
      default:
        return null;
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case "transaction":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700">
            Transaction
          </span>
        );
      case "reservation":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-700">
            Reservation
          </span>
        );
      case "request":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
            Request
          </span>
        );
      default:
        return null;
    }
  };

  // Thống kê nhanh
  const stats = {
    total: transactions.length,
    pending: transactions.filter((t) => t.status === "pending").length,
    processing: transactions.filter((t) => t.status === "processing").length,
    completed: transactions.filter((t) => t.status === "completed").length,
    cancelled: transactions.filter((t) => t.status === "cancelled").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Quản lý Transactions
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Theo dõi tất cả Transaction, Reservation và Request
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-500">Tổng cộng</p>
        </div>
        <div className="bg-yellow-50 rounded-xl border border-yellow-100 p-4 text-center">
          <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
          <p className="text-xs text-yellow-600">Chờ xử lý</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-100 p-4 text-center">
          <p className="text-2xl font-bold text-blue-700">{stats.processing}</p>
          <p className="text-xs text-blue-600">Đang xử lý</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-100 p-4 text-center">
          <p className="text-2xl font-bold text-green-700">{stats.completed}</p>
          <p className="text-xs text-green-600">Hoàn thành</p>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-100 p-4 text-center">
          <p className="text-2xl font-bold text-red-700">{stats.cancelled}</p>
          <p className="text-xs text-red-600">Đã hủy</p>
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
              placeholder="Tìm theo mã, tên người mua/bán, tên xe..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-50 text-sm"
            />
          </div>

          {/* Filter Type */}
          <div className="flex items-center gap-2">
            <MdFilterList className="text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-300 text-sm bg-white"
            >
              <option value="all">Tất cả loại</option>
              <option value="transaction">Transaction</option>
              <option value="reservation">Reservation</option>
              <option value="request">Request</option>
            </select>
          </div>

          {/* Filter Status */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-300 text-sm bg-white"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xử lý</option>
            <option value="processing">Đang xử lý</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Mã / Loại
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Người mua
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Người bán
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Giá / Cọc
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredTransactions.map((txn) => (
                <tr
                  key={txn.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="font-mono font-medium text-gray-900">
                      {txn.id}
                    </p>
                    <div className="mt-1">{getTypeBadge(txn.type)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={txn.bike.image}
                        alt={txn.bike.name}
                        className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                      />
                      <p className="text-sm font-medium text-gray-900 line-clamp-2 max-w-[150px]">
                        {txn.bike.name}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={txn.buyer.avatar}
                        alt={txn.buyer.name}
                        className="w-8 h-8 rounded-full border border-gray-200"
                      />
                      <span className="text-sm text-gray-900">
                        {txn.buyer.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={txn.seller.avatar}
                        alt={txn.seller.name}
                        className="w-8 h-8 rounded-full border border-gray-200"
                      />
                      <span className="text-sm text-gray-900">
                        {txn.seller.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">
                      {formatCurrency(txn.bike.price)}
                    </p>
                    {txn.deposit > 0 && (
                      <p className="text-xs text-orange-600">
                        Cọc: {formatCurrency(txn.deposit)}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(txn.status)}
                    <p className="text-xs text-gray-400 mt-1">{txn.location}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Xem chi tiết"
                      >
                        <MdVisibility size={18} />
                      </button>
                      {txn.status === "pending" && (
                        <>
                          <button
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                            title="Xác nhận"
                          >
                            <MdCheckCircle size={18} />
                          </button>
                          <button
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Từ chối"
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
        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <MdAttachMoney className="mx-auto text-gray-300" size={48} />
            <p className="mt-4 text-gray-500">Không tìm thấy giao dịch nào</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTransactionsPage;
