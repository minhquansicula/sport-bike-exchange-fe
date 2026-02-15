import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BikeCard from "../features/bicycle/components/BikeCard";
import { MOCK_BIKES } from "../mockData/bikes";
// Import Icons
import {
  MdArrowForward,
  MdVerifiedUser,
  MdSecurity,
  MdSearch,
  MdLocationOn,
} from "react-icons/md";

const HomePage = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/bikes?search=${encodeURIComponent(keyword)}`);
    }
  };

  // 👇 THÊM DÒNG NÀY: Chỉ lấy 4 xe mới nhất để hiển thị
  // (Bạn có thể đổi số 4 thành 8 nếu muốn hiện nhiều hơn)
  const latestBikes = MOCK_BIKES.slice(0, 8);

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* ... (Phần 1: HERO SECTION giữ nguyên) ... */}
      <div className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-orange-700 z-0"></div>
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] z-0 mix-blend-overlay"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/30 bg-orange-900/20 backdrop-blur-md mb-8">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
              <span className="text-xs font-bold text-orange-100 tracking-wider uppercase">
                Mô hình giao dịch trực tiếp 3 bên
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6 leading-tight">
              Sàn Xe Đạp Cũ <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-200">
                Chuẩn Inspector
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 mb-10 font-light leading-relaxed max-w-2xl mx-auto">
              Không ship cod, không rủi ro. Người mua, Người bán và Chuyên gia
              kiểm định gặp mặt trực tiếp tại
              <span className="text-white font-bold">
                {" "}
                Trạm Giao Dịch VeloX
              </span>{" "}
              để chốt đơn an toàn.
            </p>

            {/* SEARCH BAR */}
            <form
              onSubmit={handleSearch}
              className="bg-white/10 backdrop-blur-md p-2 rounded-full max-w-2xl mx-auto border border-white/20 flex items-center shadow-2xl relative z-20"
            >
              <div className="pl-6 text-gray-300">
                <MdSearch size={24} />
              </div>
              <input
                type="text"
                placeholder="Tìm dòng xe bạn thích (VD: Trek, Giant...)"
                className="flex-1 h-12 bg-transparent border-none outline-none text-white placeholder-gray-400 text-lg px-4"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <button
                type="submit"
                className="bg-orange-600 hover:bg-orange-500 text-white h-12 px-8 rounded-full font-bold transition-all flex items-center justify-center cursor-pointer"
              >
                Tìm Xe
              </button>
            </form>

            <p className="mt-4 text-sm text-gray-400">
              *Hơn 100+ điểm giao dịch trên toàn quốc hỗ trợ kiểm tra xe
            </p>
          </div>
        </div>
      </div>

      {/* --- 2. LATEST BIKES (Đã sửa logic hiển thị ít xe) --- */}
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">
              Mới lên sàn
            </h2>
            <p className="text-zinc-500 mt-2 text-lg">
              Các xe vừa được chủ nhân đăng bán, chờ bạn đến xem.
            </p>
          </div>
          <Link
            to="/bikes"
            className="group flex items-center gap-2 px-6 py-3 rounded-full border border-zinc-200 text-zinc-900 font-bold hover:bg-black hover:text-white transition-all duration-300"
          >
            Xem tất cả xe
            <MdArrowForward className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* 👇 SỬA Ở ĐÂY: Dùng latestBikes thay vì MOCK_BIKES */}
          {latestBikes.map((bike) => (
            <BikeCard key={bike.id} bike={bike} />
          ))}
        </div>
      </div>

      {/* --- 3. WHY US (Giữ nguyên) --- */}
      <div className="bg-zinc-50 py-24 border-t border-zinc-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-zinc-900 mb-4">
              Quy trình Giao dịch An toàn
            </h2>
            <p className="text-zinc-500 max-w-2xl mx-auto">
              Chúng tôi loại bỏ hoàn toàn rủi ro mua bán online bằng mô hình gặp
              mặt trực tiếp có chuyên gia hỗ trợ.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-100 hover:shadow-xl hover:border-orange-200 transition-all duration-300 group">
              <div className="w-14 h-14 bg-zinc-900 text-white rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:bg-orange-600 transition-colors">
                <MdLocationOn />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">
                Gặp tại Điểm Giao Dịch
              </h3>
              <p className="text-zinc-500 leading-relaxed">
                Không ship xe. Người mua và người bán hẹn gặp nhau tại các Trạm
                giao dịch ủy quyền của VeloX để xem xe thực tế.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-100 hover:shadow-xl hover:border-orange-200 transition-all duration-300 group">
              <div className="w-14 h-14 bg-zinc-900 text-white rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:bg-orange-600 transition-colors">
                <MdVerifiedUser />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">
                Inspector Check Xe
              </h3>
              <p className="text-zinc-500 leading-relaxed">
                Tại điểm giao dịch, chuyên gia Inspector sẽ có mặt để kiểm tra
                tình trạng xe, đảm bảo xe đúng mô tả trước khi bạn trả tiền.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-100 hover:shadow-xl hover:border-orange-200 transition-all duration-300 group">
              <div className="w-14 h-14 bg-zinc-900 text-white rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:bg-orange-600 transition-colors">
                <MdSecurity />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">
                Thanh toán Đảm bảo
              </h3>
              <p className="text-zinc-500 leading-relaxed">
                Tiền được giữ trung gian. Chỉ khi Inspector xác nhận xe đạt
                chuẩn và bạn đồng ý mua, tiền mới được chuyển cho người bán.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- 4. CTA BANNER (Giữ nguyên) --- */}
      <div className="container mx-auto px-4 py-20">
        <div className="relative rounded-3xl p-12 md:p-20 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black to-orange-800 z-0"></div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
              Bạn muốn bán xe cũ?
            </h2>
            <p className="text-orange-100 text-lg mb-10">
              Mang xe đến điểm giao dịch gần nhất, Inspector sẽ định giá và hỗ
              trợ bạn bán xe nhanh chóng.
            </p>
            <Link
              to="/post-bike"
              className="inline-flex items-center justify-center bg-white text-orange-700 px-10 py-4 rounded-full font-black text-lg hover:bg-gray-100 hover:scale-105 transition-all shadow-xl"
            >
              Đăng Tin Bán Xe
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
