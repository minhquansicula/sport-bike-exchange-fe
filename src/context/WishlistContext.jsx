import React, { createContext, useContext, useState, useEffect } from "react";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  // Load từ LocalStorage khi mở web
  useEffect(() => {
    const stored = localStorage.getItem("wishlist");
    if (stored) setWishlist(JSON.parse(stored));
  }, []);

  // Hàm kiểm tra xe đã thích chưa
  const isInWishlist = (id) => wishlist.some((item) => item.id === id);

  // Hàm Thêm/Xóa
  const toggleWishlist = (item) => {
    setWishlist((prev) => {
      let newWishlist;
      if (isInWishlist(item.id)) {
        // Nếu có rồi -> Xóa đi
        newWishlist = prev.filter((i) => i.id !== item.id);
      } else {
        // Nếu chưa có -> Thêm vào
        newWishlist = [...prev, item];
      }
      localStorage.setItem("wishlist", JSON.stringify(newWishlist));
      return newWishlist;
    });
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, toggleWishlist, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
