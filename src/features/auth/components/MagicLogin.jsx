// File 2: Tạo src/features/auth/components/MagicLogin.jsx
import React, { useState } from "react";
import { authService } from "../../../services/authService";

const MagicLogin = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleRequestLink = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await authService.requestMagicLink(email);
      setMessage({
        type: "success",
        text: "Link đăng nhập đã được gửi! Vui lòng kiểm tra hộp thư (cả thư rác) của bạn.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: "Không tìm thấy tài khoản với email này hoặc có lỗi xảy ra.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white rounded-3xl shadow-sm border border-slate-100">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-slate-900 mb-2">
          Đăng nhập nhanh
        </h2>
        <p className="text-sm text-slate-500">
          Không cần mật khẩu. Chúng tôi sẽ gửi link đăng nhập vào email của bạn.
        </p>
      </div>

      <form onSubmit={handleRequestLink} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Địa chỉ Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="VD: nguyenvana@gmail.com"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
          />
        </div>

        {message.text && (
          <div
            className={`p-4 rounded-xl text-sm font-medium ${
              message.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-slate-900 hover:bg-orange-500 text-white rounded-xl font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? "Đang gửi..." : "Nhận link đăng nhập"}
        </button>
      </form>
    </div>
  );
};

export default MagicLogin;
