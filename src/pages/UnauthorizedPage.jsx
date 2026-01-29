import React from "react";
import { Link } from "react-router-dom";
import { MdLock, MdHome, MdArrowBack } from "react-icons/md";

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-orange-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center">
        {/* Icon */}
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <MdLock className="text-red-500" size={40} />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Không có quyền truy cập
        </h1>

        {/* Description */}
        <p className="text-gray-500 mb-8">
          Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị
          viên nếu bạn cho rằng đây là lỗi.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-all"
          >
            <MdArrowBack />
            Quay lại
          </button>
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 transition-all shadow-lg shadow-orange-200"
          >
            <MdHome />
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;