import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../services/authService"; // Import service
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
// Import Icons
import {
  MdEmail,
  MdLock,
  MdPerson,
  MdArrowBack,
  MdAppRegistration,
  MdVisibility,
  MdVisibilityOff,
  MdPhone, // Thêm icon điện thoại
} from "react-icons/md";

// Validation Schema với Yup
const registerValidationSchema = Yup.object({
  username: Yup.string()
    .required("Vui lòng nhập tên đăng nhập")
    .min(3, "Tên đăng nhập phải có ít nhất 3 ký tự")
    .max(20, "Tên đăng nhập không quá 20 ký tự")
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "Tên đăng nhập chỉ chứa chữ, số và dấu gạch dưới"
    ),
  fullName: Yup.string()
    .required("Vui lòng nhập họ và tên")
    .min(3, "Họ và tên phải có ít nhất 3 ký tự"),
  email: Yup.string()
    .required("Vui lòng nhập email")
    .email("Email không hợp lệ"),
  phone: Yup.string()
    .matches(/^[0-9]{10,11}$/, "Số điện thoại phải có 10-11 chữ số")
    .nullable(),
  password: Yup.string()
    .required("Vui lòng nhập mật khẩu")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  confirmPassword: Yup.string()
    .required("Vui lòng xác nhận mật khẩu")
    .oneOf([Yup.ref("password")], "Mật khẩu xác nhận không khớp"),
});

const RegisterForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // Hàm xử lý Submit
  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    setStatus(null);

    try {
      // Chuẩn bị dữ liệu gửi lên (loại bỏ confirmPassword)
      const dataToSend = {
        username: values.username,
        password: values.password,
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
      };

      // Gọi API
      await authService.register(dataToSend);

      // Thành công -> Chuyển hướng
      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/login");
    } catch (err) {
      // Xử lý lỗi từ Backend trả về
      console.error("Register Error:", err);
      const msg =
        err.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.";
      setStatus(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-50px] right-[-50px] w-60 h-60 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute bottom-[-50px] left-[-50px] w-60 h-60 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

      <div className="bg-white/90 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white relative z-10">
        <Link
          to="/"
          className="absolute top-6 left-6 text-gray-400 hover:text-blue-600 transition-colors"
        >
          <MdArrowBack size={24} />
        </Link>

        <div className="text-center mb-6">
          <div className="inline-block p-3 rounded-full bg-blue-100 text-blue-600 mb-4 shadow-sm">
            <MdAppRegistration size={32} />
          </div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight">
            Tạo Tài Khoản
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Tham gia cộng đồng VeloX ngay hôm nay
          </p>
        </div>

        <Formik
          initialValues={{
            username: "",
            fullName: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={registerValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting, status }) => (
            <>
              {/* Thông báo lỗi */}
              {status && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded mb-4 text-sm animate-pulse">
                  ⚠️ {status}
                </div>
              )}

              <Form className="space-y-4">
                {/* Username */}
                <div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                      <MdPerson size={20} />
                    </div>
                    <Field
                      type="text"
                      name="username"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                      placeholder="Tên đăng nhập (Username)"
                    />
                  </div>
                  {errors.username && touched.username && (
                    <div className="text-red-500 text-xs mt-1 ml-1">
                      {errors.username}
                    </div>
                  )}
                </div>

                {/* Full Name */}
                <div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                      <MdPerson size={20} />
                    </div>
                    <Field
                      type="text"
                      name="fullName"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                      placeholder="Họ và tên đầy đủ"
                    />
                  </div>
                  {errors.fullName && touched.fullName && (
                    <div className="text-red-500 text-xs mt-1 ml-1">
                      {errors.fullName}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                      <MdEmail size={20} />
                    </div>
                    <Field
                      type="email"
                      name="email"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                      placeholder="Địa chỉ Email"
                    />
                  </div>
                  {errors.email && touched.email && (
                    <div className="text-red-500 text-xs mt-1 ml-1">
                      {errors.email}
                    </div>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                      <MdPhone size={20} />
                    </div>
                    <Field
                      type="tel"
                      name="phone"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                      placeholder="Số điện thoại (tùy chọn)"
                    />
                  </div>
                  {errors.phone && touched.phone && (
                    <div className="text-red-500 text-xs mt-1 ml-1">
                      {errors.phone}
                    </div>
                  )}
                </div>

                {/* Password */}
                <div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                      <MdLock size={20} />
                    </div>
                    <Field
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                      placeholder="Mật khẩu (Tối thiểu 6 ký tự)"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <MdVisibilityOff size={20} />
                      ) : (
                        <MdVisibility size={20} />
                      )}
                    </button>
                  </div>
                  {errors.password && touched.password && (
                    <div className="text-red-500 text-xs mt-1 ml-1">
                      {errors.password}
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                      <MdLock size={20} />
                    </div>
                    <Field
                      type="password"
                      name="confirmPassword"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                      placeholder="Xác nhận mật khẩu"
                    />
                  </div>
                  {errors.confirmPassword && touched.confirmPassword && (
                    <div className="text-red-500 text-xs mt-1 ml-1">
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Đang xử lý..." : "Đăng Ký Tài Khoản"}
                </button>
              </Form>
            </>
          )}
        </Formik>

        <p className="mt-8 text-center text-sm text-gray-600">
          Đã có tài khoản?{" "}
          <Link to="/login" className="text-blue-600 font-bold hover:underline">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
