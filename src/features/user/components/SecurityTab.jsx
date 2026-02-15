import React, { useState } from "react";
import { MdLock, MdVisibility, MdVisibilityOff, MdSave } from "react-icons/md";

const SecurityTab = () => {
  // State chỉ để xử lý UI (ẩn/hiện mật khẩu)
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  return (
    <div className="animate-in fade-in duration-300 max-w-2xl">
      <h2 className="text-2xl font-bold text-zinc-900 mb-6 pb-4 border-b border-gray-100">
        Bảo mật & Mật khẩu
      </h2>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        {/* Mật khẩu hiện tại */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-zinc-700">
            Mật khẩu hiện tại
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-orange-500 transition-colors">
              <MdLock />
            </div>
            <input
              type={showOldPass ? "text" : "password"}
              className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-100 transition-all"
              placeholder="Nhập mật khẩu hiện tại"
            />
            <button
              type="button"
              onClick={() => setShowOldPass(!showOldPass)}
              className="absolute right-4 top-3 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              {showOldPass ? (
                <MdVisibilityOff size={20} />
              ) : (
                <MdVisibility size={20} />
              )}
            </button>
          </div>
        </div>

        {/* Mật khẩu mới */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-zinc-700">
            Mật khẩu mới
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-orange-500 transition-colors">
              <MdLock />
            </div>
            <input
              type={showNewPass ? "text" : "password"}
              className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-100 transition-all"
              placeholder="Nhập mật khẩu mới"
            />
            <button
              type="button"
              onClick={() => setShowNewPass(!showNewPass)}
              className="absolute right-4 top-3 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              {showNewPass ? (
                <MdVisibilityOff size={20} />
              ) : (
                <MdVisibility size={20} />
              )}
            </button>
          </div>
        </div>

        {/* Xác nhận mật khẩu mới */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-zinc-700">
            Xác nhận mật khẩu mới
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-orange-500 transition-colors">
              <MdLock />
            </div>
            <input
              type={showConfirmPass ? "text" : "password"}
              className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-100 transition-all"
              placeholder="Nhập lại mật khẩu mới"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPass(!showConfirmPass)}
              className="absolute right-4 top-3 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              {showConfirmPass ? (
                <MdVisibilityOff size={20} />
              ) : (
                <MdVisibility size={20} />
              )}
            </button>
          </div>
        </div>

        {/* Nút lưu (UI Only) */}
        <div className="pt-2">
          <button
            type="button"
            className="bg-zinc-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-orange-600 transition-colors shadow-lg flex items-center gap-2"
            onClick={() =>
              alert("Chức năng đổi mật khẩu đang được phát triển!")
            }
          >
            <MdSave size={18} />
            Cập nhật mật khẩu
          </button>
        </div>
      </form>

      {/* Phần ghi chú UI */}
      <div className="mt-8 p-5 bg-orange-50 rounded-2xl border border-orange-100">
        <h4 className="font-bold text-orange-800 text-sm mb-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-orange-500"></span>
          Lưu ý bảo mật
        </h4>
        <ul className="text-sm text-orange-700/80 list-disc list-inside space-y-1 ml-1">
          <li>Mật khẩu nên có ít nhất 6 ký tự.</li>
          <li>Bao gồm chữ hoa, chữ thường và số để tăng độ mạnh.</li>
          <li>Không chia sẻ mật khẩu cho người lạ.</li>
        </ul>
      </div>
    </div>
  );
};

export default SecurityTab;
