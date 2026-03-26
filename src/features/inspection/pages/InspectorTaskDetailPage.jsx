import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { inspectorService } from "../../../services/inspectorService";
import { getPartyInfo } from "../../../utils/getPartyInfo";
import { toast } from "react-hot-toast";
import { useInspectorTaskDetail } from "../hooks/useInspectorTaskDetail";
import {
  MdArrowBack,
  MdLocationOn,
  MdAccessTime,
  MdPerson,
  MdPhone,
  MdPedalBike,
  MdAttachMoney,
  MdCheckCircle,
  MdWarning,
} from "react-icons/md";
import formatCurrency from "../../../utils/formatCurrency";
import InspectionReportPanel from "../../user/components/InspectionReportPanel";

const InspectorTaskDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { task, loading, error, refetch } = useInspectorTaskDetail(id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (error) {
      console.error("Lỗi tải nhiệm vụ:", error);
      toast.error("Không thể tải thông tin nhiệm vụ");
      navigate("/inspector/tasks");
    }
  }, [error, navigate]);

  const handleNoShow = async (type) => { // type: 'SELLER' or 'BUYER'
    const isSeller = type === 'SELLER';
    const confirmMsg = isSeller
      ? "Xác nhận báo cáo: NGƯỜI BÁN KHÔNG ĐẾN? Giao dịch sẽ bị hủy và xe sẽ bị khóa."
      : "Xác nhận báo cáo: NGƯỜI MUA KHÔNG ĐẾN? Giao dịch sẽ bị hủy và xe sẽ trở lại khả dụng.";

    if (!window.confirm(confirmMsg)) return;

    setIsSubmitting(true);
    try {
      const payload = {
        result: isSeller ? "SELLER_NO_SHOW" : "BUYER_NO_SHOW",
        reason: isSeller ? "Người bán không đến" : "Người mua không đến",
        note: "",
        checklistItems: [],
        buyerCheckin: !isSeller,
        sellerCheckin: isSeller,
      };
      await inspectorService.createInspectionReport(id, payload);
      toast.success(isSeller ? "Đã báo cáo người bán không đến thành công!" : "Đã báo cáo người mua không đến thành công!");
      // Reload task info
      await refetch();
    } catch (error) {
      console.error("Lỗi khi gửi báo cáo vắng mặt:", error);
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi báo cáo vắng mặt.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-600"></div>
      </div>
    );
  }

  if (!task) return null;

  const buyer = getPartyInfo(task, "buyer");
  const seller = getPartyInfo(task, "seller");
  const parsedScheduledTime = task?.scheduledTime
    ? new Date(task.scheduledTime)
    : null;
  const scheduledTimeText =
    parsedScheduledTime && !Number.isNaN(parsedScheduledTime.getTime())
      ? parsedScheduledTime.toLocaleString("vi-VN")
      : task?.scheduledTime || "Đang cập nhật";

  return (
    <div className="max-w-4xl mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-white rounded-full shadow-sm hover:bg-emerald-50 transition-colors"
        >
          <MdArrowBack size={24} className="text-gray-700" />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
            Chi tiết nhiệm vụ
          </h1>
          <div className="flex items-center gap-3">
            <p className="text-gray-500 text-sm">Mã nhiệm vụ: #{task.id}</p>
            {(task.status?.toLowerCase() === "scheduled" || task.status?.toLowerCase() === "pending" || task.status?.toLowerCase() === "deposited") ? (
              <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-[11px] font-bold rounded-full uppercase tracking-wider">
                Chờ kiểm định
              </span>
            ) : (task.status?.toLowerCase() === "completed") ? (
              <span className="px-2.5 py-1 bg-green-100 text-green-700 text-[11px] font-bold rounded-full uppercase tracking-wider">
                Hoàn thành
              </span>
            ) : (
              <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-[11px] font-bold rounded-full uppercase tracking-wider">
                {task.status}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Task Info Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={task.bikeImage || "https://via.placeholder.com/300"}
            alt={task.bikeName}
            className="w-full md:w-48 h-48 rounded-xl object-cover border border-gray-200"
          />
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {task.bikeName || task.bicycleName || "Xe đạp VeloX"}
            </h2>
            <p className="text-emerald-600 font-bold text-2xl mb-4">
              {formatCurrency(task.price || task.amount || 0)}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                  <MdPerson size={18} />
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Người mua</p>
                  <p className="font-medium">{buyer.name || "Đang cập nhật"}</p>
                  {buyer.phone ? (
                    <a
                      href={`tel:${buyer.phone}`}
                      className="text-xs text-blue-600 flex items-center gap-1 mt-1"
                    >
                      <MdPhone size={14} /> {buyer.phone}
                    </a>
                  ) : (
                    <p className="text-xs text-gray-400 mt-1">Chưa có số điện thoại</p>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
                  <MdPerson size={18} />
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Người bán</p>
                  <p className="font-medium">{seller.name || "Đang cập nhật"}</p>
                  {seller.phone ? (
                    <a
                      href={`tel:${seller.phone}`}
                      className="text-xs text-blue-600 flex items-center gap-1 mt-1"
                    >
                      <MdPhone size={14} /> {seller.phone}
                    </a>
                  ) : (
                    <p className="text-xs text-gray-400 mt-1">Chưa có số điện thoại</p>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-600 shrink-0">
                  <MdLocationOn size={18} />
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Địa điểm</p>
                  <p className="font-medium">{task.location}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                  <MdAccessTime size={18} />
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Thời gian</p>
                  <p className="font-medium">{scheduledTimeText}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {["Completed", "completed", "Waiting_Payment", "Inspection_Failed", "Cancelled", "cancelled"].includes(task.status) && (
        <div className="mt-8 rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
          <div className="p-4 bg-gray-50 border-b border-gray-100 font-bold text-gray-700 flex items-center gap-2">
            <MdCheckCircle className="text-emerald-500" /> Kết quả kiểm định đã lưu
          </div>
          <InspectionReportPanel reservationId={task.id} />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 flex-wrap">
        {["scheduled", "pending", "deposited"].includes(task.status?.toLowerCase()) ? (
          <>
            <Link
              to={`/inspector/create-report?taskId=${task.id}`}
              className="flex-1 min-w-[200px] bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-bold text-center transition-colors shadow-lg"
            >
              Bắt đầu kiểm định
            </Link>
            <button
              onClick={() => handleNoShow('BUYER')}
              disabled={isSubmitting}
              className="flex-1 min-w-[200px] bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 py-4 rounded-xl font-bold text-center transition-colors"
            >
              {isSubmitting ? "Đang xử lý..." : "Người mua không đến"}
            </button>
            <button
              onClick={() => handleNoShow('SELLER')}
              disabled={isSubmitting}
              className="flex-1 min-w-[200px] bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 py-4 rounded-xl font-bold text-center transition-colors"
            >
              {isSubmitting ? "Đang xử lý..." : "Người bán không đến"}
            </button>
          </>
        ) : ["Completed", "completed", "Waiting_Payment", "Inspection_Failed", "Cancelled"].includes(task.status) ? (
          <div className="flex-1 min-w-[200px] bg-gray-100 text-gray-400 py-4 rounded-xl font-bold text-center border border-gray-200">
            Nhiệm vụ ở trạng thái: {task.status}
          </div>
        ) : null}
        <button
          onClick={() => navigate(-1)}
          className="px-6 min-w-[120px] py-4 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Quay lại
        </button>
      </div>
    </div>
  );
};

export default InspectorTaskDetailPage;


