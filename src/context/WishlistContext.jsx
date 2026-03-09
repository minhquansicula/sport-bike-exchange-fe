import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { wishlistService } from "../services/wishlistService";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  // Set chứa các listingId đã yêu thích
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [loading, setLoading] = useState(false);

  // Fetch wishlist từ API khi đăng nhập
  const fetchWishlist = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setWishlistIds(new Set());
      return;
    }

    try {
      setLoading(true);
      const res = await wishlistService.getMyWishlist();
      const items = res?.result || [];
      setWishlistIds(new Set(items.map((item) => item.listingId)));
    } catch (error) {
      console.error("Lỗi tải wishlist:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Tự động fetch khi mount (nếu đã login)
  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // Kiểm tra xe có trong wishlist không
  const isInWishlist = useCallback(
    (listingId) => wishlistIds.has(listingId),
    [wishlistIds],
  );

  // Toggle thêm/xóa xe khỏi wishlist (gọi API)
  const toggleWishlist = useCallback(
    async (listingId) => {
      const token = localStorage.getItem("token");
      if (!token) {
        // Chưa đăng nhập → thông báo hoặc redirect
        alert("Vui lòng đăng nhập để sử dụng danh sách yêu thích!");
        return;
      }

      // Optimistic update
      setWishlistIds((prev) => {
        const next = new Set(prev);
        if (next.has(listingId)) {
          next.delete(listingId);
        } else {
          next.add(listingId);
        }
        return next;
      });

      try {
        const res = await wishlistService.toggleWishlist(listingId);
        // BE trả WishlistToggleResponse: { addToWishlist: true/false, message: "..." }
        const added = res?.result?.addToWishlist;

        // Đồng bộ lại nếu server trả khác
        setWishlistIds((prev) => {
          const next = new Set(prev);
          if (added) {
            next.add(listingId);
          } else {
            next.delete(listingId);
          }
          return next;
        });
      } catch (error) {
        console.error("Lỗi toggle wishlist:", error);
        // Rollback nếu lỗi
        setWishlistIds((prev) => {
          const next = new Set(prev);
          if (next.has(listingId)) {
            next.delete(listingId);
          } else {
            next.add(listingId);
          }
          return next;
        });
      }
    },
    [],
  );

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistCount: wishlistIds.size,
        loading,
        isInWishlist,
        toggleWishlist,
        fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
