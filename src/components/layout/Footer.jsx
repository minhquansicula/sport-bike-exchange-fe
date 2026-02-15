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
              Sàn thương mại điện tử mua bán xe đạp cũ uy tín hàng đầu Việt Nam.
              Tất cả xe đều được kiểm định chất lượng bởi đội ngũ Inspector
              chuyên nghiệp.
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

          {/* Cột 2: Mua bán */}
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
                  <span className="text-xs">›</span> Mua xe đạp cũ
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
                  to="/pricing"
                  className="hover:text-orange-500 transition-colors flex items-center gap-2"
                >
                  <span className="text-xs">›</span> Bảng giá dịch vụ
                </Link>
              </li>
              <li>
                <Link
                  to="/inspector"
                  className="hover:text-orange-500 transition-colors flex items-center gap-2"
                >
                  <span className="text-xs">›</span> Đội ngũ thẩm định
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
                  <span className="text-xs">›</span> Trung tâm trợ giúp
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-orange-500 transition-colors flex items-center gap-2"
                >
                  <span className="text-xs">›</span> Chính sách bảo mật
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-orange-500 transition-colors flex items-center gap-2"
                >
                  <span className="text-xs">›</span> Quy chế hoạt động
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
              Liên hệ
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MdLocationOn
                  className="text-orange-500 mt-1 shrink-0"
                  size={20}
                />
                <span>Hồ Chí Minh: 123 Đường ABC, Phường XYZ, Quận 1</span>
              </li>
              <li className="flex items-center gap-3">
                <MdEmail className="text-orange-500 shrink-0" size={20} />
                <a
                  href="mailto:support@veloX.vn"
                  className="hover:text-white transition-colors"
                >
                  support@veloX.vn
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MdPhone className="text-orange-500 shrink-0" size={20} />
                <a
                  href="tel:1900123456"
                  className="text-lg font-bold text-white hover:text-orange-500 transition-colors"
                >
                  1900 123 456
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Phần 3: Bottom Footer */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>
            &copy; 2026 VeloX Market. Bản quyền thuộc về Công ty TechBike
            Vietnam.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">
              Điều khoản
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Bảo mật
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
