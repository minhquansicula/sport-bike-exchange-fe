import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  MdFavorite,
  MdArrowForward,
  MdSentimentDissatisfied,
} from "react-icons/md";
import { wishlistService } from "../../../services/wishlistService";
import BikeCard from "../../bicycle/components/BikeCard";
import api from "../../../config/api";

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // ✅ CHỈ FETCH KHI ĐÃ LOGIN
    if (token) {
      fetchWishlist();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchWishlist = async () => {
    try {
      /**
       * 1️⃣ Lấy danh sách wishlist (listingId)
       */
      const wishlistRes = await wishlistService.getMyWishlist();
      const wishlistItems = wishlistRes?.result || [];

      /**
       * 2️⃣ Fetch chi tiết bike theo listingId
       */
      const bikeRequests = wishlistItems.map((item) =>
        api.get(`/bikes/${item.listingId}`),
      );

      const bikeResponses = await Promise.all(bikeRequests);
      const bikes = bikeResponses.map((res) => res.data.result);

      setWishlist(bikes);
    } catch (error) {
      console.error("Lỗi tải wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 font-sans">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* --- HEADER --- */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-zinc-900 flex items-center gap-3">
              <span className="bg-red-100 text-red-500 p-2 rounded-full">
                <MdFavorite />
              </span>
              Danh sách yêu thích
            </h1>
            <p className="text-gray-500 mt-2">
              Bạn đang lưu <b>{wishlist.length}</b> chiếc xe quan tâm.
            </p>
          </div>

          <Link
            to="/bikes"
            className="flex items-center gap-2 font-bold text-orange-600 hover:text-orange-700 transition-colors bg-white px-5 py-2.5 rounded-xl shadow-sm border border-gray-100"
          >
            Tiếp tục xem xe <MdArrowForward />
          </Link>
        </div>

        {/* --- CONTENT --- */}
        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlist.map((bike) => (
              <div key={bike.id} className="relative group-item">
                <BikeCard bike={bike} />
              </div>
            ))}
          </div>
        ) : (
          /* --- EMPTY STATE --- */
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm text-center">
            <div className="w-24 h-24 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mb-6">
              <MdSentimentDissatisfied size={48} />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-2">
              Danh sách trống trơn!
            </h3>
            <p className="text-gray-500 max-w-md mb-8">
              Bạn chưa lưu chiếc xe nào. Hãy dạo một vòng chợ xe và thả tim cho
              những chiếc xe bạn ưng ý nhé.
            </p>
            <Link
              to="/bikes"
              className="bg-zinc-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
            >
              Khám phá ngay
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
