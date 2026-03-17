import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import BikeCard from "../features/bicycle/components/BikeCard";
import { bikeService } from "../services/bikeService";
import {
  MdArrowForward,
  MdVerifiedUser,
  MdSecurity,
  MdSearch,
  MdLocationOn,
} from "react-icons/md";

const HomePage = () => {
  const [keyword, setKeyword] = useState("");
  const [latestBikes, setLatestBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLatestBikes = async () => {
      try {
        const response = await bikeService.getAllBikeListings();
        if (response && response.result) {
          const sortedBikes = response.result
            .filter(
              (b) =>
                b.status?.toUpperCase() === "AVAILABLE" ||
                b.status === "Available",
            )
            .sort((a, b) => b.listingId - a.listingId)
            .slice(0, 8);

          setLatestBikes(sortedBikes);
        }
      } catch (error) {
        console.error("Lỗi khi tải xe mới nhất:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestBikes();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/bikes?search=${encodeURIComponent(keyword)}`);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* --- HERO SECTION --- */}
      <div className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-orange-700 z-0"></div>
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] z-0 mix-blend-overlay"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/30 bg-orange-900/20 backdrop-blur-md mb-8">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
              <span className="text-xs font-bold text-orange-100 tracking-wider uppercase">
                Cộng đồng chơi xe chuyên nghiệp Sài Gòn
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6 leading-tight">
              Sàn Giao Dịch Xe Đạp <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-200">
                Chuẩn Inspector
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 mb-10 font-light leading-relaxed max-w-2xl mx-auto">
              Nơi kết nối đam mê của các biker Sài Thành. Không lo lừa đảo,
              không ship COD rủi ro. Mọi giao dịch đều được kiểm định trực tiếp
              tại
              <span className="text-white font-bold">
                {" "}
                Trạm Giao Dịch VeloX TP.HCM
              </span>
              .
            </p>

            <form
              onSubmit={handleSearch}
              className="bg-white/10 backdrop-blur-md p-2 rounded-full max-w-2xl mx-auto border border-white/20 flex items-center shadow-2xl relative z-20"
            >
              <div className="pl-6 text-gray-300">
                <MdSearch size={24} />
              </div>
              <input
                type="text"
                placeholder="Tìm dòng xe bạn thích (VD: Trek, Specialized...)"
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
            <p className="mt-4 text-sm text-gray-400 font-medium">
              *Hệ thống chỉ hỗ trợ giao dịch và kiểm định trực tiếp khu vực nội
              thành TP. Hồ Chí Minh
            </p>
          </div>
        </div>
      </div>

      {/* --- LATEST BIKES --- */}
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">
              Mới lên sàn
            </h2>
            <p className="text-zinc-500 mt-2 text-lg">
              Các siêu phẩm vừa được anh em biker Sài Gòn đăng bán.
            </p>
          </div>
          <Link
            to="/bikes"
            className="group flex items-center gap-2 px-6 py-3 rounded-full border border-zinc-200 text-zinc-900 font-bold hover:bg-black hover:text-white transition-all duration-300"
          >
            Khám phá toàn bộ
            <MdArrowForward className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {latestBikes.map((bike, index) => (
              <BikeCard key={bike.listingId || bike.id || index} bike={bike} />
            ))}
          </div>
        )}
      </div>

      {/* --- PROCESS SECTION --- */}
      <div className="bg-zinc-50 py-24 border-t border-zinc-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-zinc-900 mb-4">
              Giao Dịch 3 Bên Minh Bạch
            </h2>
            <p className="text-zinc-500 max-w-2xl mx-auto text-lg">
              VeloX xây dựng sân chơi công bằng cho anh em. Tạm biệt rủi ro mua
              bán xe cũ với quy trình kiểm định chuyên nghiệp ngay tại TP.HCM.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-100 hover:shadow-xl hover:border-orange-200 transition-all duration-300 group">
              <div className="w-14 h-14 bg-zinc-900 text-white rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:bg-orange-600 transition-colors">
                <MdLocationOn />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">
                Gặp Mặt Tại Trạm VeloX
              </h3>
              <p className="text-zinc-500 leading-relaxed">
                Người mua và người bán hẹn gặp trực tiếp tại các Trạm giao dịch
                ủy quyền của VeloX nằm trải đều khắp các quận tại TP.HCM. Tuyệt
                đối không ship xe xa xôi.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-100 hover:shadow-xl hover:border-orange-200 transition-all duration-300 group">
              <div className="w-14 h-14 bg-zinc-900 text-white rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:bg-orange-600 transition-colors">
                <MdVerifiedUser />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">
                Chuyên Gia Thẩm Định
              </h3>
              <p className="text-zinc-500 leading-relaxed">
                Các chuyên gia (Inspector) giàu kinh nghiệm sẽ kiểm tra chéo
                tình trạng khung sườn, bộ truyền động... đảm bảo xe đúng mô tả
                trước khi chốt đơn.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-100 hover:shadow-xl hover:border-orange-200 transition-all duration-300 group">
              <div className="w-14 h-14 bg-zinc-900 text-white rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:bg-orange-600 transition-colors">
                <MdSecurity />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">
                Giữ Tiền An Toàn
              </h3>
              <p className="text-zinc-500 leading-relaxed">
                Tiền đặt cọc được VeloX bảo chứng trung gian. Chỉ khi Inspector
                xác nhận xe đạt chuẩn và hai bên đồng ý mua bán, tiền mới được
                giải ngân.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- CTA SECTION --- */}
      <div className="container mx-auto px-4 py-20">
        <div className="relative rounded-3xl p-12 md:p-20 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black to-orange-800 z-0"></div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
              Lên Đời Xế Yêu Của Bạn?
            </h2>
            <p className="text-orange-100 text-lg mb-10">
              Đăng tin ngay hôm nay. VeloX sẽ hỗ trợ kết nối và sắp xếp lịch
              kiểm định tại Trạm gần nhất khu vực Sài Gòn để bạn bán xe nhanh
              gọn lẹ.
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
