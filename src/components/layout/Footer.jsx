import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-auto">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Cột 1: Logo & Giới thiệu */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span>🚴‍♂️</span> OldBike Market
          </h2>
          <p className="text-sm leading-relaxed text-gray-400">
            Nền tảng mua bán, trao đổi xe đạp cũ uy tín hàng đầu Việt Nam. Tất
            cả xe đều được kiểm định chất lượng bởi chuyên gia.
          </p>
        </div>

        {/* Cột 2: Liên kết nhanh */}
        <div>
          <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">
            Khám phá
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/bikes" className="hover:text-primary transition">
                Mua xe đạp cũ
              </Link>
            </li>
            <li>
              <Link to="/post-bike" className="hover:text-primary transition">
                Đăng bán xe
              </Link>
            </li>
            <li>
              <Link to="/news" className="hover:text-primary transition">
                Tin tức xe đạp
              </Link>
            </li>
            <li>
              <Link to="/guides" className="hover:text-primary transition">
                Hướng dẫn kiểm tra xe
              </Link>
            </li>
          </ul>
        </div>

        {/* Cột 3: Chính sách */}
        <div>
          <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">
            Hỗ trợ
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-primary transition">
                Trung tâm trợ giúp
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary transition">
                Quy định đăng tin
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary transition">
                Chính sách bảo mật
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary transition">
                Giải quyết tranh chấp
              </a>
            </li>
          </ul>
        </div>

        {/* Cột 4: Liên hệ */}
        <div>
          <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">
            Liên hệ
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span>📍</span> 123 Đường Láng, Hà Nội
            </li>
            <li className="flex items-center gap-2">
              <span>📧</span> support@oldbike.vn
            </li>
            <li className="flex items-center gap-2">
              <span>📞</span> 1900 123 456
            </li>
          </ul>
          <div className="mt-4 flex gap-4">
            {/* Social Icons giả */}
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-600 cursor-pointer transition">
              F
            </div>
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-pink-600 cursor-pointer transition">
              I
            </div>
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-red-600 cursor-pointer transition">
              Y
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} OldBike Market. All rights reserved.
      </div>
    </footer>
  );
};

// 👇 Dòng này quan trọng nhất để sửa lỗi của bạn
export default Footer;
