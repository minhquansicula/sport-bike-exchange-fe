import React from "react";
import { MdClose, MdWarning } from "react-icons/md";

const IssuesSection = ({
  newIssue,
  setNewIssue,
  issues,
  onAddIssue,
  onRemoveIssue,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <MdWarning className="text-yellow-500" />
        Vấn đề phát hiện (nếu có)
      </h2>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="VD: Xước nhẹ ở khung sườn trái..."
          value={newIssue}
          onChange={(e) => setNewIssue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAddIssue();
            }
          }}
          className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-50"
        />
        <button
          type="button"
          onClick={onAddIssue}
          className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 font-bold transition-colors"
        >
          Thêm lỗi
        </button>
      </div>
      {issues.length > 0 && (
        <ul className="space-y-2">
          {issues.map((issue, index) => (
            <li
              key={index}
              className="flex items-center justify-between p-3.5 bg-yellow-50 border border-yellow-100 rounded-xl"
            >
              <span className="text-sm text-yellow-800 font-medium">• {issue}</span>
              <button
                type="button"
                onClick={() => onRemoveIssue(index)}
                className="p-1.5 bg-white text-yellow-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shadow-sm"
              >
                <MdClose size={18} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default IssuesSection;
