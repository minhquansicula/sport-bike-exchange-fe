import React, { useEffect } from "react";
import { getPartyInfo } from "../../../utils/getPartyInfo";
import { useReservationInspectionReport } from "../hooks/useReservationInspectionReport";
import {
  MdClose,
  MdCheckCircle,
  MdRemoveCircle,
  MdHelp,
  MdAssignment,
  MdError,
} from "react-icons/md";

const STATUS_LABEL = {
  PASS: { label: "PASS", cls: "bg-emerald-100 text-emerald-700" },
  FAIL: { label: "FAIL", cls: "bg-red-100 text-red-700" },
  NOT_CHECKED: { label: "Chưa KT", cls: "bg-gray-100 text-gray-500" },
};

const StatusIcon = ({ status }) => {
  if (status === "PASS")
    return <MdCheckCircle size={16} className="text-emerald-500" />;
  if (status === "FAIL")
    return <MdRemoveCircle size={16} className="text-red-500" />;
  return <MdHelp size={16} className="text-gray-400" />;
};

/**
 * ReportViewerModal
 * - Lazy-fetches inspection report when opened
 * - Shows loading, error, empty states
 * - Displays full checklist, result, reason, note
 */
const ReportViewerModal = ({ reservationId, isOpen, onClose, taskData }) => {
  const {
    report,
    loading,
    error,
    setReport,
  } = useReservationInspectionReport(reservationId, {
    enabled: isOpen,
  });

  useEffect(() => {
    if (!isOpen) {
      setReport(null);
    }
  }, [isOpen, setReport]);

  if (!isOpen) return null;

  // Parse checklist
  let checklist = [];
  try {
    if (report?.checklistItems) {
      checklist =
        typeof report.checklistItems === "string"
          ? JSON.parse(report.checklistItems)
          : report.checklistItems;
    }
  } catch (_) {}

  const isPassed = report?.result === "SUCCESS";
  const passCount = checklist.filter((i) => i.status === "PASS").length;
  const failCount = checklist.filter((i) => i.status === "FAIL").length;
  const totalCount = checklist.length;
  const reportBuyer = getPartyInfo(report, "buyer");
  const reportSeller = getPartyInfo(report, "seller");
  const taskBuyer = getPartyInfo(taskData, "buyer");
  const taskSeller = getPartyInfo(taskData, "seller");

  const buyer = {
    name: reportBuyer.name || taskBuyer.name,
    phone: reportBuyer.phone || taskBuyer.phone,
  };
  const seller = {
    name: reportSeller.name || taskSeller.name,
    phone: reportSeller.phone || taskSeller.phone,
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/80">
          <div className="flex items-center gap-2">
            <MdAssignment size={22} className="text-emerald-600" />
            <h2 className="text-lg font-bold text-gray-900">
              Báo cáo kiểm định
            </h2>
            <span className="text-xs text-gray-400">#{reservationId}</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <MdClose size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-emerald-200 border-t-emerald-600 mb-4" />
              <p className="text-sm text-gray-500">Đang tải báo cáo...</p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <MdError size={48} className="text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm">
                {error.response?.data?.message || "Không thể tải báo cáo kiểm định."}
              </p>
            </div>
          )}

          {/* Report content */}
          {!loading && !error && report && (
            <>
              {/* Result badge */}
              <div
                className={`flex items-center gap-3 p-4 rounded-xl border ${
                  isPassed
                    ? "bg-emerald-50 border-emerald-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                {isPassed ? (
                  <MdCheckCircle size={28} className="text-emerald-500" />
                ) : (
                  <MdRemoveCircle size={28} className="text-red-500" />
                )}
                <div>
                  <p className="font-bold text-gray-900">
                    Kết quả:{" "}
                    <span
                      className={
                        isPassed ? "text-emerald-600" : "text-red-600"
                      }
                    >
                      {isPassed ? "ĐẠT (PASSED)" : "KHÔNG ĐẠT (FAILED)"}
                    </span>
                  </p>
                  {totalCount > 0 && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {passCount}/{totalCount} hạng mục đạt
                    </p>
                  )}
                </div>
              </div>

              {/* Summary badges */}
              {totalCount > 0 && (
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                    ✓ {passCount} PASS
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                    ✗ {failCount} FAIL
                  </span>
                </div>
              )}

              {/* Checklist table */}
              {checklist.length > 0 && (
                <div className="rounded-xl border border-gray-100 overflow-hidden divide-y divide-gray-50 bg-white">
                  <div className="px-4 py-2.5 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Chi tiết hạng mục kiểm tra
                  </div>
                  {checklist.map((item, idx) => {
                    const cfg =
                      STATUS_LABEL[item.status] || STATUS_LABEL.NOT_CHECKED;
                    return (
                      <div
                        key={idx}
                        className="flex items-start gap-3 px-4 py-3 text-sm"
                      >
                        <StatusIcon status={item.status} />
                        <span className="flex-1 text-gray-700 font-medium leading-snug">
                          {item.name}
                          {item.note && (
                            <span className="block text-xs text-gray-400 font-normal mt-0.5">
                              {item.note}
                            </span>
                          )}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-bold shrink-0 ${cfg.cls}`}
                        >
                          {cfg.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Buyer/Seller info */}
              {(buyer.name || seller.name || buyer.phone || seller.phone) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-white rounded-xl border border-gray-100 p-4">
                  <div>
                    <span className="text-gray-500 font-medium text-xs block mb-0.5">
                      Người mua:
                    </span>
                    <span className="font-semibold text-gray-800 block">
                      {buyer.name || "Đang cập nhật"}
                    </span>
                    <span className="text-xs text-gray-500">
                      SĐT: {buyer.phone || "Chưa có"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium text-xs block mb-0.5">
                      Người bán:
                    </span>
                    <span className="font-semibold text-gray-800 block">
                      {seller.name || "Đang cập nhật"}
                    </span>
                    <span className="text-xs text-gray-500">
                      SĐT: {seller.phone || "Chưa có"}
                    </span>
                  </div>
                </div>
              )}

              {/* Reason */}
              {report.reason && (
                <div className="text-sm text-gray-600 bg-white rounded-xl border border-gray-100 px-4 py-3">
                  <span className="font-semibold text-gray-700">Lý do: </span>
                  {report.reason}
                </div>
              )}

              {/* Note */}
              {report.note && (
                <div className="text-sm text-gray-600 bg-white rounded-xl border border-gray-100 px-4 py-3">
                  <span className="font-semibold text-gray-700">
                    Ghi chú:{" "}
                  </span>
                  {report.note}
                </div>
              )}

              {/* Timestamp */}
              {report.createAt && (
                <div className="text-xs text-gray-400 text-right pt-2">
                  Kiểm định lúc:{" "}
                  {new Date(report.createAt).toLocaleString("vi-VN")}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/80">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm rounded-xl transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportViewerModal;
