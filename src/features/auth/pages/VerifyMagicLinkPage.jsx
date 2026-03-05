// File 3: Tạo src/pages/VerifyMagicLinkPage.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { authService } from "../../../services/authService";
import { useAuth } from "../../../context/AuthContext";

const VerifyMagicLinkPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth(); // Import hàm login từ AuthContext của bạn
  const [status, setStatus] = useState("Đang xác thực bảo mật...");
  const [error, setError] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get("token");
      if (!token) {
        setStatus("Link đăng nhập không hợp lệ hoặc đã bị hỏng.");
        setError(true);
        return;
      }

      try {
        const response = await authService.verifyMagicLink(token);

        // Cấu trúc response trả về từ ApiResponse của Backend
        if (response && response.result && response.result.token) {
          const accessToken = response.result.token;

          login(accessToken); // Lưu token và cập nhật state đăng nhập

          setStatus("Đăng nhập thành công! Đang chuyển hướng đến Trang chủ...");
          setTimeout(() => {
            navigate("/"); // Chuyển hướng sau khi lưu thành công
          }, 1500);
        } else {
          throw new Error("Không nhận được token");
        }
      } catch (err) {
        setStatus(
          "Link đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng thử lại.",
        );
        setError(true);
      }
    };

    verifyToken();
  }, [searchParams, navigate, login]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 max-w-md w-full text-center">
        <div className="mb-6">
          {error ? (
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
              !
            </div>
          ) : (
            <div className="w-16 h-16 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mx-auto text-2xl font-bold animate-pulse">
              ...
            </div>
          )}
        </div>
        <h2 className="text-xl font-black text-slate-900 mb-2">
          Xác thực đăng nhập
        </h2>
        <p
          className={`text-sm font-medium ${error ? "text-red-600" : "text-slate-500"}`}
        >
          {status}
        </p>

        {error && (
          <button
            onClick={() => navigate("/login")}
            className="mt-6 px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors"
          >
            Quay lại trang đăng nhập
          </button>
        )}
      </div>
    </div>
  );
};

export default VerifyMagicLinkPage;
