import React, { useState, useEffect, useMemo } from "react";
import { MOCK_BIKES } from "../../../mockData/bikes";
import BikeCard from "../components/BikeCard";
import BikeFilter from "../components/BikeFilter";
import { MdSort, MdSearchOff } from "react-icons/md";

const BikeListPage = () => {
  // State lưu bộ lọc
  const [filters, setFilters] = useState({
    search: "",
    minPrice: "",
    maxPrice: "",
    type: "",
    brand: "",
    location: "",
  });

  // State sắp xếp
  const [sortOrder, setSortOrder] = useState("newest"); // newest | price_asc | price_desc

  // --- LOGIC LỌC DỮ LIỆU ---
  const filteredBikes = useMemo(() => {
    return MOCK_BIKES.filter((bike) => {
      // 1. Lọc theo tên
      if (
        filters.search &&
        !bike.name.toLowerCase().includes(filters.search.toLowerCase())
      )
        return false;

      // 2. Lọc theo giá
      if (filters.minPrice && bike.price < Number(filters.minPrice))
        return false;
      if (filters.maxPrice && bike.price > Number(filters.maxPrice))
        return false;

      // 3. Lọc theo loại
      if (filters.type && bike.type !== filters.type) return false;

      // 4. Lọc theo hãng
      if (filters.brand && bike.brand !== filters.brand) return false;

      // 5. Lọc theo địa điểm (tìm tương đối)
      if (filters.location && !bike.location.includes(filters.location))
        return false;

      return true;
    }).sort((a, b) => {
      // --- LOGIC SẮP XẾP ---
      switch (sortOrder) {
        case "price_asc":
          return a.price - b.price;
        case "price_desc":
          return b.price - a.price;
        default:
          return b.id - a.id; // Mặc định ID lớn là mới nhất
      }
    });
  }, [filters, sortOrder]);

  const handleReset = () => {
    setFilters({
      search: "",
      minPrice: "",
      maxPrice: "",
      type: "",
      brand: "",
      location: "",
    });
    setSortOrder("newest");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 font-sans">
      <div className="container mx-auto px-4">
        {/* Header trang */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-zinc-900">Mua xe đạp cũ</h1>
            <p className="text-gray-500 mt-1">
              Hơn {MOCK_BIKES.length}+ xe đạp chất lượng đang chờ chủ mới.
            </p>
          </div>

          {/* Dropdown Sắp xếp */}
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
            <MdSort className="text-gray-400" size={20} />
            <span className="text-sm font-bold text-zinc-700">Sắp xếp:</span>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-transparent text-sm font-medium outline-none cursor-pointer text-orange-600"
            >
              <option value="newest">Mới nhất</option>
              <option value="price_asc">Giá thấp đến cao</option>
              <option value="price_desc">Giá cao đến thấp</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* CỘT TRÁI: BỘ LỌC */}
          <div className="hidden lg:block lg:col-span-1">
            <BikeFilter
              filters={filters}
              setFilters={setFilters}
              onReset={handleReset}
            />
          </div>

          {/* CỘT PHẢI: DANH SÁCH XE */}
          <div className="lg:col-span-3">
            {filteredBikes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredBikes.map((bike) => (
                  <BikeCard key={bike.id} bike={bike} />
                ))}
              </div>
            ) : (
              // Trạng thái trống (Empty State)
              <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-300">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                  <MdSearchOff size={32} />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-2">
                  Không tìm thấy xe nào
                </h3>
                <p className="text-gray-500 mb-6">
                  Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm của bạn.
                </p>
                <button
                  onClick={handleReset}
                  className="bg-zinc-900 text-white px-6 py-2.5 rounded-full font-bold hover:bg-orange-600 transition-colors"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BikeListPage;
