import React, { useState } from "react";
import { MdLock, MdVisibility, MdVisibilityOff, MdSave } from "react-icons/md";
import { userService } from "../../../services/userService";
import { useAuth } from "../../../hooks/useAuth";

const SecurityTab = () => {
  const { user } = useAuth();

  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
    if (message.text) setMessage({ type: "", text: "" });
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (
      !passwords.oldPassword ||
      !passwords.newPassword ||
      !passwords.confirmPassword
    ) {
      setMessage({ type: "error", text: "Vui lòng nhập đầy đủ thông tin!" });
      return;
    }

    if (passwords.newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "Mật khẩu mới phải có ít nhất 6 ký tự!",
      });
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage({ type: "error", text: "Mật khẩu xác nhận không khớp!" });
      return;
    }

    if (passwords.oldPassword === passwords.newPassword) {
      setMessage({
        type: "error",
        text: "Mật khẩu mới phải khác mật khẩu hiện tại!",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Gửi cả mật khẩu cũ và mới xuống Backend
      await userService.changePassword(
        user.userId,
        passwords.oldPassword,
        passwords.newPassword,
      );

      setMessage({ type: "success", text: "Cập nhật mật khẩu thành công!" });
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error("Lỗi đổi mật khẩu:", error);
      // Bắt lỗi từ Backend trả về (ví dụ: Sai mật khẩu cũ)
      const errorMsg =
        error.response?.data?.message ||
        "Mật khẩu cũ không chính xác hoặc có lỗi xảy ra.";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-300 max-w-2xl">
      <h2 className="text-2xl font-bold text-zinc-900 mb-6 pb-4 border-b border-gray-100">
        Bảo mật & Mật khẩu
      </h2>

      {message.text && (
        <div
          className={`p-4 mb-6 rounded-xl text-sm font-medium ${
            message.type === "error"
              ? "bg-red-50 text-red-600 border border-red-100"
              : "bg-green-50 text-green-700 border border-green-100"
          }`}
        >
          {message.text}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleUpdatePassword}>
        <div className="space-y-2">
          <label className="text-sm font-bold text-zinc-700">
            Mật khẩu hiện tại
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-orange-500 transition-colors">
              <MdLock />
            </div>
            <input
              name="oldPassword"
              value={passwords.oldPassword}
              onChange={handleChange}
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

        <div className="space-y-2">
          <label className="text-sm font-bold text-zinc-700">
            Mật khẩu mới
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-orange-500 transition-colors">
              <MdLock />
            </div>
            <input
              name="newPassword"
              value={passwords.newPassword}
              onChange={handleChange}
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

        <div className="space-y-2">
          <label className="text-sm font-bold text-zinc-700">
            Xác nhận mật khẩu mới
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-orange-500 transition-colors">
              <MdLock />
            </div>
            <input
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handleChange}
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

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className={`px-6 py-3 rounded-xl font-bold text-sm text-white shadow-lg flex items-center gap-2 transition-colors ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-zinc-900 hover:bg-orange-600"}`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <MdSave size={18} />
            )}
            {isLoading ? "Đang xử lý..." : "Cập nhật mật khẩu"}
          </button>
        </div>
      </form>

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
