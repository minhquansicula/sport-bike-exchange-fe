import React, { useState } from "react";
import {
  MdSearch,
  MdFilterList,
  MdAccessTime,
  MdLocationOn,
  MdPerson,
  MdCheckCircle,
  MdCancel,
  MdRemoveRedEye,
  MdWarning,
  MdAssignment,
} from "react-icons/md";

// --- MOCK DATA: LỊCH HẸN GIAO DỊCH ---
const MOCK_MEETUPS = [
  {
    id: "EVT-2024-001",
    transactionId: "TXN-9981",
    bikeName: "Trek Marlin 7 Gen 2",
    meetupTime: "2026-02-03 09:00", // Thời gian hẹn
    location: "Trạm OldBike Đống Đa - HN",
    inspector: {
      name: "Lê Thanh Tra",
      avatar: "https://i.pravatar.cc/150?u=insp1",
    },
    buyer: { name: "Nguyễn Văn A", phone: "098***111" },
    seller: { name: "Trần Văn B", phone: "091***222" },
    status: "completed", // scheduled, in_progress, report_submitted, completed, cancelled

    // Báo cáo từ Inspector (Quan trọng)
    report: {
      submittedAt: "2026-02-03 09:15",
      buyerArrived: true, // Người mua ĐẾN
      sellerArrived: true, // Người bán ĐẾN
      result: "success", // Giao dịch tiếp tục
      note: "Hai bên đã gặp nhau, đang kiểm tra xe.",
      images: [
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
      ],
    },
  },
  {
    id: "EVT-2024-002",
    transactionId: "TXN-7722",
    bikeName: "Giant Escape 2",
    meetupTime: "2026-02-03 14:00",
    location: "Trạm OldBike Q1 - HCM",
    inspector: {
      name: "Phạm Kiểm Định",
      avatar: "https://i.pravatar.cc/150?u=insp2",
    },
    buyer: { name: "Lê Thị C", phone: "090***333" },
    seller: { name: "Hoàng D", phone: "093***444" },
    status: "report_submitted", // Inspector đã báo cáo, chờ Admin xử lý

    // Trường hợp BOM HÀNG
    report: {
      submittedAt: "2026-02-03 14:30",
      buyerArrived: false, // Người mua KHÔNG ĐẾN
      sellerArrived: true, // Người bán ĐẾN
      result: "failed", // Giao dịch thất bại
      note: "Đã đợi 30p, gọi điện người mua không nghe máy. Người bán yêu cầu bồi thường cọc.",
      images: [
        "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=400",
      ],
    },
  },
  {
    id: "EVT-2024-003",
    transactionId: "TXN-5511",
    bikeName: "Honda Cub Custom (Xe cổ)",
    meetupTime: "2026-02-04 10:00", // Ngày mai
    location: "Trạm OldBike Đà Nẵng",
    inspector: {
      name: "Trần Giám Sát",
      avatar: "https://i.pravatar.cc/150?u=insp3",
    },
    buyer: { name: "Phan E", phone: "099***555" },
    seller: { name: "Võ F", phone: "088***666" },
    status: "scheduled", // Chưa diễn ra
    report: null,
  },
];

const AdminEventsPage = () => {
  const [meetups, setMeetups] = useState(MOCK_MEETUPS);
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState(null); // State để mở Modal chi tiết

  // Logic lọc
  const filteredMeetups = meetups.filter((m) =>
    filterStatus === "all" ? true : m.status === filterStatus,
  );

  // Helper: Badge trạng thái chung
  const getStatusBadge = (status) => {
    switch (status) {
      case "scheduled":
        return (
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">
            Sắp diễn ra
          </span>
        );
      case "report_submitted":
        return (
          <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
            <MdWarning /> Có báo cáo
          </span>
        );
      case "completed":
        return (
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">
            Hoàn tất
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-bold">
            Khác
          </span>
        );
    }
  };

  // Helper: Hiển thị nhanh trạng thái điểm danh (Icon nhỏ ở bảng)
  const renderAttendanceMini = (report) => {
    if (!report) return <span className="text-gray-400 text-xs">--</span>;
    return (
      <div className="flex gap-2">
        <div
          className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded border ${report.sellerArrived ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}
        >
          Bán: {report.sellerArrived ? <MdCheckCircle /> : <MdCancel />}
        </div>
        <div
          className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded border ${report.buyerArrived ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}
        >
          Mua: {report.buyerArrived ? <MdCheckCircle /> : <MdCancel />}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Điều phối Giao dịch
          </h1>
          <p className="text-gray-500 text-sm">
            Giám sát các cuộc hẹn giao dịch trực tiếp & Báo cáo điểm danh
          </p>
        </div>
        <div className="flex gap-2">
          {/* Bộ lọc đơn giản */}
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Tất cả lịch hẹn</option>
            <option value="scheduled">Sắp diễn ra</option>
            <option value="report_submitted">Mới có báo cáo (Cần xử lý)</option>
            <option value="completed">Đã xong</option>
          </select>
        </div>
      </div>

      {/* --- TABLE DANH SÁCH --- */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">
                  Thời gian / Địa điểm
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">
                  Giao dịch
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">
                  Inspector
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">
                  Điểm danh (Seller/Buyer)
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredMeetups.map((evt) => (
                <tr key={evt.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800 flex items-center gap-1">
                        <MdAccessTime className="text-orange-500" />{" "}
                        {evt.meetupTime.split(" ")[1]}
                      </span>
                      <span className="text-xs text-gray-500">
                        {evt.meetupTime.split(" ")[0]}
                      </span>
                      <div className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                        <MdLocationOn className="text-gray-400" />{" "}
                        {evt.location}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {evt.bikeName}
                    </div>
                    <div className="text-xs text-blue-600 font-mono bg-blue-50 inline-block px-1 rounded mt-1">
                      {evt.transactionId}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={evt.inspector.avatar}
                        alt="Insp"
                        className="w-6 h-6 rounded-full border border-gray-200"
                      />
                      <span className="text-sm text-gray-700">
                        {evt.inspector.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {renderAttendanceMini(evt.report)}
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(evt.status)}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedEvent(evt)}
                      className="text-gray-500 hover:text-orange-600 p-2 rounded-full hover:bg-orange-50 transition-all"
                      title="Xem báo cáo chi tiết"
                    >
                      <MdAssignment size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL CHI TIẾT BÁO CÁO (Quan trọng nhất) --- */}
      {selectedEvent && (
        <ReportDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
};

// Component Modal tách riêng cho gọn
const ReportDetailModal = ({ event, onClose }) => {
  if (!event) return null;
  const { report } = event;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Báo cáo hiện trường
            </h3>
            <p className="text-xs text-gray-500">
              Mã giao dịch: {event.transactionId} • Inspector:{" "}
              {event.inspector.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-white rounded-full hover:bg-gray-200 transition-colors"
          >
            <MdCancel size={22} className="text-gray-500" />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-6 overflow-y-auto">
          {/* 1. Thông tin điểm danh (Attendance) */}
          <div className="mb-6">
            <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">
              Kết quả điểm danh
            </h4>
            {!report ? (
              <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500">
                Inspector chưa gửi báo cáo cho cuộc hẹn này.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {/* Thẻ Seller */}
                <div
                  className={`p-4 rounded-xl border-2 flex items-center justify-between ${report.sellerArrived ? "border-green-100 bg-green-50" : "border-red-100 bg-red-50"}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <MdPerson size={20} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase">
                        Người bán
                      </p>
                      <p className="font-bold text-gray-900">
                        {event.seller.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {report.sellerArrived ? (
                      <span className="flex flex-col items-center text-green-600 font-bold text-sm">
                        <MdCheckCircle size={24} /> Đã đến
                      </span>
                    ) : (
                      <span className="flex flex-col items-center text-red-600 font-bold text-sm">
                        <MdCancel size={24} /> Vắng mặt
                      </span>
                    )}
                  </div>
                </div>

                {/* Thẻ Buyer */}
                <div
                  className={`p-4 rounded-xl border-2 flex items-center justify-between ${report.buyerArrived ? "border-green-100 bg-green-50" : "border-red-100 bg-red-50"}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <MdPerson size={20} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase">
                        Người mua
                      </p>
                      <p className="font-bold text-gray-900">
                        {event.buyer.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {report.buyerArrived ? (
                      <span className="flex flex-col items-center text-green-600 font-bold text-sm">
                        <MdCheckCircle size={24} /> Đã đến
                      </span>
                    ) : (
                      <span className="flex flex-col items-center text-red-600 font-bold text-sm">
                        <MdCancel size={24} /> Vắng mặt
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 2. Ghi chú & Hình ảnh từ Inspector */}
          {report && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Ghi chú hiện trường
                </h4>
                <div className="bg-gray-50 p-4 rounded-xl text-gray-700 text-sm border border-gray-100">
                  "{report.note}"
                  <div className="mt-2 text-xs text-gray-400 flex items-center gap-1">
                    <MdAccessTime /> Gửi lúc: {report.submittedAt}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Hình ảnh xác thực
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {report.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt="Proof"
                      className="rounded-lg object-cover w-full h-24 border border-gray-200 cursor-pointer hover:opacity-90"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer - Actions */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-all"
          >
            Đóng
          </button>
          {/* Nút xử lý chỉ hiện khi có vấn đề (Ví dụ 1 bên vắng mặt) */}
          {report && (!report.buyerArrived || !report.sellerArrived) && (
            <button className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 shadow-lg shadow-red-200 transition-all">
              Xử lý vi phạm (Phạt cọc)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminEventsPage;
