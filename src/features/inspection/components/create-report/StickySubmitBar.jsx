import React from "react";
import { MdSave } from "react-icons/md";

const StickySubmitBar = ({
  expectedResult,
  isSubmitting,
  isSomeonePresent,
  onCancel,
}) => {
  return (
    <div className="flex items-center justify-between gap-3 pt-4 sticky bottom-0 bg-gray-50 py-4 border-t border-gray-200 z-10 -mx-4 px-4 md:mx-0 md:px-0">
      <div className="text-sm font-semibold">
        Kết quả dự kiến:{" "}
        {expectedResult === "SUCCESS" ? (
          <span className="text-emerald-600">✓ SUCCESS (Đạt)</span>
        ) : (
          <span className="text-red-500">✗ FAILED (Không đạt)</span>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-bold hover:bg-gray-100 transition-colors shadow-sm"
        >
          Hủy bỏ
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !isSomeonePresent}
          className={`inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all shadow-lg ${
            isSomeonePresent && !isSubmitting
              ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200 hover:shadow-emerald-300 active:scale-95"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Đang lưu...
            </>
          ) : (
            <>
              <MdSave size={20} /> Ban hành chứng nhận
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default StickySubmitBar;
