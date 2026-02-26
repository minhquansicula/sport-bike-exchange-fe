import React from "react";
import { useParams, Link } from "react-router-dom";
import { MOCK_BIKES } from "../../../mockData/bikes";
import formatCurrency from "../../../utils/formatCurrency";
import { useAuth } from "../../../hooks/useAuth"; // 👇 Import thêm useAuth

// Import Icons
import {
  MdLocationOn,
  MdVerified,
  MdSecurity,
  MdInfoOutline,
  MdCheckCircle,
  MdArrowForward,
  MdStraighten,
  MdDonutLarge,
  MdSpeed,
  MdFitnessCenter,
  MdCalendarToday,
  MdErrorOutline,
  MdBlock, // Thêm icon báo khóa
} from "react-icons/md";

const BikeDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth(); // 👇 Lấy thông tin user

  // Tìm xe trong mock data
  const bike = MOCK_BIKES.find((b) => b.id === Number(id)) || MOCK_BIKES[0];

  // Logic kiểm tra role
  const userRole = String(user?.role || "").toUpperCase();
  const isStaff = userRole.includes("ADMIN") || userRole.includes("INSPECTOR");

  if (!bike)
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-500">
        Không tìm thấy xe
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-8 font-sans">
      <div className="container mx-auto px-4">
        {/* --- BREADCRUMB --- */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-orange-600 transition-colors">
            Trang chủ
          </Link>
          <span>/</span>
          <Link to="/bikes" className="hover:text-orange-600 transition-colors">
            Mua xe
          </Link>
          <span>/</span>
          <span className="text-zinc-900 font-medium truncate max-w-[200px]">
            {bike.name}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- CỘT TRÁI: ẢNH & CHI TIẾT --- */}
          <div className="lg:col-span-2 space-y-8">
            {/* 1. Hình ảnh chính */}
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm relative group">
              <div className="aspect-[16/10] overflow-hidden bg-gray-100">
                <img
                  src={bike.image}
                  alt={bike.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-zinc-900 text-sm font-bold px-3 py-1.5 rounded-lg shadow-sm border border-gray-100">
                Độ mới:{" "}
                <span className="text-orange-600">{bike.condition}%</span>
              </div>
            </div>

            {/* 2. Thông tin Xe & Mô tả */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
              <h1 className="text-2xl md:text-3xl font-black text-zinc-900 mb-4 leading-tight">
                {bike.name}
              </h1>

              <div className="flex flex-wrap gap-3 mb-8">
                <span className="px-3 py-1 bg-gray-100 text-zinc-600 rounded-md text-sm font-medium">
                  Thương hiệu: <strong>{bike.brand}</strong>
                </span>
                <span className="px-3 py-1 bg-gray-100 text-zinc-600 rounded-md text-sm font-medium">
                  Loại xe: <strong>{bike.type}</strong>
                </span>
                <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded-md text-sm font-medium flex items-center gap-1">
                  <MdLocationOn /> {bike.location}
                </span>
              </div>

              {/* Specs Grid */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
                  <MdInfoOutline className="text-orange-600" /> Thông số kỹ
                  thuật
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-500 text-xs mb-1 flex items-center gap-1">
                      <MdStraighten /> Size Khung
                    </span>
                    <span className="font-semibold text-zinc-800 block truncate">
                      {bike.frame || "N/A"}
                    </span>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-500 text-xs mb-1 flex items-center gap-1">
                      <MdDonutLarge /> Size Bánh
                    </span>
                    <span className="font-semibold text-zinc-800 block truncate">
                      {bike.wheel || "N/A"}
                    </span>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-500 text-xs mb-1 flex items-center gap-1">
                      <MdCalendarToday /> Năm SX
                    </span>
                    <span className="font-semibold text-zinc-800 block truncate">
                      {bike.year || "N/A"}
                    </span>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-500 text-xs mb-1 flex items-center gap-1">
                      <MdErrorOutline /> Phanh
                    </span>
                    <span className="font-semibold text-zinc-800 block truncate">
                      {bike.brake || "N/A"}
                    </span>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-500 text-xs mb-1 flex items-center gap-1">
                      <MdSpeed /> Bộ đề
                    </span>
                    <span className="font-semibold text-zinc-800 block truncate">
                      {bike.gears || "N/A"}
                    </span>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-500 text-xs mb-1 flex items-center gap-1">
                      <MdFitnessCenter /> Trọng lượng
                    </span>
                    <span className="font-semibold text-zinc-800 block truncate">
                      {bike.weight ? `${bike.weight} kg` : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mô tả */}
              <div>
                <h3 className="text-lg font-bold text-zinc-900 mb-2">
                  Mô tả từ người bán
                </h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {bike.description ||
                    "Người bán chưa cung cấp mô tả chi tiết."}
                </p>
              </div>
            </div>

            {/* 3. Thông tin Người bán */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={
                    bike.seller?.avatar ||
                    "https://ui-avatars.com/api/?name=User"
                  }
                  alt="Seller"
                  className="w-14 h-14 rounded-full border-2 border-orange-100"
                />
                <div>
                  <h4 className="font-bold text-zinc-900 text-lg">
                    {bike.seller?.name || bike.posterName}
                  </h4>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <MdVerified className="text-blue-500" /> Thành viên uy tín
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-400 block">Tham gia từ</span>
                <span className="text-sm font-medium text-zinc-700">2024</span>
              </div>
            </div>
          </div>

          {/* --- CỘT PHẢI: HÀNH ĐỘNG (Sticky) --- */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Card Giá & Hành Động */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/50">
                <div className="mb-6 border-b border-gray-100 pb-4">
                  <p className="text-sm text-gray-500 mb-1">Giá niêm yết</p>
                  <div className="flex items-end gap-3">
                    <span className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">
                      {formatCurrency(bike.price)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* 👇 ĐÃ CẬP NHẬT LOGIC NÚT DỰA VÀO ROLE 👇 */}
                  {isStaff ? (
                    <button
                      disabled
                      className="w-full bg-gray-100 text-gray-400 font-bold py-4 rounded-xl cursor-not-allowed flex items-center justify-center gap-2 border border-gray-200"
                    >
                      <MdBlock size={20} />
                      Tài khoản nội bộ không thể mua xe
                    </button>
                  ) : (
                    <>
                      <button className="w-full bg-zinc-900 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-gray-200 hover:shadow-orange-200 flex items-center justify-center gap-2 group animate-in fade-in">
                        Gửi Yêu Cầu Giao Dịch
                        <MdArrowForward className="group-hover:translate-x-1 transition-transform" />
                      </button>

                      <p className="text-xs text-gray-500 text-center px-2 leading-relaxed">
                        *Bạn cần gửi yêu cầu trước. Sau khi người bán xác nhận,
                        chức năng <strong>Đặt Cọc</strong> sẽ được mở khóa.
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Card Lưu ý An toàn */}
              <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
                <h4 className="font-bold text-blue-800 flex items-center gap-2 mb-3">
                  <MdSecurity /> An toàn tuyệt đối
                </h4>
                <ul className="space-y-2 text-sm text-blue-700/80">
                  <li className="flex gap-2 items-start">
                    <MdCheckCircle className="mt-0.5 shrink-0" />
                    <span>Tiền được giữ trung gian tại hệ thống.</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <MdCheckCircle className="mt-0.5 shrink-0" />
                    <span>Chỉ giải ngân khi bạn đã nhận xe và hài lòng.</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <MdCheckCircle className="mt-0.5 shrink-0" />
                    <span>
                      Có chuyên gia Inspector hỗ trợ check xe tại điểm giao
                      dịch.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BikeDetailPage;
