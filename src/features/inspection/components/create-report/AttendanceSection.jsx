import React from "react";
import { MdCheckCircle, MdPeople, MdWarning } from "react-icons/md";

const AttendanceSection = ({
  task,
  attendance,
  onToggle,
  isAttendanceComplete,
  isSomeonePresent,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <MdPeople className="text-emerald-500" />
        Xác nhận mặt đối mặt
        {isAttendanceComplete && (
          <span className="ml-2 px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wider">
            Đã đủ mặt
          </span>
        )}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label
          className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
            attendance.buyerPresent
              ? "border-emerald-500 bg-emerald-50/50"
              : "border-gray-100 bg-gray-50 hover:border-gray-200"
          }`}
        >
          <input
            type="checkbox"
            checked={attendance.buyerPresent}
            onChange={() => onToggle("buyerPresent")}
            className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
          />
          <img
            src={
              task?.buyerAvatar ||
              `https://i.pravatar.cc/150?u=${
                task?.buyerName || task?.buyer?.fullName || "buyer"
              }`
            }
            alt="Buyer"
            className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
          />
          <div className="flex-1">
            <p className="text-[11px] text-gray-500 uppercase font-bold tracking-wider">
              Người mua
            </p>
            <p className="font-bold text-gray-900">
              {task?.buyerName || task?.buyer?.fullName || task?.buyer?.name || "Người mua"}
            </p>
          </div>
          {attendance.buyerPresent && (
            <MdCheckCircle className="text-emerald-500" size={24} />
          )}
        </label>

        <label
          className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
            attendance.sellerPresent
              ? "border-emerald-500 bg-emerald-50/50"
              : "border-gray-100 bg-gray-50 hover:border-gray-200"
          }`}
        >
          <input
            type="checkbox"
            checked={attendance.sellerPresent}
            onChange={() => onToggle("sellerPresent")}
            className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
          />
          <img
            src={
              task?.sellerAvatar ||
              `https://i.pravatar.cc/150?u=${
                task?.sellerName || task?.seller?.fullName || "seller"
              }`
            }
            alt="Seller"
            className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
          />
          <div className="flex-1">
            <p className="text-[11px] text-gray-500 uppercase font-bold tracking-wider">
              Người bán
            </p>
            <p className="font-bold text-gray-900">
              {task?.sellerName || task?.seller?.fullName || task?.seller?.name || "Người bán"}
            </p>
          </div>
          {attendance.sellerPresent && (
            <MdCheckCircle className="text-emerald-500" size={24} />
          )}
        </label>
      </div>

      {!isAttendanceComplete && isSomeonePresent && (
        <p className="mt-4 text-sm text-orange-600 flex items-center gap-2 bg-orange-50 p-3 rounded-lg border border-orange-100">
          <MdWarning size={18} />
          Lưu ý: Báo cáo vắng mặt 1 bên sẽ hủy giao dịch và tự động xử lý tiền cọc
          theo quy định!
        </p>
      )}

      {!isSomeonePresent && (
        <p className="mt-4 text-sm text-red-600 flex items-center gap-2 bg-red-50 p-3 rounded-lg border border-red-100">
          <MdWarning size={18} />
          Vui lòng xác nhận sự có mặt của ít nhất một bên để tạo báo cáo!
        </p>
      )}
    </div>
  );
};

export default AttendanceSection;
