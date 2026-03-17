import React from "react";
import { Link } from "react-router-dom";
// Import Icons
import { MdEmail, MdPhone, MdLocationOn, MdPedalBike } from "react-icons/md";
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-[#1a1a1a] text-gray-400 pt-16 pb-8 border-t border-gray-800 font-sans mt-auto">
      <div className="container mx-auto px-4">
        {/* Phần nội dung chính (Main Footer Content) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Cột 1: Brand Info */}
          <div className="space-y-6">
            <Link
              to="/"
              className="text-3xl font-black text-white tracking-tight flex items-center gap-2"
            >
              <MdPedalBike className="text-orange-500" />
              <span>
                Velo<span className="text-orange-500">X</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              Cộng đồng giao dịch xe đạp chuyên nghiệp lớn nhất TP. Hồ Chí Minh.
              Giao dịch trực tiếp, an toàn tuyệt đối với đội ngũ Inspector kiểm
              định tận nơi.
            </p>
            {/* Social Icons */}
            <div className="flex gap-4">
              {[FaFacebook, FaInstagram, FaYoutube, FaTiktok].map(
                (Icon, index) => (
                  <a
                    key={index}
                    href="#"
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all duration-300 hover:-translate-y-1"
                  >
                    <Icon size={18} />
                  </a>
                ),
              )}
            </div>
          </div>

          {/* Cột 2: Khám phá */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-12 after:h-1 after:bg-orange-500 after:rounded-full">
              Khám phá
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/bikes"
                  className="hover:text-orange-500 transition-colors flex items-center gap-2"
                >
                  <span className="text-xs">›</span> Mua xe đạp tại Sài Gòn
                </Link>
              </li>
              <li>
                <Link
                  to="/post-bike"
                  className="hover:text-orange-500 transition-colors flex items-center gap-2"
                >
                  <span className="text-xs">›</span> Đăng tin bán xe
                </Link>
              </li>
              <li>
                <Link
                  to="/events"
                  className="hover:text-orange-500 transition-colors flex items-center gap-2"
                >
                  <span className="text-xs">›</span> Sự kiện & Chợ phiên
                </Link>
              </li>
              <li>
                <Link
                  to="/inspector"
                  className="hover:text-orange-500 transition-colors flex items-center gap-2"
                >
                  <span className="text-xs">›</span> Đội ngũ Inspector
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-12 after:h-1 after:bg-orange-500 after:rounded-full">
              Hỗ trợ khách hàng
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="hover:text-orange-500 transition-colors flex items-center gap-2"
                >
                  <span className="text-xs">›</span> Hệ thống trạm VeloX TP.HCM
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-orange-500 transition-colors flex items-center gap-2"
                >
                  <span className="text-xs">›</span> Quy trình kiểm định xe
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-orange-500 transition-colors flex items-center gap-2"
                >
                  <span className="text-xs">›</span> Phí dịch vụ & Nạp rút tiền
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-orange-500 transition-colors flex items-center gap-2"
                >
                  <span className="text-xs">›</span> Giải quyết khiếu nại
                </a>
              </li>
            </ul>
          </div>

          {/* Cột 4: Liên hệ */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-12 after:h-1 after:bg-orange-500 after:rounded-full">
              Trụ sở chính
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MdLocationOn
                  className="text-orange-500 mt-1 shrink-0"
                  size={20}
                />
                <span className="leading-relaxed">
                  Văn phòng VeloX Hub, 24 Đường D1, Khu Công Nghệ Cao, Tp. Thủ
                  Đức, TP.HCM
                </span>
              </li>
              <li className="flex items-center gap-3">
                <MdEmail className="text-orange-500 shrink-0" size={20} />
                <a
                  href="mailto:support@velox.vn"
                  className="hover:text-white transition-colors"
                >
                  support@velox.vn
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MdPhone className="text-orange-500 shrink-0" size={20} />
                <a
                  href="tel:1900123456"
                  className="text-lg font-bold text-white hover:text-orange-500 transition-colors"
                >
                  1900 888 888
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Phần 3: Bottom Footer */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} VeloX Sài Gòn. Nền tảng thuộc Công
            ty TNHH VeloX Việt Nam.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">
              Điều khoản sử dụng
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Bảo mật thông tin
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Trạm giao dịch
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
