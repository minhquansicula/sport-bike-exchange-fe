import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  MdFavorite,
  MdArrowForward,
  MdSentimentDissatisfied,
  MdDeleteOutline,
} from "react-icons/md";
import { wishlistService } from "../../../services/wishlistService";
import { useWishlist } from "../../../context/WishlistContext";
import formatCurrency from "../../../utils/formatCurrency";

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { wishlistIds, fetchWishlist: refreshContext } = useWishlist();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // ✅ CHỈ FETCH KHI ĐÃ LOGIN
    if (token) {
      fetchWishlist();
    } else {
      setLoading(false);
    }
  }, [wishlistIds]); // Re-fetch khi wishlistIds thay đổi (do toggle từ nơi khác)

  const fetchWishlist = async () => {
    try {
      const wishlistRes = await wishlistService.getMyWishlist();
      setWishlist(wishlistRes?.result || []);
    } catch (error) {
      console.error("Lỗi tải wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (listingId) => {
    try {
      await wishlistService.removeFromWishlist(listingId);
      setWishlist((prev) => prev.filter((item) => item.listingId !== listingId));
      refreshContext();
    } catch (error) {
      console.error("Lỗi xóa khỏi wishlist:", error);
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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {wishlist.map((item) => (
              <div
                key={item.wishlistId}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-shadow"
              >
                <Link to={`/bikes/${item.listingId}`} className="block">
                  <img
                    src={
                      item.listingImageUrl ||
                      "https://placehold.co/600x400/eeeeee/999999?text=No+Image"
                    }
                    alt={item.listingTitle}
                    className="w-full h-48 object-cover"
                  />
                </Link>

                <div className="p-5 space-y-2">
                  <Link to={`/bikes/${item.listingId}`}>
                    <h3 className="font-bold text-zinc-900 text-lg line-clamp-2 hover:text-orange-600 transition-colors">
                      {item.listingTitle}
                    </h3>
                  </Link>

                  <p className="text-orange-600 text-xl font-black">
                    {formatCurrency(item.listingPrice || 0)}
                  </p>

                  <p className="text-sm text-gray-600">
                    Tình trạng: <span className="font-semibold">{item.listingCondition || "Không rõ"}</span>
                  </p>

                  <p className="text-sm text-gray-600">
                    Trạng thái:{" "}
                    <span
                      className={`font-semibold ${
                        item.listingStatus === "Available"
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {item.listingStatus || "Không rõ"}
                    </span>
                  </p>

                  <p className="text-sm text-gray-600">
                    Người bán: <span className="font-semibold">{item.sellerName || "Ẩn danh"}</span>
                  </p>

                  <button
                    onClick={() => handleRemove(item.listingId)}
                    className="w-full mt-3 bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <MdDeleteOutline size={20} />
                    Xóa khỏi yêu thích
                  </button>
                </div>
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
