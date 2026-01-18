import React from "react";
import { Link } from "react-router-dom";
import BikeCard from "../features/bicycle/components/BikeCard";
import { MOCK_BIKES } from "../mockData/bikes";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 1. Hero Section (Banner) */}
      <div className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Mua Bán Xe Đạp Cũ{" "}
            <span className="text-orange-500">Uy Tín & Chất Lượng</span>
          </h1>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            Nền tảng kết nối người đam mê xe đạp. Tất cả xe đều được kiểm định
            bởi chuyên gia Inspector trước khi giao dịch.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/bikes"
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-bold transition"
            >
              Tìm Xe Ngay
            </Link>
            <Link
              to="/post-bike"
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-lg font-bold backdrop-blur-sm transition"
            >
              Đăng Bán Xe
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Featured Section (Danh sách xe nổi bật) */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Xe Mới Đăng</h2>
            <p className="text-gray-500 mt-1">
              Các mẫu xe vừa được cập nhật hôm nay
            </p>
          </div>
          <Link
            to="/bikes"
            className="text-orange-600 font-semibold hover:underline"
          >
            Xem tất cả &rarr;
          </Link>
        </div>

        {/* Lưới sản phẩm (Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_BIKES.map((bike) => (
            <BikeCard key={bike.id} bike={bike} />
          ))}
        </div>
      </div>

      {/* 3. Why Choose Us (Vì sao chọn chúng tôi) */}
      <div className="bg-white py-12 border-t">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8 text-center">
          <div className="p-4">
            <div className="text-4xl mb-3">🛡️</div>
            <h3 className="font-bold text-lg mb-2">Kiểm Định Minh Bạch</h3>
            <p className="text-gray-500 text-sm">
              Inspector chuyên nghiệp kiểm tra từng chi tiết xe trước khi bạn
              xuống tiền.
            </p>
          </div>
          <div className="p-4">
            <div className="text-4xl mb-3">💰</div>
            <h3 className="font-bold text-lg mb-2">Giá Cả Hợp Lý</h3>
            <p className="text-gray-500 text-sm">
              So sánh giá dễ dàng, thương lượng trực tiếp, không lo bị "hớ".
            </p>
          </div>
          <div className="p-4">
            <div className="text-4xl mb-3">🚀</div>
            <h3 className="font-bold text-lg mb-2">Giao Dịch Nhanh Gọn</h3>
            <p className="text-gray-500 text-sm">
              Hỗ trợ thủ tục đặt cọc và thanh toán an toàn qua nền tảng.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// 👇 Dòng này quan trọng nhất để sửa lỗi router
export default HomePage;
