import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  MdAdd,
  MdSearch,
  MdFilterList,
  MdEdit,
  MdDelete,
  MdVisibility,
  MdEvent,
  MdLocationOn,
  MdAccessTime,
  MdPeople,
} from "react-icons/md";

// Mock data events
const MOCK_EVENTS = [
  {
    id: 1,
    name: "Ngày hội Xe Đạp Cũ Hà Nội",
    description: "Sự kiện giao lưu và mua bán xe đạp cũ tại Hà Nội",
    location: "Công viên Thống Nhất, Hà Nội",
    startDate: "2026-02-15",
    endDate: "2026-02-16",
    startTime: "08:00",
    endTime: "17:00",
    status: "upcoming",
    maxParticipants: 200,
    currentParticipants: 45,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
  },
  {
    id: 2,
    name: "Workshop Bảo Dưỡng Xe",
    description: "Hướng dẫn bảo dưỡng xe đạp cơ bản cho người mới",
    location: "OldBike Center, TP.HCM",
    startDate: "2026-02-20",
    endDate: "2026-02-20",
    startTime: "09:00",
    endTime: "12:00",
    status: "upcoming",
    maxParticipants: 30,
    currentParticipants: 28,
    image: "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=400",
  },
  {
    id: 3,
    name: "Đua Xe Đạp Địa Hình",
    description: "Giải đua xe đạp địa hình dành cho amatuer",
    location: "Núi Bà Đen, Tây Ninh",
    startDate: "2026-01-20",
    endDate: "2026-01-20",
    startTime: "06:00",
    endTime: "15:00",
    status: "completed",
    maxParticipants: 100,
    currentParticipants: 100,
    image: "https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?w=400",
  },
  {
    id: 4,
    name: "Triển lãm Xe Đạp Vintage",
    description: "Trưng bày các dòng xe đạp cổ điển từ thập niên 80-90",
    location: "Bảo tàng TP.HCM",
    startDate: "2026-03-01",
    endDate: "2026-03-05",
    startTime: "08:00",
    endTime: "18:00",
    status: "draft",
    maxParticipants: 500,
    currentParticipants: 0,
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400",
  },
];

const AdminEventsPage = () => {
  const [events] = useState(MOCK_EVENTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Lọc events
  const filteredEvents = events.filter((event) => {
    const matchSearch = event.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchStatus =
      filterStatus === "all" || event.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "upcoming":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            Sắp diễn ra
          </span>
        );
      case "ongoing":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            Đang diễn ra
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            Đã kết thúc
          </span>
        );
      case "draft":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
            Bản nháp
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Events</h1>
          <p className="text-gray-500 text-sm mt-1">
            Tạo và quản lý các sự kiện của OldBike
          </p>
        </div>
        <Link
          to="/admin/events/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-orange-200"
        >
          <MdAdd size={20} />
          Tạo Event mới
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo tên sự kiện..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-50 text-sm"
            />
          </div>

          {/* Filter Status */}
          <div className="flex items-center gap-2">
            <MdFilterList className="text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-300 text-sm bg-white"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="draft">Bản nháp</option>
              <option value="upcoming">Sắp diễn ra</option>
              <option value="ongoing">Đang diễn ra</option>
              <option value="completed">Đã kết thúc</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-orange-200 transition-all duration-300 group"
          >
            {/* Event Image */}
            <div className="relative h-40 overflow-hidden">
              <img
                src={event.image}
                alt={event.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3">
                {getStatusBadge(event.status)}
              </div>
            </div>

            {/* Event Info */}
            <div className="p-5">
              <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1">
                {event.name}
              </h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                {event.description}
              </p>

              {/* Details */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <MdLocationOn className="text-gray-400" size={16} />
                  <span className="truncate">{event.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MdEvent className="text-gray-400" size={16} />
                  <span>
                    {event.startDate === event.endDate
                      ? event.startDate
                      : `${event.startDate} - ${event.endDate}`}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MdAccessTime className="text-gray-400" size={16} />
                  <span>
                    {event.startTime} - {event.endTime}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MdPeople className="text-gray-400" size={16} />
                  <span>
                    {event.currentParticipants}/{event.maxParticipants} người
                    tham gia
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 rounded-full transition-all"
                    style={{
                      width: `${(event.currentParticipants / event.maxParticipants) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                <button
                  className="flex-1 flex items-center justify-center gap-1 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  title="Xem chi tiết"
                >
                  <MdVisibility size={16} />
                  Xem
                </button>
                <Link
                  to={`/admin/events/${event.id}/edit`}
                  className="flex-1 flex items-center justify-center gap-1 py-2 text-sm font-medium text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
                  title="Chỉnh sửa"
                >
                  <MdEdit size={16} />
                  Sửa
                </Link>
                <button
                  className="flex-1 flex items-center justify-center gap-1 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  title="Xóa"
                >
                  <MdDelete size={16} />
                  Xóa
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredEvents.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <MdEvent className="mx-auto text-gray-300" size={48} />
          <p className="mt-4 text-gray-500">Không tìm thấy sự kiện nào</p>
          <Link
            to="/admin/events/create"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-all"
          >
            <MdAdd size={18} />
            Tạo Event đầu tiên
          </Link>
        </div>
      )}
    </div>
  );
};

export default AdminEventsPage;
