import React, { useState, useEffect } from "react";
import { inspectorService } from "../../../services/inspectorService";
import {
  MdCheckCircle,
  MdRemoveCircle,
  MdHelp,
  MdExpandMore,
  MdExpandLess,
  MdAssignment,
} from "react-icons/md";

const STATUS_LABEL = {
  PASS: { label: "PASS", cls: "bg-emerald-100 text-emerald-700" },
  FAIL: { label: "FAIL", cls: "bg-red-100 text-red-700" },
  NOT_CHECKED: { label: "Chưa KT", cls: "bg-gray-100 text-gray-500" },
};

const StatusIcon = ({ status }) => {
  if (status === "PASS") return <MdCheckCircle size={16} className="text-emerald-500" />;
  if (status === "FAIL") return <MdRemoveCircle size={16} className="text-red-500" />;
  return <MdHelp size={16} className="text-gray-400" />;
};

/**
 * InspectionReportPanel
 * - Hiển thị kết quả báo cáo kiểm định theo reservationId
 * - Tự fetch từ API, collapse/expand được
 */
const InspectionReportPanel = ({ reservationId, currentUserRole }) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!reservationId) return;
    const fetch = async () => {
      try {
        const res = await inspectorService.getReservationInspectionReport(reservationId);
        setReport(res.result || res);
      } catch (e) {
        // 404 / chưa có report → không hiển thị gì
        setError(e.response?.data?.message || "Chưa có báo cáo kiểm định.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [reservationId]);

  if (loading) return null;
  if (error || !report) return null;

  // Parse checklist
  let checklist = [];
  try {
    if (report.checklistItems) {
      checklist = typeof report.checklistItems === "string"
        ? JSON.parse(report.checklistItems)
        : report.checklistItems;
    }
  } catch (_) {}

  const isPassed = report.result === "SUCCESS";
  const passCount = checklist.filter((i) => i.status === "PASS").length;
  const failCount = checklist.filter((i) => i.status === "FAIL").length;
  const totalCount = checklist.length;

  const getBadgeContent = () => {
    if (report.result === "SUCCESS") {
      return { text: "✓ PASSED", cls: "bg-emerald-600" };
    }

    // Kiểm tra chéo với nội dung reason/note để tránh hiển thị sai "Bạn đã không có mặt"
    const combinedReason = `${report.reason || ""} ${report.note || ""}`.toLowerCase();
    const isSellerNoShowText = combinedReason.includes("người bán không") || combinedReason.includes("seller_no_show");
    const isBuyerNoShowText = combinedReason.includes("người mua không") || combinedReason.includes("buyer_no_show");

    if (report.result === "SELLER_NO_SHOW" || isSellerNoShowText) {
      if (currentUserRole === "seller") {
        return { text: "✗ GIAO DỊCH THẤT BẠI: BẠN ĐÃ KHÔNG CÓ MẶT", cls: "bg-red-500" };
      }
      return { text: "✗ GIAO DỊCH THẤT BẠI: NGƯỜI BÁN KHÔNG CÓ MẶT", cls: "bg-red-500" };
    }
    if (report.result === "BUYER_NO_SHOW" || isBuyerNoShowText) {
      if (currentUserRole === "buyer") {
        return { text: "✗ GIAO DỊCH THẤT BẠI: BẠN ĐÃ KHÔNG CÓ MẶT", cls: "bg-red-500" };
      }
      return { text: "✗ GIAO DỊCH THẤT BẠI: NGƯỜI MUA KHÔNG CÓ MẶT", cls: "bg-red-500" };
    }
    return { text: "✗ FAILED", cls: "bg-red-500" };
  };

  const badgeConfig = getBadgeContent();

  return (
    <div
      className={`border-t ${
        isPassed ? "border-emerald-100 bg-emerald-50/40" : "border-red-100 bg-red-50/40"
      }`}
    >
      {/* Header toggle */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-3 hover:bg-black/5 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <MdAssignment
            size={18}
            className={isPassed ? "text-emerald-600" : "text-red-500"}
          />
          <span className="font-semibold text-sm text-gray-800">
            Kết quả kiểm định:&nbsp;
          </span>
          <span className={`px-2.5 py-0.5 rounded-full ${badgeConfig.cls} text-white text-xs font-bold uppercase tracking-wide`}>
            {badgeConfig.text}
          </span>
          {checklist.length > 0 && (
            <span className="text-xs text-gray-500 ml-1">
              ({passCount}/{totalCount} hạng mục đạt)
            </span>
          )}
        </div>
        {expanded ? (
          <MdExpandLess size={20} className="text-gray-400" />
        ) : (
          <MdExpandMore size={20} className="text-gray-400" />
        )}
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-5 pb-4 space-y-3">
          {report.result === "BUYER_NO_SHOW" && currentUserRole === "buyer" && (
            <div className="text-sm text-red-700 bg-red-50 rounded-lg border border-red-100 px-4 py-3 mt-2 font-medium">
              Vì bạn không tới nên tiền cọc đã bị tịch thu.
            </div>
          )}
          {/* Summary */}
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
              ✓ {passCount} PASS
            </span>
            <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold">
              ✗ {failCount} FAIL
            </span>
          </div>

          {/* Checklist table */}
          {checklist.length > 0 && (
            <div className="rounded-xl border border-gray-100 overflow-hidden divide-y divide-gray-50 bg-white">
              {checklist.map((item, idx) => {
                const cfg = STATUS_LABEL[item.status] || STATUS_LABEL.NOT_CHECKED;
                return (
                  <div key={idx} className="flex items-start gap-3 px-4 py-2.5 text-sm">
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

          {/* Nguoi mua, nguoi ban */}
          {(report.buyerName || report.sellerName) && (
            <div className="grid grid-cols-2 gap-4 text-sm mt-3 bg-white rounded-lg border border-gray-100 p-3">
              {report.buyerName && (
                <div>
                  <span className="text-gray-500 font-medium text-xs block mb-0.5">Người mua:</span>
                  <span className="font-semibold text-gray-800">{report.buyerName}</span>
                </div>
              )}
              {report.sellerName && (
                <div>
                  <span className="text-gray-500 font-medium text-xs block mb-0.5">Người bán:</span>
                  <span className="font-semibold text-gray-800">{report.sellerName}</span>
                </div>
              )}
            </div>
          )}

          {/* Reason / Note */}
          {report.reason && (
            <div className="text-sm text-gray-600 bg-white rounded-lg border border-gray-100 px-4 py-2.5">
              <span className="font-semibold text-gray-700">Lý do: </span>
              {report.reason}
            </div>
          )}
          {report.note && (
            <div className="text-sm text-gray-600 bg-white rounded-lg border border-gray-100 px-4 py-2.5">
              <span className="font-semibold text-gray-700">Ghi chú: </span>
              {report.note}
            </div>
          )}

          {/* Ngày kiểm định */}
          {report.createAt && (
            <div className="text-xs text-gray-400 text-right">
              Kiểm định lúc:{" "}
              {new Date(report.createAt).toLocaleString("vi-VN")}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InspectionReportPanel;
