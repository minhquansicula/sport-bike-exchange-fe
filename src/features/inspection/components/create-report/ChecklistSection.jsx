import React from "react";
import {
  MdCheckCircle,
  MdHelp,
  MdRemoveCircle,
  MdWarning,
} from "react-icons/md";

const STATUS_CONFIG = {
  PASS: {
    label: "PASS",
    bg: "bg-emerald-500",
    text: "text-white",
    ring: "ring-emerald-400",
    icon: <MdCheckCircle size={16} />,
  },
  FAIL: {
    label: "FAIL",
    bg: "bg-red-500",
    text: "text-white",
    ring: "ring-red-400",
    icon: <MdRemoveCircle size={16} />,
  },
  NOT_CHECKED: {
    label: "Chưa KT",
    bg: "bg-gray-200",
    text: "text-gray-600",
    ring: "ring-gray-300",
    icon: <MdHelp size={16} />,
  },
};

const ChecklistSection = ({
  checklist,
  passCount,
  failCount,
  notCheckedCount,
  onStatusChange,
  onNoteChange,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <MdCheckCircle className="text-emerald-500" />
          Checklist linh kiện
        </h2>

        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">
            ✓ {passCount} PASS
          </span>
          <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-700">
            ✗ {failCount} FAIL
          </span>
          <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">
            ? {notCheckedCount} Chưa KT
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {checklist.map((item, index) => (
          <div
            key={index}
            className={`rounded-xl border p-4 transition-all ${
              item.status === "PASS"
                ? "border-emerald-200 bg-emerald-50/40"
                : item.status === "FAIL"
                  ? "border-red-200 bg-red-50/40"
                  : "border-gray-100 bg-gray-50/60"
            }`}
          >
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <span className="font-semibold text-gray-800 min-w-[130px]">
                {item.name}
              </span>

              <div className="flex gap-2">
                {Object.entries(STATUS_CONFIG).map(([statusKey, cfg]) => (
                  <button
                    key={statusKey}
                    type="button"
                    onClick={() => onStatusChange(index, statusKey)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border-2 ${
                      item.status === statusKey
                        ? `${cfg.bg} ${cfg.text} border-transparent ring-2 ${cfg.ring} shadow-sm scale-105`
                        : "bg-white border-gray-200 text-gray-400 hover:border-gray-300"
                    }`}
                  >
                    {cfg.icon}
                    {cfg.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3">
              <input
                type="text"
                value={item.note}
                onChange={(e) => onNoteChange(index, e.target.value)}
                placeholder={
                  item.status === "FAIL"
                    ? "Mô tả chi tiết lỗi..."
                    : "Ghi chú (tuỳ chọn)..."
                }
                className={`w-full text-sm px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all ${
                  item.status === "FAIL"
                    ? "border-red-300 focus:border-red-400 focus:ring-red-100 bg-white"
                    : "border-gray-200 focus:border-emerald-400 focus:ring-emerald-50 bg-white/70"
                }`}
              />
            </div>
          </div>
        ))}
      </div>

      {notCheckedCount > 0 && (
        <p className="mt-4 text-sm text-amber-600 flex items-center gap-2 bg-amber-50 p-3 rounded-lg border border-amber-100">
          <MdWarning size={18} />
          Còn <strong>{notCheckedCount}</strong> hạng mục chưa được kiểm tra. Kết
          quả sẽ bị tính là FAILED.
        </p>
      )}
    </div>
  );
};

export default ChecklistSection;
